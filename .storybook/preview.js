import { addons } from '@storybook/addons';
import React from 'react';
import { LIVE_EXAMPLES_ADDON_ID } from '../dist/esm/index';
import theme from './theme';
import { ModalDesktop } from '@alfalab/core-components/modal/desktop';
import { ModalMobile } from '@alfalab/core-components/modal/mobile';
import { Button } from '@alfalab/core-components/button';

addons.setConfig({
    [LIVE_EXAMPLES_ADDON_ID]: {
        sandboxPath: '/docs/sandbox--page',
        scope: {
            Button,
            ModalMobile,
            ModalDesktop,
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
