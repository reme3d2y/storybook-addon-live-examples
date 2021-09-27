import addons, { StoryContext, StoryFn } from '@storybook/addons';
import React from 'react';
import { CanvasReplacer, Example, LIVE_EXAMPLES_ADDON_ID } from './components';
import { extractLanguageFromFilename } from './components/utils';

export const decorator = (storyFn: StoryFn, context: StoryContext) => {
    console.log();

    if (
        context.viewMode !== 'docs' ||
        context.parameters.defaultCanvas ||
        addons.getConfig()[LIVE_EXAMPLES_ADDON_ID].defaultCanvas
    )
        return storyFn();

    const { live = true, expanded = false, storySource, scope } = context.parameters;

    const code = storySource ? `render(${storySource.source})` : 'No code available';

    return (
        <CanvasReplacer id={context.id}>
            <Example
                code={code}
                live={live}
                id={context.id}
                expanded={expanded}
                scope={scope}
                language={extractLanguageFromFilename(context.parameters.fileName)}
            />
        </CanvasReplacer>
    );
};

export default decorator;
