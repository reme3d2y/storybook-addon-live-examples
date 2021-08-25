module.exports = {
    stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '../preset.js',
        {
            name: '@storybook/addon-docs',
            options: { transcludeMarkdown: true },
        },
    ],
};
