import { createJSXDecorator } from 'storybook-solidjs-vite';

import preview from '../../../.storybook/preview';
import { MaterialButton } from '../button/MaterialButton';

import { MaterialSnackbarContainer } from './MaterialSnackbarContainer';
import { showSnack } from './MaterialSnackbarContext';
import readMe from './README.md?raw';

import styles from './MaterialSnackbarContainer.stories.module.css';

const meta = preview.meta({
  title: 'Components/MaterialSnackbarContainer',
  decorators: [
    createJSXDecorator(Story => (
      <div class={styles['story']}>
        <div style={{ padding: '1rem' }}>
          <Story />
        </div>
        <div class={styles['container']}>
          <MaterialSnackbarContainer alignment="start" />
        </div>
      </div>
    ))
  ],
  parameters: {
    docs: {
      description: {
        component: readMe
      }
    }
  }
});

export const Example = meta.story({
  render: () => {
    return (
      <div class={styles['buttons']}>
        <MaterialButton
          variant="tonal"
          onClick={() => {
            showSnack({
              text: 'Supporting text (closes after 4 seconds)',
              dismissable: false
            });
          }}
        >
          Only text
        </MaterialButton>
        <MaterialButton
          variant="tonal"
          onClick={() => {
            showSnack({
              text: 'Supporting text (closes after 10 seconds)',
              dismissable: false,
              action: {
                label: 'Action',
                onClick: () => console.info('Clicked action')
              }
            });
          }}
        >
          With action
        </MaterialButton>
        <MaterialButton
          variant="tonal"
          onClick={() => {
            showSnack({
              text: 'Supporting text',
              dismissable: true
            });
          }}
        >
          Dismissable
        </MaterialButton>
        <MaterialButton
          variant="tonal"
          onClick={() => {
            showSnack({
              text: 'Supporting text',
              dismissable: true,
              action: {
                label: 'Action',
                onClick: () => console.info('Clicked action')
              }
            });
          }}
        >
          Dismissable with action
        </MaterialButton>
      </div>
    );
  }
});
