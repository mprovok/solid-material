import type { Component } from 'solid-js';

import { MaterialAppBar } from '@solid-material/material/components/app-bar';
import { MaterialIconButton } from '@solid-material/material/components/icon-button';
import { MaterialBodyLayout, MaterialPane } from '@solid-material/material/layouts';
import { MetaProvider, Title } from '@solidjs/meta';

import { Calculator } from '../calculator/Calculator';

import SettingsFillIcon from '@solid-material/icons/400/outlined/settings-fill.svg';

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
              <MaterialIconButton variant="text" title="Settings" icon={<SettingsFillIcon />} href="/settings" />
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
