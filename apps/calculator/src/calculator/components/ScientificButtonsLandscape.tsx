import type { VoidComponent } from 'solid-js';

import { MaterialButtonGroup } from '@solidmaterial/material/components/button-group';
import { Match, Switch } from 'solid-js';

import { CalculatorAction } from '../Calculator.types';

import { ToggleDegreesButton } from './buttons/ToggleDegreesButton';
import { ToggleInvertedButton } from './buttons/ToggleInvertedButton';
import { CalculatorButton } from './CalculatorButton';
import { Superscript } from './Superscript';

import styles from './ScientificButtonsPortrait.module.css';

export interface ScientificButtonsLandscapeProps {
  toggleDegrees: boolean;
  toggleInverted: boolean;
  onClickDegrees: () => void;
  onClickInverted: () => void;
}

export const ScientificButtonsLandscape: VoidComponent<ScientificButtonsLandscapeProps> = props => {
  return (
    <>
      <div class={styles['mode-button-row']}>
        <ToggleDegreesButton toggle={props.toggleDegrees} onClick={props.onClickDegrees} />
        <div>
          <MaterialButtonGroup variant="standard">
            <Switch>
              <Match when={props.toggleInverted}>
                <CalculatorButton action={CalculatorAction.SQUARE} ariaLabel="Square">
                  <Superscript base="x" superscript="2" />
                </CalculatorButton>
              </Match>
              <Match when={!props.toggleInverted}>
                <CalculatorButton action={CalculatorAction.SQRT}>√</CalculatorButton>
              </Match>
            </Switch>
            <CalculatorButton action={CalculatorAction.OPERATOR_POWER} ariaLabel="Power">
              ^
            </CalculatorButton>
          </MaterialButtonGroup>
        </div>
      </div>
      <div class={styles['mode-button-row']}>
        <ToggleInvertedButton toggle={props.toggleInverted} onClick={props.onClickInverted} />
        <div>
          <MaterialButtonGroup variant="standard">
            <CalculatorButton action={CalculatorAction.PI}>π</CalculatorButton>
            <CalculatorButton action={CalculatorAction.FACTORIAL} ariaLabel="Factorial">
              !
            </CalculatorButton>
          </MaterialButtonGroup>
        </div>
      </div>
      <MaterialButtonGroup variant="standard">
        <Switch>
          <Match when={props.toggleInverted}>
            <CalculatorButton action={CalculatorAction.ARCSIN} ariaLabel="Inverse sine">
              <Superscript base="sin" superscript="-1" />
            </CalculatorButton>
            <CalculatorButton action={CalculatorAction.ARCCOS} ariaLabel="Inverse cosine">
              <Superscript base="cos" superscript="-1" />
            </CalculatorButton>
            <CalculatorButton action={CalculatorAction.ARCTAN} ariaLabel="Inverse tangent">
              <Superscript base="tan" superscript="-1" />
            </CalculatorButton>
          </Match>
          <Match when={!props.toggleInverted}>
            <CalculatorButton action={CalculatorAction.SIN} ariaLabel="Sine">
              sin
            </CalculatorButton>
            <CalculatorButton action={CalculatorAction.COS} ariaLabel="Cosine">
              cos
            </CalculatorButton>
            <CalculatorButton action={CalculatorAction.TAN} ariaLabel="Tangent">
              tan
            </CalculatorButton>
          </Match>
        </Switch>
      </MaterialButtonGroup>
      <MaterialButtonGroup variant="standard">
        <CalculatorButton action={CalculatorAction.E} ariaLabel="Euler's number">
          e
        </CalculatorButton>
        <Switch>
          <Match when={props.toggleInverted}>
            <CalculatorButton action={CalculatorAction.EXP} ariaLabel="Euler's number raised to a power">
              <Superscript base="e" superscript="x" />
            </CalculatorButton>
            <CalculatorButton action={CalculatorAction.TEN_POWER_X} ariaLabel="10 raised to a power">
              <Superscript base="10" superscript="x" />
            </CalculatorButton>
          </Match>
          <Match when={!props.toggleInverted}>
            <CalculatorButton action={CalculatorAction.LN} ariaLabel="Natural logarithm">
              ln
            </CalculatorButton>
            <CalculatorButton action={CalculatorAction.LOG} ariaLabel="Base 10 logarithm">
              log
            </CalculatorButton>
          </Match>
        </Switch>
      </MaterialButtonGroup>
    </>
  );
};
