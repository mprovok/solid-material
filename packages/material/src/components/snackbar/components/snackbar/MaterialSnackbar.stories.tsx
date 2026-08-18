import { createJSXDecorator } from 'storybook-solidjs-vite';
import { fn } from 'storybook/test';

import preview from '../../../../../.storybook/preview';
import { SnackbarTransition } from '../../MaterialSnackbarContainer';

import { MaterialSnackbar } from './MaterialSnackbar';
import readMe from './README.md?raw';

import styles from './MaterialSnackbar.stories.module.css';

const meta = preview.meta({
  title: 'Components/MaterialSnackbarContainer/MaterialSnackbar',
  component: MaterialSnackbar,
  decorators: [
    createJSXDecorator(Story => (
      <SnackbarTransition>
        <div popover="auto" class={styles['wrapper']}>
          <Story />
        </div>
      </SnackbarTransition>
    ))
  ],
  parameters: {
    docs: {
      description: {
        component: readMe
      },
      story: {
        inline: false
      }
    }
  }
});

export const Example = meta.story({
  parameters: {
    docs: {
      description: {
        story: 'A non-dismissable snackbar with no action closes after 4 seconds by default.'
      }
    }
  },
  args: {
    children: 'Supporting text'
  }
});

export const Action = meta.story({
  parameters: {
    docs: {
      description: {
        story: 'A non-dismissable snackbar with an action closes after 10 seconds by default.'
      }
    }
  },
  args: {
    children: 'Supporting text',
    actionLabel: 'Action',
    onAction: fn()
  }
});

export const Dismissable = meta.story({
  args: {
    children: 'Supporting text',
    closeTitle: 'Close',
    onClose: fn()
  }
});

export const DismissableWithAction = meta.story({
  args: {
    children: 'Supporting text',
    actionLabel: 'Action',
    closeTitle: 'Close',
    onAction: fn(),
    onClose: fn()
  }
});
