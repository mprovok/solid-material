import type { VoidComponent } from 'solid-js';

import { For, splitProps } from 'solid-js';
import { createJSXDecorator } from 'storybook-solidjs-vite';
import { fn } from 'storybook/test';

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
      {_item => (
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
  }
});
