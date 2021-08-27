import React from 'react';
import { Example } from './Example';

type CodeAdapterProps = {
    children: string;
};

export const CodeAdapter = ({ children, ...restProps }: CodeAdapterProps) => {
    return <Example code={children} {...restProps} />;
};
