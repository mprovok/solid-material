import type { Component } from 'solid-js';

import { MaterialAppBar } from '@solid-material/material/components/app-bar';
import { H2, H3, Span } from '@solid-material/material/components/typography';
import { MaterialBodyLayout, MaterialPane } from '@solid-material/material/layouts';
import { Breakpoints } from '@solid-material/material/utils';
import { MetaProvider, Title } from '@solidjs/meta';
import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

import exampleCssLayers from '../assets/example-css-layers.txt?raw';
import exampleIndexCss from '../assets/example-index-css.txt?raw';
import exampleMaterialTheme from '../assets/example-material-theme.txt?raw';
import exampleMetaThemeColor from '../assets/example-meta-theme-color.txt?raw';
import exampleNavigationLayout from '../assets/example-navigation-layout.txt?raw';
import exampleTsconfigJson from '../assets/example-tsconfig-json.txt?raw';
import exampleViteConfigTs from '../assets/example-vite-config-ts.txt?raw';
import { CodeBlock } from '../components/code-block/CodeBlock';
import { FilesBlock } from '../components/files-block/FilesBlock';
import { PromptBlock } from '../components/prompt-block/PromptBlock';

import styles from './get-started.module.css';

const PageGetStarted: Component = () => {
  const navigate = useNavigate();
  const navigateBackToList = () => navigate(-1);

  const isMobile = () => Breakpoints.isCompactWidth();

  const [activeTab, setActiveTab] = createSignal<'pnpm' | 'yarn' | 'npm'>('pnpm');

  return (
    <>
      <MetaProvider>
        <Title>Solid Material - Geting started</Title>
      </MetaProvider>
      <MaterialBodyLayout variant="flexible-fixed">
        <MaterialPane>
          <MaterialAppBar
            variant={isMobile() ? 'small' : 'large'}
            title="Getting started"
            leadingButtonAriaLabel="Go back to list"
            onNavigate={navigateBackToList}
          />
          <main class={styles['main']}>
            <Span role="body" size="large">
              <H2 role="headline" size="medium">
                Installing Solid Material
              </H2>
              <p>
                Solid Material is a library for SolidJS providing Material 3 Expressive components. To get started, add
                Solid Material to your project:
              </p>
              <PromptBlock
                prompts={{
                  pnpm: 'pnpm add @solid-material/material',
                  yarn: 'yarn add @solid-material/material',
                  npm: 'npm install @solid-material/material'
                }}
                active={activeTab()}
                onChange={setActiveTab}
              />
              <H3 role="headline" size="small">
                Icons
              </H3>
              <p>To use the Material icons (which are SVG files) in your project, run:</p>
              <PromptBlock
                prompts={{
                  pnpm: 'pnpm add @solid-material/icons',
                  yarn: 'yarn add @solid-material/icons',
                  npm: 'npm install @solid-material/icons'
                }}
                active={activeTab()}
                onChange={setActiveTab}
              />
              <p>You also need to add a Vite plugin so that the SVG files can be loaded as SolidJS components:</p>
              <PromptBlock
                prompts={{
                  pnpm: 'pnpm add -D @solid-material/vite-plugin-solid-svg',
                  yarn: 'yarn add -D @solid-material/vite-plugin-solid-svg',
                  npm: 'npm install -D @solid-material/vite-plugin-solid-svg'
                }}
                active={activeTab()}
                onChange={setActiveTab}
              />
              <p>Make sure to import the plugin in your Vite and TypeScript configuration files:</p>
              <FilesBlock
                files={[
                  {
                    label: 'vite.config.ts',
                    content: exampleViteConfigTs
                  },
                  {
                    label: 'tsconfig.json',
                    content: exampleTsconfigJson
                  }
                ]}
              />
              <H3 role="headline" size="small">
                Fonts
              </H3>
              <p>Optionally, you may want to use a separate font for large headers, for example:</p>
              <PromptBlock
                prompts={{
                  pnpm: 'pnpm add @fontsource/google-sans-flex',
                  yarn: 'yarn add @fontsource/google-sans-flex',
                  npm: 'npm install @fontsource/google-sans-flex'
                }}
                active={activeTab()}
                onChange={setActiveTab}
              />
              <p>
                Import the font in <code>index.tsx</code> and apply the font in <code>index.css</code>:
              </p>
              <FilesBlock
                files={[
                  {
                    label: 'index.tsx',
                    content: "import '@fontsource/google-sans-flex/latin-400.css';"
                  },
                  {
                    label: 'index.css',
                    content: exampleIndexCss
                  }
                ]}
              />
              <H2 role="headline" size="medium">
                Setup
              </H2>
              <p>Setting up Solid Material involves only a few steps:</p>
              <ol>
                <li>
                  <p>
                    Define the order of the CSS layers in your <code>index.html</code> file:
                  </p>
                  <CodeBlock>{exampleCssLayers}</CodeBlock>
                </li>
                <li>
                  <p>
                    Wrap your application in <code>&lt;MaterialTheme&gt;</code> and{' '}
                    <code>&lt;MaterialSkeletonManager&gt;</code> (if your components use{' '}
                    <code>&lt;MaterialSkeleton&gt;</code>) in your root layout.
                    <code>&lt;MaterialTheme&gt;</code> is needed because it adds CSS stylesheets for the design tokens
                    of the colors. Without it the components will look unstyled.
                  </p>
                  <FilesBlock
                    files={[
                      {
                        label: 'index.tsx',
                        content: exampleMaterialTheme
                      }
                    ]}
                  />
                  <p>
                    The props of <code>&lt;MaterialTheme&gt;</code> are optional and their defaults are given in the
                    example above. All colors in Material Design are generated from a single theme color, which is
                    either the optional <code>color</code> prop or else the theme color defined in a{' '}
                    <code>&lt;meta&gt;</code> element in your <code>index.html</code> file. For the <code>theme</code>{' '}
                    prop you have two options:
                  </p>
                  <ol>
                    <li>
                      <code>undefined</code>. If the value is undefined, the baseline theme is used. The color tokens
                      used by the components are defined in terms of the reference palette tokens from the baseline
                      theme.
                    </li>
                    <li>
                      A value of the type <code>ThemeVariant</code>. The color tokens are generated directly (hex
                      values) instead of referencing palette tokens.
                    </li>
                  </ol>
                  <p>
                    To try one of the themes, set the <code>theme</code> prop to, for example, the value{' '}
                    <code>tonal-spot</code>. Compared to the baseline theme, the accent colors are less colorful, but
                    the accent container colors are more vibrant. You can play with the various themes and source color
                    on the <a href="/">home page</a>.
                  </p>
                </li>
                <li>
                  <p>
                    <b>(Optional)</b> Define a theme color in <code>index.html</code> to use as a fallback in case{' '}
                    <code>&lt;MaterialTheme&gt;</code> is given no valid <code>color</code> prop:
                  </p>
                  <CodeBlock>{exampleMetaThemeColor}</CodeBlock>
                  <p>
                    If this element is desired to be used at one point during the lifetime of the application, then the
                    element must exist before the <code>&lt;MaterialTheme&gt;</code> component is mounted, but the{' '}
                    <code>content</code>
                    attribute is not required until needed.
                  </p>
                </li>
              </ol>
              <H2 role="headline" size="medium">
                Navigation
              </H2>
              <p>
                If you wish to display a navigation rail or bar in your application, the{' '}
                <code>&lt;MaterialNavigationLayout&gt;</code> component should be wrapped around the root route. Make
                sure to avoid rerendering the component when the user navigates to another page, otherwise an expanded
                navigation rail might collapse.
              </p>
              <CodeBlock>{exampleNavigationLayout}</CodeBlock>
              <p>
                Compact and medium width screens (mobile phones and tablets) can display a navigation bar. Larger
                screens will always display a navigation rail.
              </p>
              <p>
                On compact width screens (mobile phones in portrait orientation) a navigation bar is displayed if there
                are no more than 5 items and the app has no preference for the vertical space (otherwise a navigation
                rail will be displayed, which will move out of view when collapsed).
              </p>
              <p>
                On medium width screens (tablets), the app must have a preference for horizontal space to display a
                navigation bar, otherwise a navigation rail is displayed.
              </p>
              <p>
                The <code>preferSpace</code> prop can be used to indicate whether your application needs horizontal or
                vertical space. It can have 3 values:
              </p>
              <ul>
                <li>
                  <p>
                    <code>undefined</code> (default): shows a navigation bar on compact screen widths (phones in
                    portrait orientation), a modal navigation rail on compact screen heights (phones in landscape
                    orientation), and a regular navigation rail on medium and larger screen widths (tablets and
                    desktops).
                  </p>
                </li>
                <li>
                  <p>
                    <code>vertical</code>: shows a modal navigation rail on compact screen widths.
                  </p>
                </li>
                <li>
                  <p>
                    <code>horizontal</code>: shows a navigation bar on medium screen widths.
                  </p>
                </li>
              </ul>
              <H3 role="headline" size="small">
                Secondary items
              </H3>
              <p>
                The navigation rail can display secondary items when the user expands the rail by clicking on the menu
                button. The prop <code>secondary</code> can receive an object containing a <code>label</code> for the
                header and the <code>items</code>.
              </p>
              <H3 role="headline" size="small">
                FAB
              </H3>
              <p>
                The <code>fab</code> prop can have an object to display a Floating Action Button (FAB) in the navigation{' '}
                <code>rail</code> or <code>bar</code>. If the FAB should be displayed at the bottom of the screen, even
                when a navigation rail is visible, use the <code>bar</code>
                field and leave <code>rail</code> undefined.
              </p>
              <H3 role="headline" size="small">
                Snackbar
              </H3>
              <p>
                The snackbar is displayed at the bottom of the screen, but above any FAB. The{' '}
                <code>snackbarAlignment</code> prop is used to set where it should be displayed at the bottom edge. It
                can have 3 values:
              </p>
              <ul>
                <li>
                  <p>
                    <code>undefined</code> (default): the snackbar takes the full width of the screen.
                  </p>
                </li>
                <li>
                  <p>
                    <code>start</code>: the snackbar is aligned to the start of the screen (left for LTR languages and
                    right for RTL).
                  </p>
                </li>
                <li>
                  <p>
                    <code>center</code>: the snackbar is positioned in the center of the screen.
                  </p>
                </li>
              </ul>
              <H2 role="headline" size="medium">
                Panes
              </H2>
              <p>
                A <code>&lt;MaterialBodyLayout&gt;</code> can be used to display one or two panes. It should have one or
                two <code>&lt;MaterialPane&gt;</code> as its children. The prop <code>variant</code> specifies how the
                panes should behave:
              </p>
              <ul>
                <li>
                  <p>
                    <code>split</code>
                  </p>
                </li>
                <li>
                  <p>
                    <code>flexible-fixed</code>
                  </p>
                </li>
                <li>
                  <p>
                    <code>fixed-flexible</code>
                  </p>
                </li>
              </ul>
              <p>
                Use the boolean prop <code>showDragHandle</code> to allow the user to resize the panes.
              </p>
              <H3 role="headline" size="small">
                Canonical layouts
              </H3>
              <p>The following canonical layouts have been implemented:</p>
              <ul>
                <li>
                  <p>
                    <strong>List-detail</strong>: use <code>&lt;MaterialListDetailLayout&gt;</code> instead of{' '}
                    <code>&lt;MaterialBodyLayout&gt;</code> for a layout with two panes. Use the boolean prop{' '}
                    <code>selected</code> to display either the detail pane or the list pane on compact width screens.
                  </p>
                </li>
              </ul>
            </Span>
          </main>
        </MaterialPane>
      </MaterialBodyLayout>
    </>
  );
};

// oxlint-disable-next-line import/no-default-export
export default PageGetStarted;
