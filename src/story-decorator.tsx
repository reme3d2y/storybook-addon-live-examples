import addons, { StoryContext, StoryFn } from '@storybook/addons';
import React from 'react';
import { CanvasReplacer, Example } from './components';
import { extractLanguageFromFilename } from './components/utils';
import { LIVE_EXAMPLES_ADDON_ID } from './config';

export const decorator = (storyFn: StoryFn, context: StoryContext) => {
    const story = storyFn();

    if (
        context.viewMode !== 'docs' ||
        context.parameters.defaultCanvas ||
        addons.getConfig()[LIVE_EXAMPLES_ADDON_ID].defaultCanvas
    )
        return story;

    const { live = true, expanded = false, storySource, scope } = context.parameters;

    const code = storySource ? `render(${storySource.source})` : 'No code available';

    return (
        <CanvasReplacer id={context.id}>
            <Example
                code={code}
                live={live}
                expanded={expanded}
                scope={scope}
                language={
                    typeof context.parameters.fileName === 'string'
                        ? extractLanguageFromFilename(context.parameters.fileName)
                        : undefined
                }
            />
        </CanvasReplacer>
    );
};

export default decorator;
