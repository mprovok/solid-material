import type { RouteComponent } from '@solidjs/router';

// oxlint-disable-next-line import/no-absolute-path
import favIconUrl from '/assets/favicon.svg?url';
//
import { Title } from '@solidjs/meta';
import { useNavigate } from '@solidjs/router';
import { MaterialAppBar } from '@solidmaterial/material/components/app-bar';
import { H2, H3 } from '@solidmaterial/material/components/typography';
import { MaterialBodyLayout, MaterialPane } from '@solidmaterial/material/layouts';

import type { Router } from '../router';

import manifest from '../../manifest.json';

import styles from './about.module.css';

const RouteAbout: RouteComponent<typeof Router.paths.about> = () => {
  const navigate = useNavigate();
  const navigateBack = () => navigate('/settings', { state: { transition: 'backward' } });

  return (
    <>
      <Title>About</Title>
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
