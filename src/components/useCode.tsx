import { useEffect, useRef, useState } from 'react';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import { transpileTs } from './utils';
import { Language } from 'prism-react-renderer';
import { loadGist } from './utils/share';
import { CUSTOM_EVENTS, dispatchCustomEvent } from './events';

type UseCodeProps = {
    initialCode: string;
    live?: boolean;
    code?: string;
    language?: Language;
    mobileOnly?: string | boolean;
    desktopOnly?: string | boolean;
    view?: 'desktop' | 'mobile';
};

const CHUNK_SEPARATOR = /^\s*(?:@|\/\/)MOBILE@?/m;

export const formatCode = (code: string) =>
    prettier.format(code, { parser: 'babel', plugins: [parserBabel] });

const transpile = (code: string) => transpileTs(code).then((jsCode) => formatCode(jsCode));

export function useCode({
    initialCode,
    desktopOnly,
    mobileOnly,
    live,
    language,
    view,
}: UseCodeProps) {
    const [ready, setReady] = useState(false);

    const needsTranspile = live && ['typescript', 'tsx'].includes(language);

    const [resetKey, setResetKey] = useState(+new Date());
    const [commonCode, setCommonCode] = useState('');
    const [mobileCode, setMobileCode] = useState('');
    const [desktopCode, setDesktopCode] = useState('');
    const [desktopInitialCode, setDesktopInitialCode] = useState('');
    const [mobileInitialCode, setMobileInitialCode] = useState('');

    const initialCodeRef = useRef<string>();

    const useCommonCode = CHUNK_SEPARATOR.exec(initialCode) === null;

    const reset = () => {
        setResetKey(+new Date());
        dispatchCustomEvent(CUSTOM_EVENTS.REFRESH);
    };

    const prepareCode = async () => {
        if (/gist:\w+/.test(initialCode)) {
            initialCode = await loadGist(initialCode.split(':')[1]);
        }

        initialCodeRef.current = initialCode;

        await Promise.all(
            initialCode
                .split(CHUNK_SEPARATOR)
                .map((s) => s.trim())
                .map((codeChunk) => (needsTranspile ? transpile(codeChunk) : codeChunk)),
        ).then(([desktop = '', mobile = '']) => {
            setCommonCode(desktop);

            if (!useCommonCode) {
                setDesktopCode(desktop);
                setMobileCode(mobile);
                setDesktopInitialCode(desktop);
                setMobileInitialCode(mobile);
            }

            setReady(true);
        });
    };

    useEffect(() => {
        prepareCode();
    }, []);

    let code = commonCode;
    let setCode = setCommonCode;
    let resetCode = () => {
        reset();
        setCommonCode(initialCodeRef.current);
    };

    if (!useCommonCode) {
        if (view === 'desktop') {
            code = mobileOnly ? '' : desktopCode;
            setCode = setDesktopCode;
            resetCode = () => {
                reset();
                setDesktopCode(desktopInitialCode);
            };
        }

        if (view === 'mobile') {
            code = desktopOnly ? '' : mobileCode;
            setCode = setMobileCode;
            resetCode = () => {
                reset();
                setMobileCode(mobileInitialCode);
            };
        }
    }

    return {
        code,
        setCode,
        resetCode,
        resetKey,
        setResetKey,
        ready,
    };
}
