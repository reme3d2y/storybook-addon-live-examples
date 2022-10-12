import React, { FC, useState, useCallback, useEffect } from 'react';
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
    id?: string;
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

// temporary hack fix: prevent blinking when url change
const heightCache: Record<string, string> = {};

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
    overflow: auto;

    &.desktop {
        width: 100%;
        min-height: 200px;
    }

    &.mobile {
        transform: translate3d(0, 0, 1px);
        width: 360px;
        height: 460px;
        border-left: 1px solid ${configValue('borderColor', theme.appBorderColor)};
        border-right: 1px solid ${configValue('borderColor', theme.appBorderColor)};
    }
    `,
);

const ViewMismatch = styled.div(
    ({ theme }) => `
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    width: 300px;
    color: ${configValue('hintColor', 'rgba(11, 31, 53, 0.3)')};
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`,
);

const Preview = styled(LivePreview)(`
    padding: 20px;
    box-sizing: border-box;
`);

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

export const Example: FC<ExampleProps> = ({
    id,
    code: codeProp,
    expanded: expandedProp = false,
    live,
    className,
    language = extractLanguageFromClassName(className),
    scope,
    desktopOnly,
    mobileOnly,
    mobileWidth,
    mobileHeight,
}) => {
    const config = getConfig();

    const { sandboxPath } = config;

    const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

    const [expanded, setExpanded] = useState(expandedProp || !live);

    const { code, setCode, resetCode, ready } = useCode({
        initialCode: codeProp,
        desktopOnly,
        mobileOnly,
        live,
        language,
        view,
    });

    const allowShare = sandboxPath && live && !scope;

    const handleCopy = useCallback(() => {
        copyToClipboard(code);
    }, [code]);

    const handleChange = useCallback(
        (value: string) => {
            setCode(value.trim());
        },
        [view],
    );

    const handleShare = () => {
        window.open(
            `${window.parent.location.pathname}?path=${sandboxPath}/code=${encodeURIComponent(
                code,
            )}`,
        );
    };

    useEffect(() => {
        const preview = document.getElementById(`preview-${id}`);
        if (!preview) return;

        const handler = (entries: ResizeObserverEntry[]) => {
            const wrapperId = `wrapper-${id}`;
            const wrapper = document.getElementById(wrapperId);

            if (!wrapper) return;

            if (entries[0].contentRect.height === 0) {
                wrapper.style.height = heightCache[wrapperId];
            } else {
                wrapper.style.height = '';
                heightCache[wrapperId] = getComputedStyle(wrapper).height;
            }
        };

        const observer = new ResizeObserver(handler);

        observer.observe(preview);

        () => {
            observer.disconnect();
        };
    }, [id]);

    if (!ready) return null;

    const viewMismatch = Boolean(
        (view === 'desktop' && mobileOnly) || (view === 'mobile' && desktopOnly),
    );
    const showEditor = ready && expanded && !viewMismatch;
    const showErrors = ready && live && !viewMismatch;

    const noDesktopText =
        typeof mobileOnly === 'string'
            ? mobileOnly
            : configValue('noDesktopText', 'Not for use on desktop devices');

    const noMobileText =
        typeof desktopOnly === 'string'
            ? desktopOnly
            : configValue('noMobileText', 'Not for use on mobile devices');

    return (
        <ComponentWrapper id={`wrapper-${id}`}>
            <LiveProvider
                code={code}
                noInline={detectNoInline(code)}
                theme={config.editorTheme || defaultTheme}
                scope={{
                    ...config.scope,
                    ...scope,
                }}
            >
                <Wrapper>
                    {live ? (
                        <ActionBar
                            rightAddons={
                                live && (
                                    <ActionButton
                                        icon={<RepeatMIcon />}
                                        onClick={resetCode}
                                        disabled={viewMismatch}
                                    />
                                )
                            }
                        >
                            <ActionBar.Item>
                                <ActionButton
                                    icon={<DisplayMIcon />}
                                    active={view === 'desktop'}
                                    onClick={() => setView('desktop')}
                                    title={configValue('desktopText', 'switch to desktop view')}
                                />

                                <ActionButton
                                    icon={<MobilePhoneLineMIcon />}
                                    active={view === 'mobile'}
                                    onClick={() => setView('mobile')}
                                    title={configValue('mobileText', 'switch to mobile view')}
                                />
                            </ActionBar.Item>

                            <ActionBar.Item right={true}>
                                <ActionButton
                                    icon={<ExpandMIcon />}
                                    onClick={() => setExpanded(!expanded)}
                                    title={configValue('expandText', 'expand code')}
                                    active={expanded}
                                    disabled={viewMismatch}
                                />

                                <ActionButton
                                    icon={<CopyLineMIcon />}
                                    onClick={handleCopy}
                                    title={configValue('copyText', 'copy code')}
                                    disabled={viewMismatch}
                                />

                                {allowShare && (
                                    <ActionButton
                                        icon={<ShareMIcon />}
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
                                icon={<CopyLineMIcon />}
                                onClick={handleCopy}
                                title={configValue('copyText', 'copy code')}
                            />
                        </FixedButtonContainer>
                    )}

                    {live && (
                        <PreviewWrapper
                            className={view}
                            style={
                                view === 'mobile'
                                    ? {
                                          width: mobileWidth ? +mobileWidth : undefined,
                                          height: mobileHeight ? +mobileHeight : undefined,
                                      }
                                    : {}
                            }
                        >
                            {!viewMismatch && <Preview id={`preview-${id}`} />}

                            {viewMismatch && (
                                <ViewMismatch>
                                    {view === 'desktop' && noDesktopText}

                                    {view === 'mobile' && noMobileText}
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
                            key={view}
                        />
                    </LiveEditorWrapper>
                )}

                {showErrors && <StyledLiveErrors />}
            </LiveProvider>
        </ComponentWrapper>
    );
};
