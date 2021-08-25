import React from 'react';

import { Docs } from './Docs';

import mdx from './CSFWithMdx.mdx';

export default {
    title: 'Components/CSF with MDX',
    component: Docs,
    parameters: {
        docs: {
            page: mdx,
        },
    },
};

export const Primary = () => {
    const [counter, setCounter] = React.useState(0);

    return (
        <Docs>
            <h2>Primary counter: {counter}</h2>
            <button type='button' onClick={() => setCounter((c) => c + 1)}>
                Increment
            </button>
        </Docs>
    );
};

export const Secondary = () => {
    const [counter, setCounter] = React.useState(0);

    return (
        <Docs>
            <h2>Secondary counter: {counter}</h2>
            <button type='button' onClick={() => setCounter((c) => c + 1)}>
                Increment
            </button>
        </Docs>
    );
};
