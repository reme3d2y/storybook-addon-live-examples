import React from 'react';

import { CSF } from './CSF';

import mdx from './CSFWithMdx.mdx';

export default {
    title: 'Components/CSF with MDX',
    parameters: {
        docs: {
            page: mdx,
        },
    },
};

export const Primary = () => {
    const [counter, setCounter] = React.useState(0);

    return (
        <div>
            <h2>Primary counter: {counter}</h2>
            <button type='button' onClick={() => setCounter((c) => c + 1)}>
                Increment
            </button>
            <p>
                <CSF value='I am value from scope' />
            </p>
        </div>
    );
};

Primary.parameters = {
    scope: {
        CSF,
    },
};

export const Secondary = () => {
    const [counter, setCounter] = React.useState(0);

    return (
        <div>
            <h2>Secondary counter: {counter}</h2>
            <button type='button' onClick={() => setCounter((c) => c + 1)}>
                Increment
            </button>
            <p>
                <CSF value='I am value from scope' />
            </p>
        </div>
    );
};

Secondary.parameters = {
    scope: {
        CSF,
    },
    expanded: true,
};
