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
    useCodeFromProps,
} from './utils';
import { ActionItem } from '@storybook/components/dist/ts3.9/ActionBar/ActionBar';

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
    live?: boolean;
    code?: string;
    children?: string;
    expanded?: boolean;
    className?: string;
    language?: Language;
    scope?: Record<string, unknown>;
};

const getConfig = (): Config => {
    return addons.getConfig()[LIVE_EXAMPLES_ADDON_ID] || {};
};

const ComponentWrapper = styled.div(
    ({ theme }) => `
    position: relative;
    overflow: hidden;
    border: 1px solid ${getConfig().borderColor || theme.appBorderColor};
    margin: 25px 0 40px;
    border-radius: ${getConfig().borderRadius || theme.appBorderRadius}px;
    font-family: ${getConfig().fontBase || theme.typography.fonts.base};
    font-size: ${getConfig().fontSizeBase || 16}px;
  `,
);

const PreviewWrapper = styled.div(`
    position: relative;
    padding: 30px 20px;
`);

const StyledActionBar = styled(ActionBar)(
    ({ theme }) => `
    background-color: transparent;

    & button {
        justify-content: center;
        min-width: 110px;
        transition: box-shadow 0.2s ease;
        background: ${getConfig().actionBg || theme.actionBg};
        color: ${getConfig().actionColor || theme.color.defaultText};
        border-color: ${getConfig().borderColor || theme.appBorderColor};

        &:focus {
            outline: 0;
            box-shadow: none;
        }

        &:hover {
            box-shadow: ${getConfig().actionAccent || theme.color.secondary} 0 -3px 0 0 inset;
        }
    }
`,
);

const LiveEditorWrapper = styled.div<{ live?: boolean }>(
    ({ theme, live }) => `
    border-top: 1px solid ${getConfig().borderColor || theme.appBorderColor};
    font-size: ${getConfig().fontSizeCode || 14}px;

    & > div {
        font-family: ${getConfig().fontCode || theme.typography.fonts.mono} !important;
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
    font-family: ${getConfig().fontCode || theme.typography.fonts.mono};
    padding: 10px;
    margin: 0;
    background-color: ${getConfig().errorsBg || '#feebea'};
    color: ${getConfig().errorsBg || '#ef3124'} !important;

    &:nth-child(2) {
        border-top: 1px solid ${getConfig().borderColor || theme.appBorderColor};
    }
`,
);

export const Example: FC<ExampleProps> = ({
    children,
    code: codeProp = children,
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

    const codeFromChildren = useCodeFromProps(codeProp, wrapperRef);

    const [code, setCode] = useState('');
    const [expanded, setExpanded] = useState(expandedProp || !live);
    const [copied, setCopied] = useState(false);

    const allowShare = sandboxPath && live;

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
        allowShare && {
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
                    <ComponentWrapper>
                        {live ? (
                            <PreviewWrapper>
                                <StyledActionBar actionItems={actions} />

                                <LivePreview />
                            </PreviewWrapper>
                        ) : (
                            <StyledActionBar actionItems={actions} />
                        )}

                        {expanded && (
                            <LiveEditorWrapper live={live}>
                                <LiveEditor
                                    onChange={handleChange}
                                    language={language}
                                    disabled={!live}
                                />
                            </LiveEditorWrapper>
                        )}

                        {live && <StyledLiveErrors />}
                    </ComponentWrapper>
                </LiveProvider>
            ) : (
                children
            )}
        </div>
    );
};
