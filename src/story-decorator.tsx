import { StoryContext } from '@storybook/react';
import { addons } from '@storybook/manager-api';
import React from 'react';
import { CanvasReplacer, Example } from './components';
import { extractLanguageFromFilename } from './components/utils';
import { LIVE_EXAMPLES_ADDON_ID } from './config';

export const decorator = (storyFn: Function, context: StoryContext) => {
    const story = storyFn();

    if (
        context.viewMode !== 'docs' ||
        context.parameters.defaultCanvas ||
        addons.getConfig()[LIVE_EXAMPLES_ADDON_ID].defaultCanvas
    )
        return story;

    const { live = true, expanded = false, docs, scope } = context.parameters;

    const code = docs?.source?.originalSource
        ? `render(${docs.source.originalSource})`
        : 'No code available';

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
