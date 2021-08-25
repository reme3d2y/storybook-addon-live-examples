# ⚡ Storybook Addon Live Examples

Bring your code examples to life.

try [live demo](https://alfa-laboratory.github.io/core-components/master/?path=/docs/%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%B5%D1%81%D0%BE%D1%87%D0%BD%D0%B8%D1%86%D0%B0--page)

## Getting started

<br />

### 1. Install addon

```bash
yarn add -D storybook-addon-live-examples
# npm install --save-dev storybook-addon-live-examples
```

### 2. Register addon in main.js

```js
module.exports = {
    addons: ['storybook-addon-live-examples'],
};
```

### 3. Setup addon in preview.js (optional step)

```js
import { addons } from '@storybook/addons';
import { LIVE_EXAMPLES_ADDON_ID } from 'storybook-addon-live-examples';
import theme from 'prism-react-renderer/themes/github';

import AllComponents from '../packages';

addons.setConfig({
    [LIVE_EXAMPLES_ADDON_ID]: {
        // custom theme from prism-react-renderer (optional)
        editorTheme: theme,
        // path to shared page (optional)
        sandboxPath: '123',
        // internationalization (optional)
        copyText: ['Copy', 'Copied'],
        expandText: ['Show code', 'Hide code'],
        shareText: ['Share', 'Shared'],
        // scope (globally accessible components & functions) (optional)
        scope: {
            ...AllComponents,
            someFunction: () => 42
        },
    },
});
```

## Usage

### MDX

Inside MDX-based stories you can write your code examples with plain markdown.

Just put your code inside triple quotes:

```markdown
|```tsx live
|<h4>Wow, so simple</h4>
|```
```

**Or render**

```tsx
import { Canvas } from 'storybook-addon-live-examples';

<Canvas live={true}>
    <h4>Wow, so simple</h4>
</Canvas>;
```

### [CSF With MDX](https://github.com/storybookjs/storybook/blob/master/addons/docs/docs/recipes.md#csf-stories-with-arbitrary-mdx)

```tsx
// Button.stories.js

import mdx from './Button.mdx';

export const Primary = () => <button />;

export default {
    title: 'Components/Button',
    parameters: {
        docs: {
            page: mdx,
        },
    },
};
```

```tsx
// Button.mdx

import { ArgsTable, Story } from '@storybook/addon-docs';
import { Example } from 'storybook-addon-live-examples';

import { Button } from './Button';

# Button

<ArgsTable of={Button} />

<Example scope={{ Button }} live={true}>
    <Story id='components-button--primary' />
</Example>
```



## Example props

You can customize the display of examples with props or metastring

### live

```markdown
|```tsx live
|<span>This example can be edited</span>
|```
```

```tsx live
<span>This example can be edited</span>
```

### expanded

```markdown
|```tsx live expanded
|<span>This example will be rendered with expanded code sources</span>
|```
```

```tsx live expanded
<span>This example will be rendered with expanded code sources</span>
```

## Complex examples

```tsx live expanded
render(() => {
    const [counter, setCounter] = React.useState(0);
    return (
        <>
            <h2>Super live counter: {counter}</h2>
            <button type='button' onClick={() => setCounter((c) => c + 1)}>
                Increment
            </button>
        </>
    );
});
```

## Scope

Storybook-addon-live-examples uses [react-live](https://github.com/FormidableLabs/react-live) under the hood.

Scope allows you to pass some globals to your code examples.
By default it injects React only, which means that you can use it in code like this:

```tsx
render(() => {
//                                ↓↓↓↓↓
    const [counter, setCounter] = React.useState(0);
    return counter;
}
```

#### - Pass your own components to scope by props

```tsx
import { Canvas } from 'storybook-addon-live-examples';
import MyComponent from '../packages/my-component';

<Canvas live={true} scope={{ MyComponent }}>
    <MyComponent>Amazing</MyComponent>
</Canvas>;
```

#### - Setup scope globally

This is the easiest way to set up scope once for an entire project

```tsx
//.storybook/manager.js

import { addons } from '@storybook/addons';
import { LIVE_EXAMPLES_ADDON_ID } from 'storybook-addon-live-examples';

addons.setConfig({
    [LIVE_EXAMPLES_ADDON_ID]: {
        scope: {
            MyComponent,
        },
    },
});
```

```tsx
<MyComponent>Now, you can use MyComponent in all examples</MyComponent>
```
