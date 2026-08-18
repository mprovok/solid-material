import addonA11y from '@storybook/addon-a11y';
import addonDocs from '@storybook/addon-docs';
import addonVitest from '@storybook/addon-vitest';
import { createJSXDecorator, definePreview } from 'storybook-solidjs-vite';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';

import { MaterialTheme } from '../src/styling/material-theme/MaterialTheme';

// oxlint-disable-next-line import/no-default-export
export default definePreview({
  addons: [addonDocs(), addonVitest(), addonA11y()],
  decorators: [
    createJSXDecorator(Story => (
      <MaterialTheme>
        <Story />
      </MaterialTheme>
    ))
  ],
  tags: ['autodocs'],
  initialGlobals: {
    backgrounds: { value: undefined },
    viewport: { value: undefined }
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'region',
            enabled: false
          },
          {
            id: 'empty-heading',
            enabled: false
          },
          {
            id: 'button-name',
            enabled: false
          }
        ]
      },
      test: 'error'
    },
    backgrounds: {
      options: {
        surface: {
          name: 'Surface',
          value: 'var(--md-sys-color-surface)'
        },
        container: {
          name: 'Surface container',
          value: 'var(--md-sys-color-surface-container)'
        }
      }
    },
    docs: {
      toc: true
    },
    layout: 'centered',
    viewport: {
      options: INITIAL_VIEWPORTS
    }
  }
});
