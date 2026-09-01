// SPDX-Copyright: 2021 Jorge Godoy
// SPDX-License-Identifier: MIT
declare module '*.svg' {
  import type { ComponentProps } from '@solidjs/web';
  import type { Component } from 'solid-js';
  const c: Component<ComponentProps<'svg'>>;
  export default c;
}

declare module '*.svg?url' {
  const src: string;
  export default src;
}
