"use strict";(self.webpackChunkstorybook_addon_live_examples=self.webpackChunkstorybook_addon_live_examples||[]).push([[574],{"./node_modules/@mdx-js/react/lib/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{NF:()=>withMDXComponents,Zo:()=>MDXProvider,ah:()=>useMDXComponents,pC:()=>MDXContext});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const MDXContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext({});function withMDXComponents(Component){return function boundMDXComponent(props){const allComponents=useMDXComponents(props.components);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component,{...props,allComponents})}}function useMDXComponents(components){const contextComponents=react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext);return react__WEBPACK_IMPORTED_MODULE_0__.useMemo((()=>"function"==typeof components?components(contextComponents):{...contextComponents,...components}),[contextComponents,components])}const emptyObject={};function MDXProvider({components,children,disableParentContext}){let allComponents;return allComponents=disableParentContext?"function"==typeof components?components({}):components||emptyObject:useMDXComponents(components),react__WEBPACK_IMPORTED_MODULE_0__.createElement(MDXContext.Provider,{value:allComponents},children)}},"./node_modules/@storybook/addon-docs/dist/chunk-PCJTTTQV.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{r:()=>DocsRenderer});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_react_dom_shim__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@storybook/react-dom-shim/dist/react-16.mjs"),_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs"),defaultComponents={code:_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.bD,a:_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.Ct,..._storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.lO},ErrorBoundary=class extends react__WEBPACK_IMPORTED_MODULE_0__.Component{constructor(){super(...arguments),this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(err){let{showException}=this.props;showException(err)}render(){let{hasError}=this.state,{children}=this.props;return hasError?null:children}},DocsRenderer=class{constructor(){this.render=async(context,docsParameter,element)=>{let components={...defaultComponents,...docsParameter?.components};return new Promise(((resolve,reject)=>{__webpack_require__.e(433).then(__webpack_require__.bind(__webpack_require__,"./node_modules/@mdx-js/react/index.js")).then((({MDXProvider})=>(0,_storybook_react_dom_shim__WEBPACK_IMPORTED_MODULE_2__.l)(react__WEBPACK_IMPORTED_MODULE_0__.createElement(ErrorBoundary,{showException:reject,key:Math.random()},react__WEBPACK_IMPORTED_MODULE_0__.createElement(MDXProvider,{components},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.WI,{context,docsParameter}))),element))).then(resolve)}))},this.unmount=element=>{(0,_storybook_react_dom_shim__WEBPACK_IMPORTED_MODULE_2__.K)(element)}}}},"./node_modules/@storybook/addon-docs/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$4:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.$4,UG:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.UG,h_:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.h_,oG:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.oG});__webpack_require__("./node_modules/@storybook/addon-docs/dist/chunk-PCJTTTQV.mjs");var _storybook_blocks__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs")},"./stories/Docs.stories.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__page:()=>__page,default:()=>Docs_stories});__webpack_require__("./node_modules/react/index.js");var lib=__webpack_require__("./node_modules/@mdx-js/react/lib/index.js"),dist=__webpack_require__("./node_modules/@storybook/addon-docs/dist/index.mjs");var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const __page=()=>{throw new Error("Docs-only story")};__page.parameters={docsOnly:!0};const componentMeta={title:"Components/Docs",parameters:{previewTabs:{canvas:{hidden:!0}}},tags:["stories-mdx"],includeStories:["__page"]};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs={...componentMeta.parameters.docs||{},page:function MDXContent(props={}){const{wrapper:MDXLayout}=Object.assign({},(0,lib.ah)(),props.components);return MDXLayout?(0,jsx_runtime.jsx)(MDXLayout,{...props,children:(0,jsx_runtime.jsx)(_createMdxContent,{})}):_createMdxContent();function _createMdxContent(){return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(dist.h_,{title:"Components/Docs",parameters:{previewTabs:{canvas:{hidden:!0}}}}),"\n",(0,jsx_runtime.jsx)(dist.UG,{children:"<h1 style={{ textAlign: \"center\" }} align=\"center\">⚡ Storybook Addon Live Examples ⚡</h1>\n\n<h3 style={{ textAlign: \"center\" }} align=\"center\"> Code playground with live editing inside your storybook</h3>\n\n- 🧑‍💻 Play with code without 3rd-party service services like codepen\n- 👥 Share examples with others\n- 🐛 Share links to bug reproductions with others\n- 🧱 Check how the components work together\n- <img src=\"https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png\" width=\"18\" height=\"18\" align=\"center\" /> Typescript supported\n\n[Read docs](https://reme3d2y.github.io/storybook-addon-live-examples/?path=/story/components-docs--page) or [Try live demo](https://core-ds.github.io/core-components/master/?path=/docs/sandbox--docs)\n\n## Getting started\n\n\n\n### 1. Install addon\n\n```bash\nyarn add -D storybook-addon-live-examples\n# npm install --save-dev storybook-addon-live-examples\n```\n\n### 2. Register addon in main.js\n\n```js\nmodule.exports = {\n    addons: ['storybook-addon-live-examples'],\n};\n```\n\n### 3. Setup addon in preview.js (optional step)\n\n```js\nimport { addons } from '@storybook/addons';\nimport { LIVE_EXAMPLES_ADDON_ID } from 'storybook-addon-live-examples';\nimport theme from 'prism-react-renderer/themes/github';\n\nimport AllComponents from '../packages';\n\naddons.setConfig({\n    [LIVE_EXAMPLES_ADDON_ID]: {\n        // custom theme from prism-react-renderer (optional)\n        editorTheme: theme,\n        // internationalization (optional)\n        copyText: ['Copy', 'Copied'],\n        expandText: ['Show code', 'Hide code'],\n        shareText: ['Share', 'Shared'],\n        // scope (globally accessible components & functions) (optional)\n        scope: {\n            ...AllComponents,\n            someFunction: () => 42\n        },\n    },\n});\n```\n\n### 4. Configure webpack (for storybook 7 only)\n\n```js\nconst { patchWebpackConfig } = require('storybook-addon-live-examples/dist/cjs/utils');\n\nmodule.exports = {\n    webpackFinal: (config) => {\n        patchWebpackConfig(config);\n        \n        return config;\n    }\n};\n```\n\n## Usage\n\n### CSF\n\nLive examples will be rendered instead of the default addon-docs canvas.\n\nYour can customize examples by parameters:\n\n```tsx\nexport default {\n    title: 'Components/Button',\n    parameters: {\n        scope: {\n            scopeValue,\n        },\n    }\n};\n\nconst scopeValue = 42;\n\nexport const Primary = () => <button>{scopeValue}</button>;\n\nPrimary.parameters = {\n    expanded: true\n};\n\nexport const Secondary = () => <button>{scopeValue}</button>;\n```\n\n**NOTE:**\n*Most likely you will get errors after addon installing. Don't panic, just pass all variables that are used in your story to scope*\n\n### MDX\n\nInside MDX-based stories you can write your code examples with plain markdown.\n\n**Just put your code inside triple quotes**\n\n```markdown\n|```tsx live\n|<h4>Wow, so simple</h4>\n|```\n```\n\n**Or render custom Canvas**\n\n```tsx\n// Import custom Canvas from addon\nimport { Canvas } from 'storybook-addon-live-examples';\n\n<Canvas live={true} scope={{ value: 42 }}>\n    <h4>Wow, so simple, {value}</h4>\n</Canvas>\n```\n\n**Or use Example directly**\n\n```tsx\nimport { Example } from 'storybook-addon-live-examples';\n\n<Example live={true} code={`<h4>Wow, so simple</h4>`} />\n```\n\n### [CSF With MDX](https://github.com/storybookjs/storybook/blob/master/addons/docs/docs/recipes.md#csf-stories-with-arbitrary-mdx)\n\n```tsx\n// Button.stories.js\n\nimport mdx from './Button.mdx';\n\nexport default {\n    title: 'Components/Button',\n    parameters: {\n        docs: {\n            page: mdx,\n        },\n    },\n};\n\nconst scopeValue = 42;\n\nexport const Primary = () => <button>{scopeValue}</button>;\n\nPrimary.parameters = {\n    scope: {\n        scopeValue,\n    },\n};\n```\n\n```tsx\n// Button.mdx\n\nimport { ArgsTable, Story } from '@storybook/addon-docs';\n\nimport { Button } from './Button';\n\n# Button\n\n<ArgsTable of={Button} />\n\n<Story id='components-button--primary' />\n```\n\n\n\n## Example props\n\nYou can customize the display of examples with props or metastring\n\n### live\n\n```markdown\n|```tsx live\n|<span>This example can be edited</span>\n|```\n```\n\n```tsx live\n<span>This example can be edited</span>\n```\n\n### expanded\n\n```markdown\n|```tsx live expanded\n|<span>This example will be rendered with expanded code sources</span>\n|```\n```\n\n```tsx live expanded\n<span>This example will be rendered with expanded code sources</span>\n```\n\n## Complex examples\n\n```tsx live expanded\nrender(() => {\n    const [counter, setCounter] = React.useState(0);\n    return (\n        <>\n            <h2>Super live counter: {counter}</h2>\n            <button type='button' onClick={() => setCounter((c) => c + 1)}>\n                Increment\n            </button>\n        </>\n    );\n});\n```\n\n## Scope\n\nStorybook-addon-live-examples uses [react-live](https://github.com/FormidableLabs/react-live) under the hood.\n\nScope allows you to pass some globals to your code examples.\nBy default it injects React only, which means that you can use it in code like this:\n\n```tsx\nrender(() => {\n//                                ↓↓↓↓↓\n    const [counter, setCounter] = React.useState(0);\n    return counter;\n}\n```\n\n#### - Pass your own components to scope by props\n\n```tsx\nimport { Canvas } from 'storybook-addon-live-examples';\nimport MyComponent from '../packages/my-component';\n\n<Canvas live={true} scope={{ MyComponent }}>\n    <MyComponent>Amazing</MyComponent>\n</Canvas>\n```\n\n#### - Setup scope globally\n\nThis is the easiest way to setup scope once for an entire project\n\n```tsx\n//.storybook/manager.js\n\nimport { addons } from '@storybook/addons';\nimport { LIVE_EXAMPLES_ADDON_ID } from 'storybook-addon-live-examples';\n\naddons.setConfig({\n    [LIVE_EXAMPLES_ADDON_ID]: {\n        scope: {\n            MyComponent,\n        },\n    },\n});\n```\n\n```tsx\n<MyComponent>Now, you can use MyComponent in all examples</MyComponent>\n```\n\n#### - Setup scope inside monorepo\n\nThis is an example of how you can add all used components and helpers to the scope.\n\n```tsx\n// .storybook/scope.ts\n\nimport { ComponentType } from 'react';\n\nimport * as icons from 'some-icons-pack';\nimport * as knobs from '@storybook/addon-knobs';\n\n// packages/{componentName}/index.ts\nconst req = require.context('../packages', true, /^\\.\\/(.*)\\/index.ts$/);\n\nconst components = req.keys().reduce((acc: Record<string, ComponentType>, key) => {\n    Object.entries(req(key)).forEach(([componentName, component]: [string, any]) => {\n        acc[componentName] = component;\n    });\n\n    return acc;\n}, {});\n\nexport default {\n    ...components,\n    ...icons,\n    ...knobs,\n};\n\n// .storybook/manager.js\n\nimport scope from './scope';\n\naddons.setConfig({\n    [LIVE_EXAMPLES_ADDON_ID]: {\n        scope,\n    },\n});\n```\n"})]})}}};const Docs_stories=componentMeta}}]);