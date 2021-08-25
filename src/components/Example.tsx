import React, { FC, useState, useCallback, useEffect, useRef } from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { Language } from 'prism-react-renderer';
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

export const LIVE_EXAMPLES_ADDON_ID = 'storybook-addon-live-examples';

const ComponentWrapper = styled.div(
    ({ theme }) => `
    position: relative;
    overflow: hidden;
    border: 1px solid ${theme.appBorderColor};
    margin: 25px 0 40px;
    border-radius: ${theme.appBorderRadius}px;
    font-family: ${theme.typography.fonts.base};
    font-size: 14px;
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
        background: ${theme.barBg};
        color: ${theme.color.defaultText};
        border-color: ${theme.appBorderColor};

        &:focus {
            outline: 0;
            box-shadow: none;
        }

        &:hover {
            box-shadow: ${theme.color.secondary} 0 -3px 0 0 inset;
        }
    }
`,
);

const StyledLiveEditor = styled(LiveEditor)<{ live?: boolean }>(
    ({ theme, live }) => `
    font-family: ${theme.typography.fonts.mono};
    outline: 0;

    & textarea,
    & pre {
        padding: ${live ? '12px' : '24px'} !important;
        outline-color: transparent;
    }
`,
);

const StyledLiveErrors = styled(LiveError)(
    ({ theme }) => `
    font-family: ${theme.typography.fonts.mono};
    padding: 10px;
    margin: 0;
    background-color: #feebea;
    color: #ef3124 !important;

    &:nth-child(2) {
        border-top: 1px solid ${theme.appBorderColor};
    }
`,
);

export type ExampleProps = {
    live?: boolean;
    children?: string;
    expanded?: boolean;
    className?: string;
    language?: Language;
    scope?: Record<string, unknown>;
};

const getConfig = () => {
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

    const actions = [
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
                        ...config.cope,
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
                            <StyledLiveEditor
                                live={live}
                                onChange={handleChange}
                                language={language}
                                disabled={!live}
                            />
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
