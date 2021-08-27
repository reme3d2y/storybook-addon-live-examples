import React from 'react';

import { CSF } from './CSF';

export default {
    title: 'Components/CSF',
    component: CSF,
    parameters: {
        scope: {
            CSF,
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
    expanded: true,
};
