import React, { FC, useState, useCallback, useEffect, useRef } from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { Language } from 'prism-react-renderer';
import defaultTheme from 'prism-react-renderer/themes/vsLight';
import { styled } from '@storybook/theming';
import { DisplayMIcon } from '@alfalab/icons-glyph/DisplayMIcon';
import { MobilePhoneLineMIcon } from '@alfalab/icons-glyph/MobilePhoneLineMIcon';
import { CopyLineMIcon } from '@alfalab/icons-glyph/CopyLineMIcon';
import { ShareMIcon } from '@alfalab/icons-glyph/ShareMIcon';
import { RepeatMIcon } from '@alfalab/icons-glyph/RepeatMIcon';

import { extractLanguageFromClassName, detectNoInline, copyToClipboard } from './utils';
import { ActionButton } from './ActionButton';
import { ActionBar } from './ActionBar';
import { useCode } from './useCode';
import ExpandMIcon from './icons/ExpandMIcon';
import { configValue, getConfig } from '../config';

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
    font-family: ${configValue('fontBase', theme.typography.fonts.base)};
    font-size: ${configValue('fontSizeBase', 16)}px;
  `,
);

const Wrapper = styled.div(`
    position: relative;
`);

const PreviewWrapper = styled.div(
    ({ theme }) => `
    background-color: ${configValue('bgColor', theme.background.app)};
    margin: 0 auto;
    position: relative;
    `,
);

const Preview = styled(LivePreview)(
    ({ theme }) => `
    padding: 20px;
    background-color: ${configValue('previewBgColor', theme.background.app)};
    box-sizing: border-box;
    overflow: auto;
`,
);

const ViewMismatch = styled.div`
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: ${configValue('viewMismatchBg', 'rgba(255, 255, 255)')};
`;

const ViewMismatchText = styled.div`
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    width: 300px;
    color: ${configValue('hintColor', 'rgba(11, 31, 53, 0.3)')};
`;

const LiveEditorWrapper = styled.div<{ live?: boolean; expanded?: boolean; code?: string }>(
    ({ theme, live, expanded }) => `
    font-size: ${configValue('fontSizeCode', 14)}px;

    border-top: ${
        live && expanded ? `1px solid ${configValue('borderColor', theme.appBorderColor)}` : 0
    };

    & > div {
        font-family: ${configValue('fontCode', theme.typography.fonts.mono)} !important;
        outline: 0;
    }

    & textarea,
    & pre {
        padding: ${live ? '12px' : '24px'} !important;
        outline-color: transparent;
    }
`,
);

const StyledLiveErrors = styled(LiveError)(
    ({ theme }) => `
    font-family: ${configValue('fontCode', theme.typography.fonts.mono)};
    padding: 10px;
    margin: 0;
    background-color: ${configValue('errorsBg', '#feebea')};
    color: ${configValue('errorsColor', '#ef3124')} !important;
    border-top: 1px solid ${configValue('borderColor', theme.appBorderColor)};
`,
);

const FixedButtonContainer = styled.div`
    position: absolute;
    right: 8px;
    top: 8px;
    z-index: 1;
`;

const MobileFrame = styled.iframe(
    ({ theme }) => `
    display: block;
    border: 0;
    margin: 0 auto;
    background-color: ${configValue('previewBgColor', theme.background.app)};
    border-left: 1px solid ${configValue('borderColor', theme.appBorderColor)};
    border-right: 1px solid ${configValue('borderColor', theme.appBorderColor)};
`,
);

export const Example: FC<ExampleProps> = ({
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

    const isMobile = window.innerWidth < 768;

    const { sandboxPath, mobileFrameName } = config;

    const [view, setView] = useState<'desktop' | 'mobile'>(isMobile ? 'mobile' : 'desktop');

    const [expanded, setExpanded] = useState(expandedProp || !live);
    const [mobileFrameAlreadyLoaded, setMobileFrameAlreadyLoaded] = useState(view === 'mobile');

    const frameRef = useRef<HTMLIFrameElement>();

    const { code, setCode, resetCode, resetKey, ready } = useCode({
        initialCode: codeProp,
        desktopOnly,
        mobileOnly,
        live,
        language,
        view,
    });

    const [iframeLoaded, setIframeLoaded] = useState(false);

    const allowShare = sandboxPath && live && !scope;

    const handleIframeLoad = () => {
        setIframeLoaded(true);
    };

    const handleCopy = () => {
        copyToClipboard(code);
    };

    const handleChange = (value: string) => {
        setCode(value.trim());
    };

    const handleShare = () => {
        window.open(
            `${window.parent.location.pathname}?path=${sandboxPath}/code=${encodeURIComponent(
                code,
            )}`,
        );
    };

    useEffect(() => {
        if (iframeLoaded && frameRef.current) {
            frameRef.current.contentWindow.postMessage({
                code,
                resetKey,
            });
        }
    }, [iframeLoaded, code, resetKey]);

    useEffect(() => {
        if (view === 'mobile') {
            setMobileFrameAlreadyLoaded(true);
        }
    }, [view]);

    if (!ready) return null;

    const noDesktop = Boolean(view === 'desktop' && mobileOnly);
    const noMobile = Boolean(view === 'mobile' && desktopOnly);
    const viewMismatch = noMobile || noDesktop;

    const showEditor = ready && expanded && !viewMismatch;
    const showErrors = ready && live && !viewMismatch;
    const showActionBar = !isMobile;

    const shouldRenderMobileFrame = !isMobile && (view === 'mobile' || mobileFrameAlreadyLoaded);

    const noDesktopText =
        typeof mobileOnly === 'string'
            ? mobileOnly
            : configValue('noDesktopText', 'Not for use on desktop devices');

    const noMobileText =
        typeof desktopOnly === 'string'
            ? desktopOnly
            : configValue('noMobileText', 'Not for use on mobile devices');

    const renderActions = () =>
        live ? (
            <ActionBar
                rightAddons={
                    live && (
                        <ActionButton
                            icon={RepeatMIcon}
                            onClick={resetCode}
                            disabled={viewMismatch}
                        />
                    )
                }
            >
                <ActionBar.Item>
                    <ActionButton
                        icon={DisplayMIcon}
                        active={view === 'desktop'}
                        onClick={() => setView('desktop')}
                        title={configValue('desktopText', 'switch to desktop view')}
                    />

                    <ActionButton
                        icon={MobilePhoneLineMIcon}
                        active={view === 'mobile'}
                        onClick={() => setView('mobile')}
                        title={configValue('mobileText', 'switch to mobile view')}
                    />
                </ActionBar.Item>

                <ActionBar.Item right={true}>
                    <ActionButton
                        icon={ExpandMIcon}
                        onClick={() => setExpanded(!expanded)}
                        title={configValue('expandText', 'expand code')}
                        active={expanded}
                        disabled={viewMismatch}
                    />

                    <ActionButton
                        icon={CopyLineMIcon}
                        onClick={handleCopy}
                        title={configValue('copyText', 'copy code')}
                        disabled={viewMismatch}
                    />

                    {allowShare && (
                        <ActionButton
                            icon={ShareMIcon}
                            onClick={handleShare}
                            title={configValue('shareText', 'share code')}
                            disabled={viewMismatch}
                        />
                    )}
                </ActionBar.Item>
            </ActionBar>
        ) : (
            <FixedButtonContainer>
                <ActionButton
                    icon={CopyLineMIcon}
                    onClick={handleCopy}
                    title={configValue('copyText', 'copy code')}
                />
            </FixedButtonContainer>
        );

    return (
        <ComponentWrapper>
            <LiveProvider
                code={code || 'render(null)'}
                noInline={detectNoInline(code)}
                theme={config.editorTheme || defaultTheme}
                scope={{
                    ...config.scope,
                    ...scope,
                }}
            >
                <Wrapper>
                    {showActionBar && renderActions()}

                    {live && (
                        <PreviewWrapper className={view}>
                            {!noDesktop && (view === 'desktop' || isMobile) && <Preview />}

                            {!noMobile && shouldRenderMobileFrame && (
                                <MobileFrame
                                    src={`iframe.html?id=${mobileFrameName}&viewMode=story`}
                                    ref={frameRef}
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
                        />
                    </LiveEditorWrapper>
                )}

                {showErrors && <StyledLiveErrors />}
            </LiveProvider>
        </ComponentWrapper>
    );
};
