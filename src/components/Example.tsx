import React, { FC, useState, useCallback, useEffect } from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { Language, PrismTheme } from 'prism-react-renderer';
import defaultTheme from 'prism-react-renderer/themes/vsLight';
import { styled } from '@storybook/theming';
import { addons } from '@storybook/addons';
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

export const LIVE_EXAMPLES_ADDON_ID = 'storybook-addon-live-examples';

export type Config = {
    borderColor?: string;
    borderRadius?: number;
    actionBg?: string;
    actionColor?: string;
    actionAccent?: string;
    errorsBg?: string;
    errorsColor?: string;
    fontCode?: string;
    fontBase?: string;
    fontSizeCode?: number;
    fontSizeBase?: number;

    sandboxPath?: string;
    copyText?: [string, string];
    shareText?: [string, string];
    expandText?: [string, string];

    editorTheme?: PrismTheme;
    scope: Record<string, any>;
};

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
};

const getConfig = () => {
    return addons.getConfig()[LIVE_EXAMPLES_ADDON_ID] || {};
};

const configValue = (key: string, defaultValue: any): Config => {
    return getConfig()[key] || defaultValue;
};

// temporary hack fix: prevent blinking when url change
const heightCache: Record<string, string> = {};

const ComponentWrapper = styled.div(
    ({ theme }) => `
    position: relative;
    overflow: hidden;
    border: 1px solid ${configValue('borderColor', theme.appBorderColor)};
    margin: 25px 0 40px;
    border-radius: ${configValue('borderRadius', 16)}px;
    font-family: ${configValue('fontBase', theme.typography.fonts.base)};
    font-size: ${configValue('fontSizeBase', 16)}px;
  `,
);

const Wrapper = styled.div(`
    position: relative;
    background: #f0f0f0;
`);

const PreviewWrapper = styled.div`
    background-color: #fafafa;
    margin: 0 auto;
    position: relative;

    &.desktop {
        width: 100%;
        min-height: 200px;
    }

    &.mobile {
        transform: translate3d(0, 0, 1px);
        width: 360px;
        height: 460px;
        border-left: 1px solid #dbdee1;
        border-right: 1px solid #dbdee1;
    }
`;

const ViewMismatch = styled.div`
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    width: 300px;
    color: rgba(11, 31, 53, 0.3);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

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
    ...restProps
}) => {
    console.log(restProps);
    const config = getConfig();

    const {
        sandboxPath,
        desktopText = 'switch to desktop view',
        mobileText = 'switch to mobile view',
        expandText = 'expand code',
        copyText = 'copy code',
        shareText = 'share code',
    } = config;

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
                                    title={desktopText}
                                />

                                <ActionButton
                                    icon={<MobilePhoneLineMIcon />}
                                    active={view === 'mobile'}
                                    onClick={() => setView('mobile')}
                                    title={mobileText}
                                />
                            </ActionBar.Item>

                            <ActionBar.Item right={true}>
                                <ActionButton
                                    icon={<ExpandMIcon />}
                                    onClick={() => setExpanded(!expanded)}
                                    title={expandText}
                                    active={expanded}
                                    disabled={viewMismatch}
                                />

                                <ActionButton
                                    icon={<CopyLineMIcon />}
                                    onClick={handleCopy}
                                    title={copyText}
                                    disabled={viewMismatch}
                                />

                                {allowShare && (
                                    <ActionButton
                                        icon={<ShareMIcon />}
                                        onClick={handleShare}
                                        title={shareText}
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
                                title={copyText}
                            />
                        </FixedButtonContainer>
                    )}

                    {live && (
                        <PreviewWrapper className={view}>
                            {!viewMismatch && <Preview id={`preview-${id}`} />}

                            {viewMismatch && (
                                <ViewMismatch>
                                    {view === 'desktop' &&
                                        (typeof mobileOnly === 'string'
                                            ? mobileOnly
                                            : 'Не предназначен для использования на десктопных устройствах.')}

                                    {view === 'mobile' &&
                                        (typeof desktopOnly === 'string'
                                            ? desktopOnly
                                            : 'Не предназначен для использования на мобильный устройствах.')}
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
