const { patchWebpackConfig } = require('../src/utils');

module.exports = {
    stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '../preset.js',
        {
            name: '@storybook/addon-docs',
            options: {
                transcludeMarkdown: true,
            },
        },
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    docs: {
        autodocs: true,
    },
    webpackFinal: (config) => {
        return patchWebpackConfig(config);
    },
};
