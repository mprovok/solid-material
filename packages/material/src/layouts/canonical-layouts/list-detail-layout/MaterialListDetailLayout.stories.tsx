import { For } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';
import { fn } from 'storybook/test';

import preview from '../../../../.storybook/preview';
import { MaterialIcon } from '../../../components/icon/MaterialIcon';
import { MaterialList } from '../../../components/list/MaterialList';
import { MaterialListItem } from '../../../components/list/MaterialListItem';
import { MaterialPane } from '../../pane/MaterialPane';

import { MaterialListDetailLayout } from './MaterialListDetailLayout';

import AccountCircleFill from '@solidmaterial/icons/400/outlined/account_circle-fill.svg';

const meta = preview.meta({
  title: 'Layouts/MaterialListDetailLayout',
  component: MaterialListDetailLayout,
  decorators: [
    createJSXDecorator(Story => (
      <div style={{ display: 'grid', height: '100vh' }}>
        <Story />
      </div>
    ))
  ],
  args: {
    dragHandleAriaLabel: 'Drag handle',
    children: (
      <>
        <MaterialPane>
          <aside style={{ 'min-height': '100%' }}>
            <MaterialList segmented={true}>
              <For each={Array.from({ length: 7 })}>
                {(_, index) => (
                  <MaterialListItem
                    start={
                      <MaterialIcon>
                        <AccountCircleFill />
                      </MaterialIcon>
                    }
                    overlineText="Overline text"
                    supportingText="Supporting text"
                    align="top"
                    onClick={fn()}
                  >
                    Label {index()}
                  </MaterialListItem>
                )}
              </For>
            </MaterialList>
          </aside>
        </MaterialPane>
        <MaterialPane>
          <main>Details</main>
        </MaterialPane>
      </>
    )
  },
  globals: {
    backgrounds: {
      value: 'surface-container'
    }
  },
  parameters: {
    docs: {
      story: {
        iframeHeight: '500px',
        inline: false
      }
    },
    layout: 'fullscreen'
  }
});

export const Example = meta.story({
  args: {
    selected: false
  }
});

export const NotSelectedOnMobile = meta.story({
  args: {
    selected: false
  },
  tags: ['!autodocs'],
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: false }
  }
});

export const SelectedOnMobile = meta.story({
  args: {
    selected: true
  },
  tags: ['!autodocs'],
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: false }
  }
});
