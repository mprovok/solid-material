import type { RouteComponent } from '@solidjs/router';
import type { DragHandlePosition } from '@solidmaterial/material/layouts';

import { Title } from '@solidjs/meta';
import { Dynamic } from '@solidjs/web';
import { MaterialListDetailLayout, MaterialPane } from '@solidmaterial/material/layouts';
import { Show, createMemo } from 'solid-js';

import type { Router } from '../../router';

import { EmptyState } from '../../components/empty-state/EmptyState';
import { ExampleList, ITEMS } from '../../pages/examples/ExampleList';

import styles from './[[name]].module.css';

import AppsIcon from '@solidmaterial/icons/400/outlined/apps.svg';
import ErrorIcon from '@solidmaterial/icons/400/outlined/error.svg';

const PageExamples: RouteComponent<typeof Router.paths.examples> = props => {
  const selectedItem = createMemo(() => ITEMS.find(item => props.params.name === item.name));

  return (
    <>
      <Title>Solid Material - Examples</Title>
      <MaterialListDetailLayout
        selected={props.params.name !== undefined}
        dragHandleAriaLabel="Drag handle"
        dragHandleAriaValue={(position: DragHandlePosition) =>
          position.percentage === 50 ? 'Center' : `${position.percentage}%`
        }
      >
        <MaterialPane class={styles['list-pane']}>
          <aside>
            <ExampleList name={props.params.name} />
          </aside>
        </MaterialPane>
        <MaterialPane>
          <Show
            when={props.params.name}
            fallback={
              <EmptyState
                icon={<AppsIcon />}
                label="No example selected"
                supportingText="Select an example in the list"
              />
            }
          >
            <Show
              when={selectedItem()}
              fallback={
                <EmptyState
                  icon={<ErrorIcon />}
                  label="Example not found"
                  supportingText="Select an example in the list"
                />
              }
            >
              {example => <Dynamic component={example().component} data={example()} />}
            </Show>
          </Show>
        </MaterialPane>
      </MaterialListDetailLayout>
    </>
  );
};

// oxlint-disable-next-line import/no-default-export
export default PageExamples;
