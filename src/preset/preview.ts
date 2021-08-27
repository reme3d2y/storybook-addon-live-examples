import { CanvasAdapter, CodeAdapter } from '../components';
import storyDecorator from '../story-decorator';

export const parameters = {
    docs: {
        components: {
            code: CodeAdapter,
            Canvas: CanvasAdapter,
        },
    },
};

export const decorators = [storyDecorator];
