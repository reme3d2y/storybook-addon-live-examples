import React, { FC, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { Language, PrismTheme } from 'prism-react-renderer';
import defaultTheme from 'prism-react-renderer/themes/github';
import { styled } from '@storybook/theming';
import { ActionBar } from '@storybook/components';
import { addons } from '@storybook/addons';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import { DisplayMIcon } from '@alfalab/icons-glyph/DisplayMIcon';
import { MobilePhoneLineMIcon } from '@alfalab/icons-glyph/MobilePhoneLineMIcon';
import { CopyLineMIcon } from '@alfalab/icons-glyph/CopyLineMIcon';
import { ShareMIcon } from '@alfalab/icons-glyph/ShareMIcon';
import { RepeatMIcon } from '@alfalab/icons-glyph/RepeatMIcon';

import {
    extractLanguageFromClassName,
    detectNoInline,
    copyToClipboard,
    transpileTs,
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
    id?: string;
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
    border-radius: ${configValue('borderRadius', 16)}px;
    font-family: ${configValue('fontBase', theme.typography.fonts.base)};
    font-size: ${configValue('fontSizeBase', 16)}px;
  `,
);
const ComponentWrapperL = styled.div(
    ({ theme }) => `
    position: relative;
    border-bottom: 1px solid ${configValue('borderColor', theme.appBorderColor)};
    height: 48px;

  `,
);

const PreviewWrapper = styled.div(`
    position: relative;
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

const LiveEditorWrapper = styled.div<{ live?: boolean; expanded?: boolean, code?: string }>(
    ({ theme, live, expanded, code }) => `
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

const DestopLivePreview  = styled(LivePreview)( `
    padding: 20px;
    height: 280px;
    box-sizing: border-box;
`);

const MobileLivePreview  = styled(LivePreview)( 
    ({ theme }) => `
    padding: 16px;
    position: relative;
    left: 195px;
    border-left: 1px solid ${configValue('borderColor', theme.appBorderColor)};
    border-right: 1px solid ${configValue('borderColor', theme.appBorderColor)};
    transform: translate3d(0, 0, 1px);
    width: 360px;
    height: 800px;
    box-sizing: border-box;
`);

const ActionRepeatWrapper  = styled.div(
    ({ theme }) => `
    margin-left: 20px;
    &::before {
        content: '';
        position: absolute;
        height: 24px;
        width: 1px;
        background-color: ${configValue('borderColor', theme.appBorderColor)};
        right: 55px;
    }
`);


const Wrapper = ({
    onClickDesktop, 
    onClickMobile, 
    onClickCopy, 
    onClickShare,
    onClickCode, 
    onClickReset,
    desktop, 
}: any) => {
const styleWrapper = {
    display: 'flex',
    FlexDirection: 'row',
    justifyContent: 'space-between',
}
    return (
        <div style={{
            ...styleWrapper,
            padding: '10px 14px',
            
        }}>
            <div style={{
                ...styleWrapper,
                width: '80px',
            }}>
                <DisplayMIcon onClick={onClickDesktop} fill={desktop ? "#0B1F35" : '#B6BCC3'} />
                <MobilePhoneLineMIcon onClick={onClickMobile} fill={!desktop ? "#0B1F35" : '#B6BCC3'}/> 
            </div>
            <div style={{
                ...styleWrapper,
                width: '180px',
            }}>
                <CopyLineMIcon onClick={onClickCode} fill='#B6BCC3'/>
                <CopyLineMIcon onClick={onClickCopy} fill='#B6BCC3'/>
                <ShareMIcon onClick={onClickShare} fill='#B6BCC3'/> 
                <ActionRepeatWrapper><RepeatMIcon onClick={onClickReset} fill='#B6BCC3'/></ActionRepeatWrapper>
            </div>
        </div>
    )

}

// temporary hack fix: prevent blinking when url change
const heightCache: Record<string, string> = {};

export const Example: FC<ExampleProps> = ({
    id,
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
        copyText = ['Copy1', 'Copied'],
        shareText = ['Share', 'Share'],
        expandText = ['Show code', 'Hide code'],
    } = config;

    const timerRef = useRef(null);

    const needsTranspile = live && ['typescript', 'tsx'].includes(language);

    // делит код на мобильный и дестопный 
    const getArrCode = (code: string) => {
        let arr = code.split('MOBILE;\n')
            setCodeDestop(arr[0])
            setCodeMobile(arr[1])
    }

    const initialCode = useMemo(() => {
        if (needsTranspile) {
            transpileTs(codeProp).then((transpiled) => {
                let transpiledCode = prettier.format(transpiled, {
                    parser: 'babel',
                    plugins: [parserBabel],
                })
                setCode(transpiledCode);
                getArrCode(transpiledCode)
                setInitCode(transpiledCode);
                setReady(true);
            });

            return '';
        }

        return codeProp.trim();
    }, []);

    const [code, setCode] = useState(initialCode);
    const [codeDestop, setCodeDestop] = useState('');
    const [codeMobile, setCodeMobile] = useState('');

    const [initCode, setInitCode] = useState('');

    const [expanded, setExpanded] = useState(expandedProp || !live);
    const [copied, setCopied] = useState(false);
    const [desktop, setDesktop] = useState(true);

    const [ready, setReady] = useState(!needsTranspile);

    const allowShare = sandboxPath && live && !scope;

    const handleCopy = useCallback(() => {
        copyToClipboard(code).then(() => {
            setCopied(true);
            timerRef.current = setTimeout(() => setCopied(false), 1500);
        });
    }, [code]);

    const handleChange = useCallback((value: string) => {
        getArrCode(value.trim())
        setCode(value.trim())
    }, []);

    const handleShare = () => {
        window.open(
            `${window.parent.location.pathname}?path=${sandboxPath}/code=${encodeURIComponent(
                code,
            )}`,
        );
    };

    const handleReset = () => {
        setCode(initCode)
        setExpanded(!expanded)
    };

    const handleDesktop = () => {
        setDesktop(true)
    }

    const handleMobile = () => {
        setDesktop(false)
    };

    const actions: ActionItem[] = [
        {
            title: copied ? copyText[1] : copyText[0],
            onClick: handleCopy,
        },
        {
            title: 'reset',
            onClick: handleReset,
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
        if (!id) return;

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

        observer.observe(document.getElementById(`preview-${id}`));

        () => {
            observer.disconnect();
        };
    }, [id]);


    return (
        <ComponentWrapper id={`wrapper-${id}`}>
            <LiveProvider
                code={desktop? codeDestop : codeMobile}
                noInline={detectNoInline(code)}
                theme={config.editorTheme || defaultTheme}
                scope={{
                    ...config.scope,
                    ...scope,
                }}
            >
                {live ? (
                    <PreviewWrapper>
                        <ComponentWrapperL>
                        <Wrapper 
                            desktop={desktop}
                            onClickDesktop={handleDesktop} 
                            onClickMobile={handleMobile} 
                            onClickCopy={handleCopy} 
                            onClickShare={handleShare} 
                            onClickCode={() => setExpanded(!expanded)} 
                            onClickReset={handleReset}/>
                        </ComponentWrapperL>

                        {desktop ? 
                        <DestopLivePreview id={`preview-${id}`} /> :
                        <MobileLivePreview id={`preview-${id}`}/> }
                    </PreviewWrapper>
                ) : (
                    <StyledActionBar actionItems={actions} />
                )}

                {ready && expanded && (
                    <LiveEditorWrapper live={live} expanded={true} >
                        <LiveEditor onChange={handleChange} language={language} disabled={!live} code={code} /> 
                    </LiveEditorWrapper>
                )}

                {ready && live && <StyledLiveErrors />}
            </LiveProvider>
        </ComponentWrapper>
    );
};
