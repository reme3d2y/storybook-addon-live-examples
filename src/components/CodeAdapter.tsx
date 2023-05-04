import React from 'react';
import { Example } from './Example';

type CodeAdapterProps = {
    children: JSX.Element;
};

export const CodeAdapter = ({ children, ...restProps }: CodeAdapterProps) => {
    const codeBlockProps = children.props || {};

    return (
        <Example
            {...restProps}
            code={codeBlockProps.children}
            className={codeBlockProps.className}
        />
    );
};
