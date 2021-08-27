import React from 'react';
import { Example } from './Example';

type CanvasAdapterProps = {
    mdxSource: string;
};

export const CanvasAdapter = ({ mdxSource, ...restProps }: CanvasAdapterProps) => {
    return <Example code={decodeURIComponent(mdxSource)} {...restProps} />;
};
