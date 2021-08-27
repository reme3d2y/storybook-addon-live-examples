import React, { FC, useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type CanvasReplacerProps = {
    id: string;
};

const getContainer = (id: string) =>
    document.getElementById(`anchor--${id}`) || document.getElementById(`story--${id}`);

export const CanvasReplacer: FC<CanvasReplacerProps> = ({ children, id }) => {
    const [container, setContainer] = useState<HTMLElement>(getContainer(id));

    useLayoutEffect(() => {
        if (!container) {
            setContainer(getContainer(id));
        }
    }, [container]);

    useLayoutEffect(() => {
        if (container) {
            const defaultCanvas = container.querySelector('.sbdocs-preview');

            if (defaultCanvas) {
                defaultCanvas.setAttribute('style', 'display: none');
            }
        }
    }, [container]);

    if (!container) return null;

    return ReactDOM.createPortal(<div key={id}>{children}</div>, container);
};
