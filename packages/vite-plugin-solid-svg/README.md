# @solidmaterial/vite-plugin-solid-svg

Extend Vite with ability to use SVG files as SolidJS components.

This project is a fork of https://github.com/jfgodoy/vite-plugin-solid-svg with the following changes:

- SVGO dependency removed
- Uses tsdown instead of tsup to build the plugin

## Features

- Hot Module Replacement support
- Support for `?url` query string
- SSR

## Install

```bash
pnpm add -D @solidmaterial/vite-plugin-solid-svg
```

## Setup

```ts
// vite.config.js
import solidPlugin from 'vite-plugin-solid';
import solidSvg from '@solidmaterial/vite-plugin-solid-svg';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [solidPlugin(), solidSvg()]
});
```

### TypeScript

Vite adds its own definition for `"*.svg"` and defines them as `string`.
Add this project's types definition before Vite's in your tsconfig file
to import SVG files as SolidJS components:

```jsonc
// tsconfig.json
"compilerOptions": {
  "types": [
    "@solidmaterial/vite-plugin-solid-svg/types"
    "vite/client",
  ],
},
```

## Usage

An SVG icon can be imported as a SolidJS component as follows:

```tsx
import MyIcon from './my-icon.svg'; // Identified as Solid Component

const App = () => {
  return (
    <div>
      <h1> Title </h1>
      <MyIcon />
    </div>
  );
};

export default App;
```

To import the SVG icon as a URL, like Vite's original definition, add the `?url` query string:

```tsx
import myIconUrl from './my-icon.svg?url'; // Identified as string

const App = () => {
  return (
    <div>
        <h1> Title </h1>
        <img href={myIconUrl}>
    </div>
  );
};

export default App;
```

To import all SVG files inside a folder, use `import.meta.glob('@/svgs/*.svg', { as: 'component-solid' })`.
See [Vite docs](https://vitejs.dev/guide/features.html#static-assets) for more details.

```tsx
const icons = import.meta.glob('./*.svg', { as: 'component-solid' });

/*
  icons = {
    icon1: () => import("./icon1.svg"),
    icon2: () => import("./icon2.svg")
  }
*/

const App = () => {
  const Icon1 = lazy(() => iconsDic.icon1());
  return (
    <div>
      <p>hello</p>
      <Icon1 />
    </div>
  );
};

export default App;
```

## Credits

This plugin is based on the work from the following projects:

- https://github.com/jfgodoy/vite-plugin-solid-svg
- https://github.com/visualfanatic/vite-svg
- https://github.com/cobbcheng/vite-plugin-svgstring

## License

This package is licensed under the MIT license.
