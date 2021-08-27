import { addons } from '@storybook/addons';
import React from 'react';
import { LIVE_EXAMPLES_ADDON_ID } from '../dist/esm/index';
import theme from './theme';

addons.setConfig({
    [LIVE_EXAMPLES_ADDON_ID]: {
        sandboxPath: '/docs/sandbox--page',
        scope: {
            ScopeWrapper: (props) =>
                React.createElement('div', {
                    ...props,
                    style: { padding: '10px', border: '1px solid #1EA7FD', borderRadius: '4px' },
                }),
        },
    },
});

export const parameters = {
    docs: {
        theme,
    },
};
