import preview from '../../../.storybook/preview';
import { ColorRoles } from '../color-roles/ColorRoles';

import { DEFAULT_MATERIAL_THEME_COLOR, MaterialTheme } from './MaterialTheme';

const meta = preview.meta({
  title: 'Utilities/MaterialTheme',
  component: MaterialTheme,
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false
          }
        ]
      }
    },
    controls: {
      matchers: {
        color: /color$/iu
      }
    },
    docs: {
      story: {
        iframeHeight: '600px',
        inline: false
      }
    },
    layout: 'padded'
  }
});

export const Color = meta.story({
  args: {
    color: DEFAULT_MATERIAL_THEME_COLOR,
    children: <ColorRoles />
  }
});

export const BaselineTheme = meta.story({
  args: {
    children: <ColorRoles />
  }
});

export const DynamicTheme = meta.story({
  args: {
    theme: 'tonal-spot',
    color: DEFAULT_MATERIAL_THEME_COLOR,
    children: <ColorRoles />
  }
});
