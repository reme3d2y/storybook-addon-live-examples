import React, { FC, useState, useCallback, useEffect, useRef } from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { Language, PrismTheme } from 'prism-react-renderer';
import defaultTheme from 'prism-react-renderer/themes/github';
import { styled } from '@storybook/theming';
import { ActionBar } from '@storybook/components';
import { addons } from '@storybook/addons';

import {
    extractLanguageFromClassName,
    detectNoInline,
    copyToClipboard,
    useCodeFromChildren,
} from './utils';
import { ActionItem } from '@storybook/components/dist/ts3.9/ActionBar/ActionBar';

export const LIVE_EXAMPLES_ADDON_ID = 'storybook-addon-live-examples';

export type Config = {
    borderColor?: string;
    borderRadius?: number;
    barBg?: string;
    actionColor?: string;
    actionAccent?: string;
    errorsBg?: string;
    errorsColor?: string;
    fontCode?: string;
    fontBase?: string;

    sandboxPath?: string;
    copyText?: [string, string];
    shareText?: [string, string];
    expandText?: [string, string];

    editorTheme?: PrismTheme;
    scope: Record<string, any>;
};

export type ExampleProps = {
    live?: boolean;
    children?: string;
    expanded?: boolean;
    className?: string;
    language?: Language;
    scope?: Record<string, unknown>;
};

const ComponentWrapper = styled.div<{ config: Config }>(
    ({ config, theme }) => `
    position: relative;
    overflow: hidden;
    border: 1px solid ${config.borderColor || theme.appBorderColor};
    margin: 25px 0 40px;
    border-radius: ${config.borderRadius || theme.appBorderRadius}px;
    font-family: ${config.fontBase || theme.typography.fonts.base};
    font-size: 14px;
  `,
);

const PreviewWrapper = styled.div(`
    position: relative;
    padding: 30px 20px;
`);

const StyledActionBar = styled(ActionBar)<{ config: Config }>(
    ({ config, theme }) => `
    background-color: transparent;

    & button {
        justify-content: center;
        min-width: 110px;
        transition: box-shadow 0.2s ease;
        background: ${config.barBg || theme.barBg};
        color: ${config.actionColor || theme.color.defaultText};
        border-color: ${config.borderColor || theme.appBorderColor};

        &:focus {
            outline: 0;
            box-shadow: none;
        }

        &:hover {
            box-shadow: ${config.actionAccent || theme.color.secondary} 0 -3px 0 0 inset;
        }
    }
`,
);

const StyledLiveEditor = styled(LiveEditor)<{ live?: boolean; config: Config }>(
    ({ config, theme, live }) => `
    font-family: ${config.fontCode || theme.typography.fonts.mono};
    outline: 0;

    & textarea,
    & pre {
        padding: ${live ? '12px' : '24px'} !important;
        outline-color: transparent;
    }
`,
);

const StyledLiveErrors = styled(LiveError)<{ config: Config }>(
    ({ config, theme }) => `
    font-family: ${config.fontCode || theme.typography.fonts.mono};
    padding: 10px;
    margin: 0;
    background-color: ${config.errorsBg || '#feebea'};
    color: ${config.errorsBg || '#ef3124'} !important;

    &:nth-child(2) {
        border-top: 1px solid ${config.borderColor || theme.appBorderColor};
    }
`,
);

const getConfig = (): Config => {
    return addons.getConfig()[LIVE_EXAMPLES_ADDON_ID] || {};
};

export const Example: FC<ExampleProps> = ({
    children,
    expanded: expandedProp = false,
    live,
    className,
    language = extractLanguageFromClassName(className),
    scope,
}) => {
    const config = getConfig();

    const {
        sandboxPath,
        copyText = ['Copy', 'Copied'],
        shareText = ['Share', 'Share'],
        expandText = ['Show code', 'Hide code'],
    } = config;

    const wrapperRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef(null);

    const codeFromChildren = useCodeFromChildren(children, wrapperRef);

    const [code, setCode] = useState('');
    const [expanded, setExpanded] = useState(expandedProp || !live);
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        copyToClipboard(code).then(() => {
            setCopied(true);
            timerRef.current = setTimeout(() => setCopied(false), 1500);
        });
    }, [code]);

    const handleChange = useCallback((value: string) => setCode(value.trim()), []);

    const handleShare = () => {
        window.open(
            `${window.parent.location.pathname}?path=${sandboxPath}/code=${encodeURIComponent(
                code,
            )}`,
        );
    };

    const actions: ActionItem[] = [
        {
            title: copied ? copyText[1] : copyText[0],
            onClick: handleCopy,
        },
        sandboxPath && {
            title: shareText[0],
            onClick: handleShare,
        },
        live && {
            title: expanded ? expandText[1] : expandText[0],
            onClick: () => setExpanded(!expanded),
        },
    ].filter(Boolean);

    useEffect(() => {
        () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        setCode(codeFromChildren);
    }, [codeFromChildren]);

    return (
        <div ref={wrapperRef}>
            {code ? (
                <LiveProvider
                    code={code}
                    noInline={detectNoInline(code)}
                    theme={config.editorTheme || defaultTheme}
                    scope={{
                        ...config.scope,
                        ...scope,
                    }}
                >
                    <ComponentWrapper config={config}>
                        {live ? (
                            <PreviewWrapper>
                                <StyledActionBar actionItems={actions} config={config} />

                                <LivePreview />
                            </PreviewWrapper>
                        ) : (
                            <StyledActionBar actionItems={actions} config={config} />
                        )}

                        {expanded && (
                            <StyledLiveEditor
                                config={config}
                                live={live}
                                onChange={handleChange}
                                language={language}
                                disabled={!live}
                            />
                        )}

                        {live && <StyledLiveErrors config={config} />}
                    </ComponentWrapper>
                </LiveProvider>
            ) : (
                children
            )}
        </div>
    );
};
