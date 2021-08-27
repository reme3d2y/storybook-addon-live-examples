import React, { FC, useState, useCallback, useEffect, useRef } from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { Language, PrismTheme } from 'prism-react-renderer';
import defaultTheme from 'prism-react-renderer/themes/github';
import { styled } from '@storybook/theming';
import { ActionBar } from '@storybook/components';
import { addons } from '@storybook/addons';

import { extractLanguageFromClassName, detectNoInline, copyToClipboard } from './utils';
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
    expanded?: boolean;
    className?: string;
    language?: Language;
    scope?: Record<string, unknown>;
};

const getConfig = () => {
    return addons.getConfig()[LIVE_EXAMPLES_ADDON_ID] || {};
};

const configValue = (key: string, defaultValue: any): Config => {
    return getConfig()[key] || defaultValue;
};

const ComponentWrapper = styled.div(
    ({ theme }) => `
    position: relative;
    overflow: hidden;
    border: 1px solid ${configValue('borderColor', theme.appBorderColor)};
    margin: 25px 0 40px;
    border-radius: ${configValue('borderRadius', theme.appBorderRadius)}px;
    font-family: ${configValue('fontBase', theme.typography.fonts.base)};
    font-size: ${configValue('fontSizeBase', 16)}px;
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
        background: ${configValue('actionBg', theme.actionBg)};
        color: ${configValue('actionColor', theme.color.defaultText)};
        border-color: ${configValue('borderColor', theme.appBorderColor)};

        &:focus {
            outline: 0;
            box-shadow: none;
        }

        &:hover {
            box-shadow: ${configValue('actionAccent', theme.color.secondary)} 0 -3px 0 0 inset;
        }
    }
`,
);

const LiveEditorWrapper = styled.div<{ live?: boolean; expanded?: boolean }>(
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

const StyledLiveErrors = styled(LiveError)<{ expanded?: boolean }>(
    ({ theme, expanded }) => `
    font-family: ${configValue('fontCode', theme.typography.fonts.mono)};
    padding: 10px;
    margin: 0;
    background-color: ${configValue('errorsBg', '#feebea')};
    color: ${configValue('errorsColor', '#ef3124')} !important;
    border-top: 1px solid ${configValue('borderColor', theme.appBorderColor)};
`,
);

export const Example: FC<ExampleProps> = ({
    code: codeProp,
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

    const timerRef = useRef(null);

    const [code, setCode] = useState(codeProp.trim());
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

    return (
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
                    <LiveEditorWrapper live={live} expanded={true}>
                        <LiveEditor onChange={handleChange} language={language} disabled={!live} />
                    </LiveEditorWrapper>
                )}

                {live && <StyledLiveErrors expanded={expanded} />}
            </ComponentWrapper>
        </LiveProvider>
    );
};
