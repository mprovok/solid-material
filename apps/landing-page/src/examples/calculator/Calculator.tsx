import type { VoidComponent } from 'solid-js';

import { useNavigate } from '@solidjs/router';
import { MaterialAppBar } from '@solidmaterial/material/components/app-bar';
import { Breakpoints } from '@solidmaterial/material/utils';

import type { ExampleListItemType } from '../../pages/examples/ExampleList';
import type { ExampleProps } from '../examples.types';

import { Calculator as CalculatorApp } from '../../../../calculator/src/calculator/Calculator';

import styles from './Calculator.module.css';

import CalculateIcon from '@solidmaterial/icons/400/outlined/calculate.svg';

export const Calculator: VoidComponent<ExampleProps> = props => {
  const navigate = useNavigate();
  const navigateBackToList = () => navigate(-1);

  const isMobile = () => Breakpoints.isCompactWidth() || Breakpoints.isCompactHeight();

  return (
    <div class={styles['container']}>
      <MaterialAppBar
        variant={isMobile() ? 'small' : 'large'}
        title={props.data.label}
        leadingButtonAriaLabel="Go back to list"
        onNavigate={navigateBackToList}
      />
      <CalculatorApp />
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
