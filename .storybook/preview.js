import { addons } from '@storybook/manager-api';
import React from 'react';
import { LIVE_EXAMPLES_ADDON_ID } from '../src/config';
import theme from './theme';
import { ModalDesktop } from '@alfalab/core-components/modal/desktop';
import { ModalMobile } from '@alfalab/core-components/modal/mobile';
import { ModalResponsive } from '@alfalab/core-components/modal/responsive';
import { Button } from '@alfalab/core-components/button';
import { CSF } from '../stories/CSF';

addons.setConfig({
    [LIVE_EXAMPLES_ADDON_ID]: {
        sandboxPath: '/docs/sandbox--page',
        mobileFrameName: 'internalmobileframe--docs',
        previewBgColor: '#ffffff',
        scope: {
            Button,
            ModalMobile,
            ModalDesktop,
            ModalResponsive,
            CSF: () => CSF,
        },
    },
});

export const parameters = {
    docs: {
        theme,
    },
};
