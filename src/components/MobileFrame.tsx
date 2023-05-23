import React, { FC, useEffect, useState } from 'react';
import { LiveProvider, LivePreview } from 'react-live';

import { detectNoInline } from './utils';
import { getConfig } from '../config';

export type MobileFrameProps = {
    scope?: Record<string, unknown>;
    onMessage?: (data: any) => void;
};

export const LOADED_MESSAGE = 'STORY LOADED';

export const MobileFrame: FC<MobileFrameProps> = ({ scope, onMessage }) => {
    const config = getConfig();

    const [code, setCode] = useState('');
    const [resetKey, setResetKey] = useState('');

    useEffect(() => {
        const exampleId = window.frameElement.getAttribute('data-id');
        window.parent.postMessage({ message: LOADED_MESSAGE, exampleId }, '*');

        const handler = ({ data }: MessageEvent) => {
            if (onMessage) onMessage(data);

            if (data.code) {
                setCode(data.code);
                setResetKey(data.resetKey);
            }
        };

        window.addEventListener('message', handler);

        const wrapper = document.querySelector<HTMLDivElement>('.sbdocs-wrapper');
        if (wrapper) {
            wrapper.style.padding = '20px';
            wrapper.style.overflow = 'auto';
            wrapper.style.background = 'transparent';
            wrapper.classList.add('sb-unstyled');
        }

        return () => {
            window.removeEventListener('message', handler);
        };
    }, []);

    return (
        <LiveProvider
            code={code}
            noInline={detectNoInline(code)}
            scope={{
                ...config.scope,
                ...scope,
            }}
        >
            <LivePreview />
        </LiveProvider>
    );
};
