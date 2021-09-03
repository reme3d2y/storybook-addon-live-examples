import { StoryContext, StoryFn } from '@storybook/addons';
import React from 'react';
import { CanvasReplacer, Example } from './components';
import { extractLanguageFromFilename } from './components/utils';

export const decorator = (storyFn: StoryFn, context: StoryContext) => {
    if (context.viewMode !== 'docs' || context.parameters.defaultCanvas) return storyFn();

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
