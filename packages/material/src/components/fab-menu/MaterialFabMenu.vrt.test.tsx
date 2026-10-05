import type { FlowComponent } from 'solid-js';

import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import type { MaterialFabColor, MaterialFabSize } from '../fab/MaterialFab';

import { MaterialTheme } from '../../styling/material-theme/MaterialTheme';

import type { MaterialFabMenuItem, MaterialFabMenuProps } from './MaterialFabMenu';

import { MaterialFabMenu } from './MaterialFabMenu';

import EditIcon from '@solidmaterial/icons/400/outlined/edit.svg';
import PhotoFillIcon from '@solidmaterial/icons/400/outlined/photo-fill.svg';
import SpeakerFillIcon from '@solidmaterial/icons/400/outlined/speaker-fill.svg';
import VideocamFillIcon from '@solidmaterial/icons/400/outlined/videocam-fill.svg';

// Written by Gemma 4 26B A4B, modified to fix lint warnings

const Wrapper: FlowComponent = props => (
  <MaterialTheme theme="tonal-spot">
    <div style={{ 'background-color': 'white', padding: '2rem', height: '300px' }}>{props.children}</div>
  </MaterialTheme>
);

const emptyFn = () => {
  // Empty
};

const getItems = (): MaterialFabMenuItem[] => [
  { label: 'First', icon: <PhotoFillIcon />, onClick: emptyFn },
  { label: 'Second', icon: <VideocamFillIcon />, onClick: emptyFn },
  { label: 'Third', icon: <SpeakerFillIcon />, onClick: emptyFn }
];

const renderComponent = async (props: Omit<MaterialFabMenuProps, 'icon' | 'items'>) => {
  const { baseElement } = render(() => <MaterialFabMenu {...props} icon={<EditIcon />} items={getItems()} />, {
    wrapper: Wrapper
  });
  await document.fonts.ready;
  return page.elementLocator(baseElement);
};

const COLORS: MaterialFabColor[] = [
  'primary',
  'secondary',
  'tertiary',
  'primary-container',
  'secondary-container',
  'tertiary-container'
];
const SIZES: MaterialFabSize[] = ['small', 'medium', 'large'];

describe('MaterialFabMenu', () => {
  describe('Visual', () => {
    describe('Closed State', () => {
      it.each(COLORS)('renders color $0', async color => {
        const screen = await renderComponent({ color });

        const button = screen.getByRole('button');
        await expect.element(button).toBeVisible();

        const menu = screen.getByRole('menu');
        await expect.element(menu).not.toBeInTheDocument();

        const container = screen.getByElement('sm-fab-menu');
        await expect.element(container).toMatchScreenshot();
      });

      it.each(SIZES)('renders size $0', async size => {
        const screen = await renderComponent({ color: 'primary', size });

        const button = screen.getByRole('button');
        await expect.element(button).toBeVisible();

        const menu = screen.getByRole('menu');
        await expect.element(menu).not.toBeInTheDocument();

        const container = screen.getByElement('sm-fab-menu');
        await expect.element(container).toMatchScreenshot();
      });
    });

    describe('Open State', () => {
      it.each(COLORS)('renders color $0 when open', async color => {
        const screen = await renderComponent({ color });

        const button = screen.getByRole('button');
        await userEvent.click(button);
        await userEvent.unhover(button);

        const menu = screen.getByRole('menu');
        await expect.element(menu).toBeVisible();

        const container = screen.getByElement('sm-fab-menu');
        await expect.element(container).toMatchScreenshot();
      });

      it.each(SIZES)('renders size $0 when open', async size => {
        const screen = await renderComponent({ color: 'primary', size });

        const button = screen.getByRole('button');
        await userEvent.click(button);
        await userEvent.unhover(button);

        const menu = screen.getByRole('menu');
        await expect.element(menu).toBeVisible();

        const container = screen.getByElement('sm-fab-menu');
        await expect.element(container).toMatchScreenshot();
      });
    });
  });
});
