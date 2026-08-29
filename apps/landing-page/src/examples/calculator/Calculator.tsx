import type { VoidComponent } from 'solid-js';

import { useNavigate } from '@solidjs/router';
import { MaterialAppBar } from '@solidmaterial/material/components/app-bar';
import { MaterialIconButton } from '@solidmaterial/material/components/icon-button';
import { Breakpoints } from '@solidmaterial/material/utils';
import { createSignal } from 'solid-js';

import type { ExampleListItemType } from '../../pages/examples/ExampleList';
import type { ExampleProps } from '../examples.types';

import { Calculator as CalculatorApp } from '../../../../calculator/src/calculator/Calculator';
import { ExpandContext, VibrateContext } from '../../../../calculator/src/contexts';

import styles from './Calculator.module.css';

import CalculateIcon from '@solidmaterial/icons/400/outlined/calculate.svg';
import OpenInNewIcon from '@solidmaterial/icons/400/outlined/open_in_new.svg';

export const Calculator: VoidComponent<ExampleProps> = props => {
  const navigate = useNavigate();
  const navigateBackToList = () => navigate('..', { state: { transition: 'backward' } });

  const [isVibrate, setVibrate] = createSignal(true);
  const [isExpanded, setExpanded] = createSignal(false);

  const isMobile = () => Breakpoints.isCompactWidth() || Breakpoints.isCompactHeight();

  return (
    <div class={styles['container']}>
      <MaterialAppBar
        variant={isMobile() ? 'small' : 'large'}
        title={props.data.label}
        leadingButtonAriaLabel="Go back to list"
        trailingButtons={
          <MaterialIconButton
            variant="text"
            title="Open webapp"
            icon={<OpenInNewIcon />}
            href="/calculator"
            target="_blank"
          />
        }
        onNavigate={navigateBackToList}
      />
      <main class={styles['main']}>
        <VibrateContext.Provider value={[isVibrate, setVibrate]}>
          <ExpandContext.Provider value={[isExpanded, setExpanded]}>
            <CalculatorApp />
          </ExpandContext.Provider>
        </VibrateContext.Provider>
      </main>
    </div>
  );
};

export const CalculatorExampleItem: ExampleListItemType = {
  name: 'calculator',
  label: 'Calculator',
  icon: CalculateIcon,
  supportingText: 'Button group',
  component: Calculator
};
