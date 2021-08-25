import { addons } from '@storybook/addons';
import React from 'react';
import { LIVE_EXAMPLES_ADDON_ID } from '../dist/esm/index';

import editorTheme from 'prism-react-renderer/themes/github';

addons.setConfig({
    [LIVE_EXAMPLES_ADDON_ID]: {
        editorTheme,
        copyText: ['Скопировать', 'Скопировано'],
        expandText: ['Показать код', 'Скрыть код'],
        shareText: ['Поделиться', 'Поделиться'],
        scope: {
            ScopeWrapper: (props) =>
                React.createElement('div', {
                    ...props,
                    style: { padding: '10px', border: '1px solid #1EA7FD', borderRadius: '4px' },
                }),
        },
    },
});
