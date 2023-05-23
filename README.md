<h1 style={{ textAlign: "center" }} align="center">⚡ Storybook Addon Live Examples ⚡</h1>

<h3 style={{ textAlign: "center" }} align="center"> Code playground with live editing inside your storybook</h3>

- 🧑‍💻 Play with code without 3rd-party service services like codepen
- 👥 Share examples with others
- 🐛 Share links to bug reproductions with others
- 🧱 Check how the components work together
- <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" width="18" height="18" align="center" /> Typescript supported

[Read docs](https://reme3d2y.github.io/storybook-addon-live-examples/?path=/story/components-docs--page) or [Try live demo](https://core-ds.github.io/core-components/master/?path=/docs/sandbox--docs)

## Getting started



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

### 4. Configure webpack (for storybook 7 only)

```js
const { patchWebpackConfig } = require('storybook-addon-live-examples/dist/cjs/utils');

module.exports = {
    webpackFinal: (config) => {
        patchWebpackConfig(config);
        
        return config;
    }
};
```

## Usage

### CSF

Live examples will be rendered instead of the default addon-docs canvas.

Your can customize examples by parameters:

```tsx
export default {
    title: 'Components/Button',
    parameters: {
        scope: {
            scopeValue,
        },
    }
};

const scopeValue = 42;

export const Primary = () => <button>{scopeValue}</button>;

Primary.parameters = {
    expanded: true
};

export const Secondary = () => <button>{scopeValue}</button>;
```

**NOTE:**
*Most likely you will get errors after addon installing. Don't panic, just pass all variables that are used in your story to scope*

### MDX

Inside MDX-based stories you can write your code examples with plain markdown.

**Just put your code inside triple quotes**

```markdown
|```tsx live
|<h4>Wow, so simple</h4>
|```
```

**Or render custom Canvas**

```tsx
// Import custom Canvas from addon
import { Canvas } from 'storybook-addon-live-examples';

<Canvas live={true} scope={{ value: 42 }}>
    <h4>Wow, so simple, {value}</h4>
</Canvas>
```

**Or use Example directly**

```tsx
import { Example } from 'storybook-addon-live-examples';

<Example live={true} code={`<h4>Wow, so simple</h4>`} />
```

### [CSF With MDX](https://github.com/storybookjs/storybook/blob/master/addons/docs/docs/recipes.md#csf-stories-with-arbitrary-mdx)

```tsx
// Button.stories.js

import mdx from './Button.mdx';

export default {
    title: 'Components/Button',
    parameters: {
        docs: {
            page: mdx,
        },
    },
};

const scopeValue = 42;

export const Primary = () => <button>{scopeValue}</button>;

Primary.parameters = {
    scope: {
        scopeValue,
    },
};
```

```tsx
// Button.mdx

import { ArgsTable, Story } from '@storybook/addon-docs';

import { Button } from './Button';

# Button

<ArgsTable of={Button} />

<Story id='components-button--primary' />
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
</Canvas>
```

#### - Setup scope globally

This is the easiest way to setup scope once for an entire project

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

#### - Setup scope inside monorepo

This is an example of how you can add all used components and helpers to the scope.

```tsx
// .storybook/scope.ts

import { ComponentType } from 'react';

import * as icons from 'some-icons-pack';
import * as knobs from '@storybook/addon-knobs';

// packages/{componentName}/index.ts
const req = require.context('../packages', true, /^\.\/(.*)\/index.ts$/);

const components = req.keys().reduce((acc: Record<string, ComponentType>, key) => {
    Object.entries(req(key)).forEach(([componentName, component]: [string, any]) => {
        acc[componentName] = component;
    });

    return acc;
}, {});

export default {
    ...components,
    ...icons,
    ...knobs,
};

// .storybook/manager.js

import scope from './scope';

addons.setConfig({
    [LIVE_EXAMPLES_ADDON_ID]: {
        scope,
    },
});
```
