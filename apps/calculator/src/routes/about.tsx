import type { Component } from 'solid-js';

// oxlint-disable-next-line import/no-absolute-path
import favIconUrl from '/assets/favicon.svg?url&no-inline';
//
import { MetaProvider, Title } from '@solidjs/meta';
import { useNavigate } from '@solidjs/router';
import { MaterialAppBar } from '@solidmaterial/material/components/app-bar';
import { H2, H3 } from '@solidmaterial/material/components/typography';
import { MaterialBodyLayout, MaterialPane } from '@solidmaterial/material/layouts';

import manifest from '../../manifest.json';

import styles from './about.module.css';

const RouteAbout: Component = () => {
  const navigate = useNavigate();
  const navigateBack = () => navigate('/settings', { state: { transition: 'backward' } });

  return (
    <>
      <MetaProvider>
        <Title>About</Title>
      </MetaProvider>
      <MaterialBodyLayout variant="flexible-fixed">
        <MaterialPane>
          <MaterialAppBar variant="small" title="About" leadingButtonAriaLabel="Go back" onNavigate={navigateBack} />
          <main class={styles['main']}>
            <img src={favIconUrl} alt="logo" class={styles['logo']} />
            <H2 role="display" size="small">
              {manifest.name} {APP_VERSION}
            </H2>
            <H3 role="title" size="medium">
              {manifest.description}
            </H3>
          </main>
        </MaterialPane>
      </MaterialBodyLayout>
    </>
  );
};

// oxlint-disable-next-line import/no-default-export
export default RouteAbout;
