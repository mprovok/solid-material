import type { Component } from 'solid-js';

import { MaterialAppBar } from '@solidmaterial/material/components/app-bar';
import { MaterialCard, MaterialCardBody } from '@solidmaterial/material/components/card';
import { MaterialCarousel, MaterialCarouselItem } from '@solidmaterial/material/components/carousel';
import { MaterialIconButton } from '@solidmaterial/material/components/icon-button';
import { showSnack } from '@solidmaterial/material/components/snackbar';
import { H2 } from '@solidmaterial/material/components/typography';
import {
  MaterialBodyLayout,
  MaterialNavigationRailLayoutMenuButton,
  MaterialPane
} from '@solidmaterial/material/layouts';
import { onMount } from 'solid-js';

import { ExampleConnectedButtonGroup } from '../components/examples/ExampleConnectedButtonGroup';
import { ExampleList } from '../components/examples/ExampleList';
import { ExampleSearchBar } from '../components/examples/ExampleSearchBar';
import { ExampleSplitButtonMenu } from '../components/examples/ExampleSplitButtonMenu';
import { Logo } from '../logo/Logo';

import styles from './index.module.css';

import MoreVertFillIcon from '@solidmaterial/icons/400/outlined/more_vert-fill.svg';

const PageHome: Component = () => {
  const doNothing = () => {
    // Empty
  };

  onMount(() => {
    showSnack({
      text: 'Snackbar',
      dismissable: true,
      action: {
        label: 'Action',
        onClick: doNothing
      }
    });
  });

  return (
    <MaterialBodyLayout variant="flexible-fixed">
      <MaterialPane>
        <MaterialAppBar
          variant="small"
          title="App bar"
          leadingButton={<MaterialNavigationRailLayoutMenuButton title="Open menu" titleSelected="Close menu" />}
          trailingButtons={
            <MaterialIconButton variant="text" title="More" icon={<MoreVertFillIcon />} href="/" transition="forward" />
          }
        />
        <main class={styles['main']}>
          <Logo />
          <ExampleSearchBar />
          <div>
            <MaterialCarousel
              variant="multi-browse"
              header="Carousel"
              showAllHeaderTitle="Show all"
              onShowAll={doNothing}
            >
              <MaterialCarouselItem onClick={doNothing}>
                <img
                  src="https://mdn.github.io/shared-assets/images/examples/balloons.jpg"
                  alt="Balloons near ground"
                  loading="lazy"
                  decoding="async"
                />
              </MaterialCarouselItem>
              <MaterialCarouselItem onClick={doNothing}>
                <img
                  src="https://mdn.github.io/shared-assets/images/examples/balloons-landscape.jpg"
                  alt="Balloons near ground"
                  loading="lazy"
                  decoding="async"
                />
              </MaterialCarouselItem>
              <MaterialCarouselItem onClick={doNothing}>
                <img
                  src="https://mdn.github.io/shared-assets/images/examples/balloon_640x427.jpg"
                  alt="Balloons near ground"
                  loading="lazy"
                  decoding="async"
                />
              </MaterialCarouselItem>
            </MaterialCarousel>
          </div>
          <MaterialCard variant="filled" size="medium">
            <MaterialCardBody>
              <H2 role="title" size="medium">
                Card
              </H2>
              <p>
                <ExampleList />
              </p>
              <div class={styles['buttons-in-card']}>
                <ExampleConnectedButtonGroup />
                <ExampleSplitButtonMenu />
              </div>
            </MaterialCardBody>
          </MaterialCard>
        </main>
      </MaterialPane>
    </MaterialBodyLayout>
  );
};

// oxlint-disable-next-line import/no-default-export
export default PageHome;
