// oxlint-disable-next-line typescript/consistent-type-imports
import type { Plugin } from 'vite';

// oxlint-disable-next-line import/no-nodejs-modules
import { readFile } from 'node:fs/promises';

// SPDX-Copyright: 2021 Jorge Godoy
// SPDX-License-Identifier: MIT

const svgToJsx = (source: string): string => {
  // oxlint-disable prefer-named-capture-group
  return source
    .replaceAll(/([{}])/gu, "{'$1'}")
    .replaceAll(/<!--\s*([\s\S]*?)\s*-->/gu, '{/* $1 */}')
    .replace(/(<svg[^>]*)>/iu, '$1{...props}>');
};

const compileSvg = (source: string): string => {
  const jsx = svgToJsx(source);
  return `export default (props = {}) => (${jsx})`;
};

// To transform an SVG file to a SolidJS component, the transform hook calls vite-plugin-solid to compile the SVG source
const svgPlugin = (): Plugin => {
  const shouldProcess = (qs?: string) => {
    const params = new URLSearchParams(qs);
    return [...params.entries()].length === 0 || params.has('component-solid');
  };

  let solidPlugin: Plugin;

  return {
    enforce: 'pre',
    name: 'solidjs-svg',

    configResolved(cfg) {
      const plugin = cfg.plugins.find(p => p.name === 'solid');
      if (!plugin) {
        throw new Error('solid plugin not found');
      }
      solidPlugin = plugin;
    },

    async resolveId(id, importer) {
      // If solid-js/web is imported from an .svg file, resolve it normally
      if (id === 'solid-js/web' && importer !== undefined && importer.endsWith('.svg')) {
        return this.resolve(id, undefined, { skipSelf: true });
      }
      // oxlint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    },

    async load(id) {
      const [path, qs] = id.split('?');

      if (path !== undefined && path.endsWith('.svg') && shouldProcess(qs)) {
        const code = await readFile(path, { encoding: 'utf8' });
        return compileSvg(code);
      }
      // oxlint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    },

    async transform(source, id, transformOptions) {
      const [path, qs] = id.split('?');

      if (path !== undefined && path.endsWith('.svg') && shouldProcess(qs)) {
        const transformFn =
          typeof solidPlugin.transform === 'function' ? solidPlugin.transform : solidPlugin.transform!.handler;

        return transformFn.bind(this)(source, `${path}.tsx`, transformOptions);
      }
    }
  };
};

// oxlint-disable-next-line import/no-default-export
export default svgPlugin;
