import type { Component } from 'solid-js';

import { MetaProvider, Title } from '@solidjs/meta';
import { MaterialAppBar } from '@solidmaterial/material/components/app-bar';
import { MaterialIconButton } from '@solidmaterial/material/components/icon-button';
import { MaterialBodyLayout, MaterialPane } from '@solidmaterial/material/layouts';

import { Calculator } from '../calculator/Calculator';

import SettingsFillIcon from '@solidmaterial/icons/400/outlined/settings-fill.svg';

const RouteHome: Component = () => {
  return (
    <>
      <MetaProvider>
        <Title>Calculator</Title>
      </MetaProvider>
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
              />
            }
          />
          <Calculator />
        </MaterialPane>
      </MaterialBodyLayout>
    </>
  );
};

// oxlint-disable-next-line import/no-default-export
export default RouteHome;
