import type { RouteComponent } from '@solidjs/router';

import { Title } from '@solidjs/meta';
import { MaterialAppBar } from '@solidmaterial/material/components/app-bar';
import { MaterialIconButton } from '@solidmaterial/material/components/icon-button';
import { MaterialBodyLayout, MaterialPane } from '@solidmaterial/material/layouts';

import type { Router } from '../router';

import { Calculator } from '../calculator/Calculator';

import styles from './index.module.css';

import SettingsFillIcon from '@solidmaterial/icons/400/outlined/settings-fill.svg';

const RouteHome: RouteComponent<typeof Router.paths> = () => {
  return (
    <>
      <Title>Calculator</Title>
      <MaterialBodyLayout variant="flexible-fixed">
        <MaterialPane>
          <MaterialAppBar
            variant="small"
            title=""
            trailingButtons={
              <MaterialIconButton
                variant="text"
                title="Settings"
                icon={<SettingsFillIcon />}
                href="/calculator/settings"
                transition="forward"
              />
            }
          />
          <main class={styles['main']}>
            <Calculator />
          </main>
        </MaterialPane>
      </MaterialBodyLayout>
    </>
  );
};

// oxlint-disable-next-line import/no-default-export
export default RouteHome;
