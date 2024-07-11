import React, { FC, useState, useEffect, useRef, useMemo } from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { Language } from 'prism-react-renderer';
import defaultTheme from 'prism-react-renderer/themes/vsLight';
import { styled } from '@storybook/theming';
import { DisplayMIcon } from '@alfalab/icons-glyph/DisplayMIcon';
import { MobilePhoneLineMIcon } from '@alfalab/icons-glyph/MobilePhoneLineMIcon';
import { CopyLineMIcon } from '@alfalab/icons-glyph/CopyLineMIcon';
import { RepeatMIcon } from '@alfalab/icons-glyph/RepeatMIcon';
import { extractLanguageFromClassName, detectNoInline, copyToClipboard, uniqId } from './utils';
import { ActionButton } from './ActionButton';
import { ActionBar } from './ActionBar';
import { LOADED_MESSAGE } from './MobileFrame';
import { formatCode, useCode } from './useCode';
import ExpandMIcon from './icons/ExpandMIcon';
import { configValue, getConfig } from '../config';
import { CUSTOM_EVENTS, dispatchCustomEvent } from './events';
import { ShareButton } from './ShareButton';

export type ExampleProps = {
    live?: boolean;
    code?: string;
    expanded?: boolean;
    className?: string;
    language?: Language;
    scope?: Record<string, unknown>;
    mobileOnly?: string | boolean;
    desktopOnly?: string | boolean;
    mobileWidth?: number;
    mobileHeight?: number;
};

const ComponentWrapper = styled.div(
    ({ theme }) => `
    position: relative;
    overflow: hidden;
    border: 1px solid ${configValue('borderColor', theme.appBorderColor)};
    margin: 25px 0 40px;
    border-radius: ${configValue('borderRadius', '16px')};
    font-family: ${configValue('fontBase', theme.typography?.fonts.base)};
    font-size: ${configValue('fontSizeBase', 16)}px;
  `,
);

const Wrapper = styled.div(
    () => `
    position: relative;
`,
);

const PreviewWrapper = styled.div(
    ({ theme }) => `
    background-color: ${configValue('bgColor', theme.background?.app)};
    margin: 0 auto;
    position: relative;
`,
);

const Preview = styled(LivePreview)(
    ({ theme }) => `
    padding: 20px;
    background-color: ${configValue('previewBgColor', theme.background?.app)};
    box-sizing: border-box;
    overflow: auto;
`,
);

const ViewMismatch = styled.div(
    () => `
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: ${configValue('viewMismatchBg', 'rgba(255, 255, 255)')};
`,
);

const ViewMismatchText = styled.div(
    () => `
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    width: 300px;
    color: ${configValue('hintColor', 'rgba(11, 31, 53, 0.3)')};
`,
);

const LiveEditorWrapper = styled.div<{ live?: boolean; expanded?: boolean; code?: string }>(
    ({ theme, live, expanded }) => `
    font-size: ${configValue('fontSizeCode', 14)}px;

    border-top: ${
        live && expanded ? `1px solid ${configValue('borderColor', theme.appBorderColor)}` : 0
    };

    & > div {
        font-family: ${configValue('fontCode', theme.typography?.fonts.mono)} !important;
        outline: 0;
    }

    & textarea,
    & pre {
        padding: ${live ? '12px' : '24px 40px 24px 24px'} !important;
        outline-color: transparent;
    }
`,
);

const StyledLiveErrors = styled(LiveError)(
    ({ theme }) => `
    font-family: ${configValue('fontCode', theme.typography?.fonts.mono)};
    padding: 10px;
    margin: 0;
    background-color: ${configValue('errorsBg', '#feebea')};
    color: ${configValue('errorsColor', '#ef3124')} !important;
    border-top: 1px solid ${configValue('borderColor', theme.appBorderColor)};
`,
);

const FixedButtonContainer = styled.div(
    () => `
    position: absolute;
    right: 8px;
    top: 8px;
    z-index: 1;
`,
);

const MobileFrame = styled.iframe(
    ({ theme }) => `
    display: block;
    border: 0;
    margin: 0 auto;
    background-color: ${configValue('previewBgColor', theme.background?.app)};
    border-left: 1px solid ${configValue('borderColor', theme.appBorderColor)};
    border-right: 1px solid ${configValue('borderColor', theme.appBorderColor)};
`,
);

export const Example: FC<ExampleProps & { example?: number }> = ({
    code: codeProp,
    expanded: expandedProp = false,
    live,
    className,
    language = extractLanguageFromClassName(className),
    scope,
    desktopOnly,
    mobileOnly,
    mobileWidth = 360,
    mobileHeight = 460,
}) => {
    const config = getConfig();

    const query = '(max-width: 767px)';

    const [isMobile, setIsMobile] = useState(window.parent.matchMedia(query).matches);

    const { sandboxPath, mobileFrameName } = config;

    const [view, setView] = useState<'desktop' | 'mobile'>(() => {
        if (isMobile || mobileOnly) return 'mobile';
        if (desktopOnly) return 'desktop';

        return isMobile ? 'mobile' : 'desktop';
    });

    const [expanded, setExpanded] = useState(expandedProp || !live);
    const [mobileFrameAlreadyLoaded, setMobileFrameAlreadyLoaded] = useState(view === 'mobile');

    const frameRef = useRef<HTMLIFrameElement>();

    const { code, setCode, resetCode, resetKey, setResetKey, ready } = useCode({
        initialCode: codeProp,
        desktopOnly,
        mobileOnly,
        live,
        language,
        view,
    });

    const [storyLoaded, setStoryLoaded] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const exampleId = useMemo(() => uniqId(), []);

    const allowShare = sandboxPath && live && !scope;

    const handleIframeLoad = () => {
        setIframeLoaded(true);
    };

    const handleCopy = (value: string) => {
        copyToClipboard(value);
    };

    const handleChange = (value: string) => {
        setCode(value.trim());
    };

    const handleBlur = () => {
        setCode(formatCode(code));
        setResetKey(+new Date());
    };

    const handleViewChange = (view: 'mobile' | 'desktop') => () => {
        setView(view);
        dispatchCustomEvent(CUSTOM_EVENTS.VIEW_CHANGE, { view });
    };

    useEffect(() => {
        const handler = (ev: MessageEvent) => {
            if (ev.data.message === LOADED_MESSAGE && ev.data.exampleId === exampleId.toString()) {
                setStoryLoaded(true);
            }
        };

        window.addEventListener('message', handler);

        return () => window.removeEventListener('message', handler);
    }, []);

    useEffect(() => {
        if (iframeLoaded && frameRef.current) {
            frameRef.current.contentWindow.postMessage({
                code,
                resetKey,
            });
        }
    }, [iframeLoaded, code, storyLoaded, resetKey]);

    useEffect(() => {
        if (view === 'mobile') {
            setMobileFrameAlreadyLoaded(true);
        }
    }, [view]);

    useEffect(() => {
        const mql = window.parent.matchMedia(query);

        const handleMatchChange = () => setIsMobile(mql.matches);

        mql.addEventListener('change', handleMatchChange);

        handleMatchChange();

        return () => {
            mql.removeEventListener('change', handleMatchChange);
        };
    }, [query]);

    if (!ready) return null;

    const noDesktop = Boolean(view === 'desktop' && mobileOnly);
    const noMobile = Boolean(view === 'mobile' && desktopOnly);
    const viewMismatch = noMobile || noDesktop;

    const showEditor = ready && expanded && !viewMismatch;
    const showErrors = ready && live && !viewMismatch;

    const shouldRenderMobileFrame = !isMobile && (view === 'mobile' || mobileFrameAlreadyLoaded);

    const noDesktopText =
        typeof mobileOnly === 'string'
            ? mobileOnly
            : configValue('noDesktopText', 'Not for use on desktop devices');

    const noMobileText =
        typeof desktopOnly === 'string'
            ? desktopOnly
            : configValue('noMobileText', 'Not for use on mobile devices');

    const renderActions = () => {
        if (!live && isMobile) return null;

        if (live) {
            return (
                <ActionBar
                    data-role='action-bar'
                    rightAddons={
                        live && (
                            <ActionButton
                                icon={RepeatMIcon}
                                onClick={resetCode}
                                disabled={viewMismatch}
                                title={configValue('resetText', 'Reset code')}
                            />
                        )
                    }
                >
                    {!isMobile && (
                        <ActionBar.Item>
                            <ActionButton
                                icon={DisplayMIcon}
                                active={view === 'desktop'}
                                onClick={handleViewChange('desktop')}
                                title={configValue('desktopText', 'switch to desktop view')}
                            />

                            <ActionButton
                                icon={MobilePhoneLineMIcon}
                                active={view === 'mobile'}
                                onClick={handleViewChange('mobile')}
                                title={configValue('mobileText', 'Switch to mobile view')}
                            />
                        </ActionBar.Item>
                    )}

                    <ActionBar.Item right={true}>
                        <ActionButton
                            icon={ExpandMIcon}
                            onClick={() => {
                                setExpanded(!expanded);
                                dispatchCustomEvent(CUSTOM_EVENTS.SHOW_SOURCE_CODE, {
                                    shown: !expanded,
                                });
                            }}
                            title={configValue('expandText', 'Expand code')}
                            active={expanded}
                            disabled={viewMismatch}
                        />

                        <ActionButton
                            icon={CopyLineMIcon}
                            onClick={() => {
                                handleCopy(code);
                                dispatchCustomEvent(CUSTOM_EVENTS.COPY);
                            }}
                            title={configValue('copyText', 'Copy code')}
                            doneTitle={configValue('copiedText', 'Code copied')}
                            disabled={viewMismatch}
                        />

                        {allowShare && (
                            <ShareButton
                                code={code}
                                title={configValue('shareText', 'Share code')}
                                doneTitle={configValue('sharedText', 'Link copied')}
                                disabled={viewMismatch}
                            />
                        )}
                    </ActionBar.Item>
                </ActionBar>
            );
        }

        return (
            <FixedButtonContainer>
                <ActionButton
                    icon={CopyLineMIcon}
                    onClick={() => {
                        handleCopy(code);
                        dispatchCustomEvent(CUSTOM_EVENTS.COPY);
                    }}
                    title={configValue('copyText', 'copy code')}
                    doneTitle={configValue('copiedText', 'Code copied')}
                />
            </FixedButtonContainer>
        );
    };

    return (
        <ComponentWrapper data-role='wrapper' className='sb-unstyled'>
            <LiveProvider
                code={code || 'render(null)'}
                noInline={detectNoInline(code)}
                theme={config.editorTheme || defaultTheme}
                scope={{
                    ...config.scope,
                    ...scope,
                }}
            >
                <Wrapper data-role='code-wrapper'>
                    {renderActions()}

                    {live && (
                        <PreviewWrapper className={view} data-role='preview-wrapper'>
                            {!viewMismatch && !noDesktop && (view === 'desktop' || isMobile) && (
                                <Preview data-role='preview' />
                            )}

                            {!noMobile && shouldRenderMobileFrame && (
                                <MobileFrame
                                    data-role='mobile-frame'
                                    src={`iframe.html?id=${mobileFrameName}&viewMode=story`}
                                    ref={frameRef}
                                    data-id={exampleId}
                                    onLoad={handleIframeLoad}
                                    style={{
                                        width: mobileWidth ? +mobileWidth : undefined,
                                        height: mobileHeight ? +mobileHeight : undefined,
                                        display: view === 'mobile' ? 'block' : 'none',
                                    }}
                                />
                            )}

                            {viewMismatch && (
                                <ViewMismatch>
                                    <ViewMismatchText>
                                        {view === 'desktop' && noDesktopText}

                                        {view === 'mobile' && noMobileText}
                                    </ViewMismatchText>
                                </ViewMismatch>
                            )}
                        </PreviewWrapper>
                    )}
                </Wrapper>

                {showEditor && (
                    <LiveEditorWrapper live={live} expanded={true}>
                        <LiveEditor
                            onChange={handleChange}
                            language={language}
                            disabled={!live}
                            key={`${view}_${resetKey}`}
                            onBlur={handleBlur}
                            data-role='editor'
                        />
                    </LiveEditorWrapper>
                )}

                {showErrors && <StyledLiveErrors data-role='errors' />}
            </LiveProvider>
        </ComponentWrapper>
    );
};
