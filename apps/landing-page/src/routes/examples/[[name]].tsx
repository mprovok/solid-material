import type { DragHandlePosition } from '@solidmaterial/material/layouts';
import type { ParentComponent } from 'solid-js';

import { MetaProvider, Title } from '@solidjs/meta';
import { useParams } from '@solidjs/router';
import { MaterialListDetailLayout, MaterialPane } from '@solidmaterial/material/layouts';
import { Show, createMemo } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { EmptyState } from '../../components/empty-state/EmptyState';
import { ExampleList, ITEMS } from '../../pages/examples/ExampleList';

import styles from './[[name]].module.css';

import AppsIcon from '@solidmaterial/icons/400/outlined/apps.svg';
import ErrorIcon from '@solidmaterial/icons/400/outlined/error.svg';

const PageExamples: ParentComponent = () => {
  const params = useParams<{ name: string }>();

  const selectedItem = createMemo(() => ITEMS.find(item => params.name === item.name));

  return (
    <>
      <MetaProvider>
        <Title>Solid Material - Examples</Title>
      </MetaProvider>
      <MaterialListDetailLayout
        selected={params.name !== undefined}
        dragHandleAriaLabel="Drag handle"
        dragHandleAriaValue={(position: DragHandlePosition) =>
          position.percentage === 50 ? 'Center' : `${position.percentage}%`
        }
      >
        <MaterialPane class={styles['list-pane']}>
          <aside>
            <ExampleList name={params.name} />
          </aside>
        </MaterialPane>
        <MaterialPane>
          <Show
            when={params.name}
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
