import type { VoidComponent } from 'solid-js';

import { For, splitProps } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { MaterialButton } from '../button';

import type { MaterialCarouselItemProps } from './MaterialCarouselItem';

import { MaterialCarousel } from './MaterialCarousel';
import { MaterialCarouselItem } from './MaterialCarouselItem';

const meta = preview.meta({
  title: 'Components/MaterialCarousel',
  component: MaterialCarousel,
  decorators: [
    createJSXDecorator(Story => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ))
  ],
  globals: {
    viewport: { value: 'iphoneSE3', isRotated: false }
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'scrollable-region-focusable',
            enabled: false
          }
        ]
      }
    },
    docs: {
      story: {
        iframeHeight: '400px',
        inline: false
      }
    },
    layout: 'fullscreen'
  }
});

interface CarouselItemsProps extends MaterialCarouselItemProps {
  length: number;
}

const CarouselItems: VoidComponent<CarouselItemsProps> = args => {
  const [localProps, itemArgs] = splitProps(args, ['length']);
  return (
    <For each={Array.from({ length: localProps.length })}>
      {_ => (
        <MaterialCarouselItem {...itemArgs}>
          <img
            src="https://mdn.github.io/shared-assets/images/examples/balloons.jpg"
            alt="Balloons near ground"
            loading="lazy"
            decoding="async"
          />
        </MaterialCarouselItem>
      )}
    </For>
  );
};

export const MultiBrowse = meta.story({
  args: {
    variant: 'multi-browse',
    children: <CarouselItems length={10} ariaLabel="Balloons near ground" onClick={fn()} />
  }
});

export const Uncontained = meta.story({
  args: {
    variant: 'uncontained',
    children: <CarouselItems length={10} ariaLabel="Balloons near ground" onClick={fn()} />
  }
});

export const Hero = meta.story({
  args: {
    variant: 'hero',
    children: <CarouselItems length={10} ariaLabel="Balloons near ground" onClick={fn()} />
  }
});

export const CenteredHero = meta.story({
  args: {
    variant: 'centered-hero',
    children: <CarouselItems length={10} ariaLabel="Balloons near ground" onClick={fn()} />
  }
});

export const Fullscreen = meta.story({
  args: {
    variant: 'full-screen',
    children: <CarouselItems length={10} ariaLabel="Balloons near ground" onClick={fn()} />
  }
});

export const Header = meta.story({
  args: {
    variant: 'multi-browse',
    header: 'Header',
    children: <CarouselItems length={3} ariaLabel="Balloons near ground" onClick={fn()} />
  }
});

export const ShowAllHeader = meta.story({
  args: {
    variant: 'multi-browse',
    header: 'Header',
    showAllHeaderTitle: 'Show all',
    children: <CarouselItems length={3} ariaLabel="Balloons near ground" onClick={fn()} />,
    onShowAll: fn()
  }
});

export const ShowAllButton = meta.story({
  args: {
    variant: 'multi-browse',
    showAllButtonLabel: 'Show all',
    children: <CarouselItems length={3} ariaLabel="Balloons near ground" onClick={fn()} />,
    onShowAll: fn()
  },
  play: async ({ canvas }) => {
    await userEvent.tab();

    const items = canvas.getAllByRole('listitem');

    await waitFor(async () => expect(items[0]).toHaveFocus());

    await userEvent.keyboard('{ArrowDown}', { delay: 250 });

    const button = canvas.getByRole('button', { name: 'Show all' });

    await waitFor(async () => expect(button).toHaveFocus());

    button.blur();
  }
});

export const Height = meta.story({
  args: {
    variant: 'multi-browse',
    height: '250px',
    children: <CarouselItems length={10} ariaLabel="Balloons near ground" onClick={fn()} />
  }
});

export const ItemMaxWidth = meta.story({
  args: {
    variant: 'multi-browse',
    itemMaxWidth: '110px',
    children: <CarouselItems length={10} ariaLabel="Balloons near ground" onClick={fn()} />
  }
});

export const Disabled = meta.story({
  args: {
    variant: 'multi-browse',
    children: <CarouselItems length={3} disabled={true} ariaLabel="Balloons near ground" onClick={fn()} />
  }
});

const onClickItem = fn();

export const ClickableItem = meta.story({
  args: {
    variant: 'multi-browse',
    children: (
      <MaterialCarouselItem ariaLabel="Balloons near ground" onClick={onClickItem}>
        <img
          src="https://mdn.github.io/shared-assets/images/examples/balloons.jpg"
          alt="Balloons near ground"
          loading="lazy"
          decoding="async"
        />
      </MaterialCarouselItem>
    )
  },
  play: async ({ canvas }) => {
    await userEvent.tab();

    const item = canvas.getByRole('listitem');
    await waitFor(async () => expect(item).toHaveFocus());

    await expect(onClickItem).not.toHaveBeenCalled();

    await userEvent.keyboard('{Enter}', { delay: 250 });
    await waitFor(async () => expect(onClickItem).toHaveBeenCalledTimes(1));

    await userEvent.click(item);
    await waitFor(async () => expect(onClickItem).toHaveBeenCalledTimes(2));
  }
});

export const Keyboard = meta.story({
  decorators: [
    createJSXDecorator(Story => (
      <>
        <MaterialButton variant="tonal">Focusable (above)</MaterialButton>
        <Story />
        <MaterialButton variant="tonal">Focusable (below)</MaterialButton>
      </>
    ))
  ],
  args: {
    variant: 'multi-browse',
    children: <CarouselItems length={10} ariaLabel="Balloons near ground" onClick={fn()} />
  },
  play: async ({ canvas, step }) => {
    await userEvent.tab();

    const buttonAbove = canvas.getByRole('button', { name: 'Focusable (above)' });
    await waitFor(async () => expect(buttonAbove).toHaveFocus());

    const items = canvas.getAllByRole('listitem');

    await step('Move focus to carousel', async () => {
      await userEvent.tab();
      await waitFor(async () => expect(items[0]).toHaveFocus());
    });

    await step('Move focus to items in carousel', async () => {
      await userEvent.keyboard('{End}', { delay: 250 });
      await waitFor(async () => expect(items.at(-1)).toHaveFocus());

      await userEvent.keyboard('{Home}', { delay: 250 });
      await waitFor(async () => expect(items[0]).toHaveFocus());

      await userEvent.tab();
      await waitFor(async () => expect(items[1]).toHaveFocus());

      await userEvent.keyboard('{ArrowRight}', { delay: 250 });
      await waitFor(async () => expect(items[2]).toHaveFocus());

      await userEvent.keyboard('{ArrowLeft}', { delay: 250 });
      await waitFor(async () => expect(items[1]).toHaveFocus());
    });

    await step('Move focus to element below carousel', async () => {
      await userEvent.keyboard('{ArrowDown}', { delay: 250 });

      const buttonBelow = canvas.getByRole('button', { name: 'Focusable (below)' });
      await waitFor(async () => expect(buttonBelow).toHaveFocus());
    });

    await step('Move focus to carousel', async () => {
      await userEvent.tab({ shift: true });
      await waitFor(async () => expect(items.at(-1)).toHaveFocus());

      await userEvent.keyboard('{Home}', { delay: 250 });
      await waitFor(async () => expect(items[0]).toHaveFocus());

      await userEvent.keyboard('{ArrowRight}', { delay: 250 });
      await waitFor(async () => expect(items[1]).toHaveFocus());
    });

    await step('Move focus to element above carousel', async () => {
      await userEvent.keyboard('{ArrowUp}', { delay: 250 });
      await waitFor(async () => expect(buttonAbove).toHaveFocus());
    });

    buttonAbove.blur();
  }
});
