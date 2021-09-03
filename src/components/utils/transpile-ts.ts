declare global {
    interface Window {
        ts: {
            transpile: (code: string, options: any) => string;
        };
    }
}

export async function transpileTs(code: string): Promise<string> {
    const transpile = () =>
        window.ts.transpile(code.trim(), {
            noImplicitUseStrict: true,
            target: 'es6',
            jsx: 'preserve',
        });

    if ('ts' in window) {
        return transpile();
    } else {
        return new Promise((resolve) => {
            loadService(() => resolve(transpile()));
        });
    }
}

function loadService(onLoad = () => {}) {
    const scriptId = 'typescriptServices';

    const existingTag = document.getElementById(scriptId);

    if (existingTag) {
        existingTag.addEventListener('load', onLoad);
        return;
    }

    const script = document.createElement('script');

    script.src = 'https://klesun-misc.github.io/TypeScript/lib/typescriptServices.js';
    script.id = scriptId;
    script.addEventListener('load', onLoad);

    document.head.appendChild(script);
}
