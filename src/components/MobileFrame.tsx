import React, { FC, useEffect, useState } from 'react';
import { LiveProvider, LivePreview } from 'react-live';

import { detectNoInline } from './utils';
import { getConfig } from '../config';

export type MobileFrameProps = {
    scope?: Record<string, unknown>;
};

export const MobileFrame: FC<MobileFrameProps> = ({ scope }) => {
    const config = getConfig();

    const [code, setCode] = useState('');

    useEffect(() => {
        window.addEventListener('message', ({ data }) => {
            if (data.code) {
                setCode(data.code);
            }
        });

        const wrapper = document.querySelector<HTMLDivElement>('.sbdocs-wrapper');
        if (wrapper) {
            wrapper.style.padding = '20px';
            wrapper.style.overflow = 'auto';
        }
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
