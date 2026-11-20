import type { Component } from 'solid-js';

import { Title } from '@solidjs/meta';
import { MaterialAppBar } from '@solidmaterial/material/components/app-bar';
import { MaterialIconButton } from '@solidmaterial/material/components/icon-button';
import { H2 } from '@solidmaterial/material/components/typography';
import {
  MaterialBodyLayout,
  MaterialNavigationRailLayoutMenuButton,
  MaterialPane
} from '@solidmaterial/material/layouts';
import { createSignal } from 'solid-js';

/* Used as a social button to link to GitHub project (see https://brand.github.com/foundations/logo) */
import GitHubBlackIcon from '../assets/GitHub_Invertocat_Black.svg';
import { ExternalLink } from '../components/external-link/ExternalLink';
import { FeatureCard } from '../components/feature-card/FeatureCard';
import { SettingsToolbar } from '../pages/home/components/SettingsToolbar';
import { SectionColorSchemes } from '../pages/home/sections/color-schemes/SectionColorSchemes';
import { SectionCredits } from '../pages/home/sections/credits/SectionCredits';
import { SectionHero } from '../pages/home/sections/hero/SectionHero';
import { SectionLicense } from '../pages/home/sections/license/SectionLicense';

import styles from './index.module.css';

import CodeBlocksIcon from '@solidmaterial/icons/400/outlined/code_blocks.svg';
import ColorsIcon from '@solidmaterial/icons/400/outlined/colors.svg';
import DeployedCodeIcon from '@solidmaterial/icons/400/outlined/deployed_code.svg';
import PaletteIcon from '@solidmaterial/icons/400/outlined/palette.svg';
import ResponsiveLayoutIcon from '@solidmaterial/icons/400/outlined/responsive_layout.svg';
import SettingsFillIcon from '@solidmaterial/icons/400/outlined/settings-fill.svg';
import TransitionPushIcon from '@solidmaterial/icons/400/outlined/transition_push.svg';

const PageHome: Component = () => {
  const [isToolbarVisible, setToolbarVisible] = createSignal(false);

  const onClickSettings = () => {
    setToolbarVisible(value => !value);
  };

  return (
    <>
      <Title>Solid Material</Title>
      <MaterialBodyLayout variant="flexible-fixed">
        <MaterialPane>
          <MaterialAppBar
            variant="small"
            title="Solid Material"
            leadingButton={<MaterialNavigationRailLayoutMenuButton title="Open menu" titleSelected="Close menu" />}
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
              <div class={styles['features']}>
                <FeatureCard title="Material 3 Expressive" icon={CodeBlocksIcon}>
                  Over 30+ components implemented, including components which are new in Expressive like button groups,
                  split buttons, FAB menu, and toolbars.
                </FeatureCard>
                <FeatureCard title="Layout components" icon={ResponsiveLayoutIcon}>
                  <p>
                    Responsive components for navigation (rail and bar) and content in multiple{' '}
                    <ExternalLink href="https://m3.material.io/foundations/layout/scaffold/panes">panes</ExternalLink>
                  </p>
                  <p>
                    Predefined components for the{' '}
                    <ExternalLink href="https://m3.material.io/foundations/layout/canonical-examples/list-detail">
                      list-detail
                    </ExternalLink>{' '}
                    and{' '}
                    <ExternalLink href="https://m3.material.io/foundations/layout/canonical-examples/supporting-pane">
                      supporting pane
                    </ExternalLink>{' '}
                    canonical layouts.
                  </p>
                </FeatureCard>
                <FeatureCard title="Dynamic theming" icon={ColorsIcon}>
                  Baseline and dynamic color schemes based on a source color.
                </FeatureCard>
                <FeatureCard title="Design tokens" icon={PaletteIcon}>
                  Includes tokens for easings, springs, and static palette color tokens for 11 colors.
                </FeatureCard>
                <FeatureCard title="View transitions" icon={TransitionPushIcon}>
                  Animated transitions between pages using the View Transitions API.
                </FeatureCard>
                <FeatureCard title="Few dependencies" icon={DeployedCodeIcon}>
                  <p>
                    Uses new CSS features like scroll-driven animations and anchor positioning to avoid external
                    dependencies.
                  </p>
                  <p>
                    In browsers which support it, some components use{' '}
                    <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interpolate-size">
                      interpolate-size
                    </ExternalLink>{' '}
                    for slightly improved animations.
                  </p>
                </FeatureCard>
              </div>
              <SectionColorSchemes />
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
