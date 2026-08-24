import type { Component } from 'solid-js';

import { MetaProvider, Title } from '@solidjs/meta';
import { useParams } from '@solidjs/router';
import { H1 } from '@solidmaterial/material/components/typography';
import { MaterialListDetailLayout, MaterialPane } from '@solidmaterial/material/layouts';
import { Show, createMemo } from 'solid-js';

import { EmptyState } from '../../components/empty-state/EmptyState';
import {
  BUTTONS,
  COMPONENTS,
  CONTROLS,
  ComponentList,
  LAYOUT,
  NAVIGATION,
  UTILITIES
} from '../../pages/components/ComponentList';

import styles from './[[name]].module.css';

import CodeBlocksIcon from '@solidmaterial/icons/400/outlined/code_blocks.svg';
import ErrorIcon from '@solidmaterial/icons/400/outlined/error.svg';

const getStorybookBaseURL = () => {
  const isDev = import.meta.env.MODE === 'development';
  return isDev ? `http://${globalThis.location.hostname}:6006` : `${globalThis.location.origin}/storybook`;
};

const PageComponents: Component = () => {
  const params = useParams<{ name: string }>();

  const selectedItem = createMemo(() =>
    [...COMPONENTS, ...BUTTONS, ...CONTROLS, ...UTILITIES, ...NAVIGATION, ...LAYOUT].find(
      item => params.name === item.name
    )
  );

  return (
    <>
      <MetaProvider>
        <Title>Solid Material - Components</Title>
      </MetaProvider>
      <MaterialListDetailLayout selected={false}>
        <MaterialPane class={styles['list-pane']}>
          <aside>
            <H1 role="label" size="large">
              Components
            </H1>
            <ComponentList items={COMPONENTS} name={params.name} />
            <H1 role="label" size="large">
              Buttons
            </H1>
            <ComponentList items={BUTTONS} name={params.name} />
            <H1 role="label" size="large">
              Controls
            </H1>
            <ComponentList items={CONTROLS} name={params.name} />
            <H1 role="label" size="large">
              Navigation
            </H1>
            <ComponentList items={NAVIGATION} name={params.name} />
            <H1 role="label" size="large">
              Layout
            </H1>
            <ComponentList items={LAYOUT} name={params.name} />
            <H1 role="label" size="large">
              Utilities
            </H1>
            <ComponentList items={UTILITIES} name={params.name} />
          </aside>
        </MaterialPane>

        <MaterialPane>
          <Show
            when={params.name}
            fallback={
              <EmptyState
                icon={<CodeBlocksIcon />}
                label="No component selected"
                supportingText="Select a component in the list"
              />
            }
          >
            <Show
              when={selectedItem()}
              fallback={
                <EmptyState
                  icon={<ErrorIcon />}
                  label="Component not found"
                  supportingText="Select a component in the list"
                />
              }
            >
              {item => (
                <main style={{ height: '100%', padding: 0, 'overflow-y': 'clip' }}>
                  <iframe
                    src={`${getStorybookBaseURL()}/iframe.html?id=${item().storyBookId}&viewMode=docs`}
                    title={item().label}
                    width="100%"
                    height="100%"
                    style={{ border: 'unset' }}
                  />
                </main>
              )}
            </Show>
          </Show>
        </MaterialPane>
      </MaterialListDetailLayout>
    </>
  );
};

// oxlint-disable-next-line import/no-default-export
export default PageComponents;
