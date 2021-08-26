import React from 'react';

import { Example } from '../components';

export const parameters = {
    docs: {
        components: {
            code: Example,
            Canvas: ({ mdxSource, ...restProps }: { mdxSource: string }) =>
                React.createElement(Example, {
                    code: decodeURIComponent(mdxSource),
                    ...restProps,
                }),
        },
    },
};
