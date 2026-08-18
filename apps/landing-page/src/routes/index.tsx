import type { Component } from 'solid-js';

import { MaterialAppBar } from '@solid-material/material/components/app-bar';
import { MaterialIconButton } from '@solid-material/material/components/icon-button';
import { H2 } from '@solid-material/material/components/typography';
import { MaterialBodyLayout, MaterialPane } from '@solid-material/material/layouts';
import { MetaProvider, Title } from '@solidjs/meta';
import { createSignal } from 'solid-js';

/* Used as a social button to link to GitHub project (see https://brand.github.com/foundations/logo) */
import GitHubBlackIcon from '../assets/GitHub_Invertocat_Black.svg';
import { SettingsToolbar } from '../pages/home/components/SettingsToolbar';
import { SectionColorSchemes } from '../pages/home/sections/color-schemes/SectionColorSchemes';
import { SectionComponents } from '../pages/home/sections/components/SectionComponents';
import { SectionCredits } from '../pages/home/sections/credits/SectionCredits';
import { SectionDesignTokens } from '../pages/home/sections/design-tokens/SectionDesignTokens';
import { SectionHero } from '../pages/home/sections/hero/SectionHero';
import { SectionLayouts } from '../pages/home/sections/layouts/SectionLayouts';
import { SectionLicense } from '../pages/home/sections/license/SectionLicense';

import styles from './index.module.css';

import SettingsFillIcon from '@solid-material/icons/400/outlined/settings-fill.svg';

const PageHome: Component = () => {
  const [isToolbarVisible, setToolbarVisible] = createSignal(false);

  const onClickSettings = () => {
    setToolbarVisible(value => !value);
  };

  return (
    <>
      <MetaProvider>
        <Title>Solid Material</Title>
      </MetaProvider>
      <MaterialBodyLayout variant="flexible-fixed">
        <MaterialPane>
          <MaterialAppBar
            variant="small"
            title="Solid Material"
            trailingButtons={
              <>
                <MaterialIconButton
                  variant="text"
                  title="GitHub"
                  icon={<GitHubBlackIcon style={{ scale: 0.9 }} />}
                  href="https://github.com/mprovok/solid-material"
                  target="_blank"
                />
                <MaterialIconButton
                  variant="text"
                  title="Settings"
                  icon={<SettingsFillIcon />}
                  onClick={onClickSettings}
                />
              </>
            }
          />
          <main class={styles['main']}>
            <SectionHero />
            <div class={styles['content']}>
              <SectionComponents />
              <SectionLayouts />
              <SectionColorSchemes />
              <SectionDesignTokens />
              <SectionCredits />
              <SectionLicense />
            </div>
          </main>
          <footer class={styles['footer']}>
            <div class={styles['footer-head']}></div>
            <div class={styles['footer-body']}>
              <H2 role="body" size="large">
                Copyright &copy; 2026 Solid Material contributors
              </H2>
            </div>
          </footer>
          <SettingsToolbar open={isToolbarVisible()} />
        </MaterialPane>
      </MaterialBodyLayout>
    </>
  );
};

// oxlint-disable-next-line import/no-default-export
export default PageHome;
