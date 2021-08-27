import { FC, useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type CanvasReplacerProps = {
    id: string;
};

export const CanvasReplacer: FC<CanvasReplacerProps> = ({ children, id }) => {
    const [target, setTarget] = useState<HTMLElement>();

    useLayoutEffect(() => {
        const container =
            document.getElementById(`anchor--${id}`) || document.getElementById(`story--${id}`);

        if (container) {
            const defaultCanvas = container.querySelector('.sbdocs-preview');

            if (defaultCanvas) {
                defaultCanvas.remove();
            }
        }

        setTarget(container);
    }, []);

    if (!target) return null;

    return ReactDOM.createPortal(children, target);
};
