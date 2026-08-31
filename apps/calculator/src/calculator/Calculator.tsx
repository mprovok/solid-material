import type { JSX, VoidComponent } from 'solid-js';

import { createMediaQuery } from '@solid-primitives/media';
import { Span } from '@solidmaterial/material/components/typography';
import { Match, Show, Switch, createEffect, createSignal, useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { ExpandContext, VibrateContext } from '../contexts';

import type { DisplayVariant } from './components/Display';
import type { Token } from './tokenizer/types';

import { BUTTON_PRESS_VIBRATE_MS, CalculatorAction, CalculatorExecuteActionContext } from './Calculator.types';
import { ExpandButton } from './components/buttons/ExpandButton';
import { Display } from './components/Display';
import { MainButtonsLandscape } from './components/MainButtonsLandscape';
import { MainButtonsPortrait } from './components/MainButtonsPortrait';
import { ScientificButtonsLandscape } from './components/ScientificButtonsLandscape';
import { ScientificButtonsPortrait } from './components/ScientificButtonsPortrait';
import { evaluate } from './evaluate/evaluate';
import { parse } from './parser/parser';
import { toString } from './tokenizer/stringifier';
import { backspace, balanceParentheses, process, tokenizeNumber } from './tokenizer/tokenizer';

import styles from './Calculator.module.css';

const isAppendableAction = (action: CalculatorAction): boolean =>
  [
    CalculatorAction.OPERATOR_ADD,
    CalculatorAction.OPERATOR_SUBTRACT,
    CalculatorAction.OPERATOR_DIVIDE,
    CalculatorAction.OPERATOR_MULTIPLY,
    CalculatorAction.OPERATOR_POWER,
    CalculatorAction.SQUARE,
    CalculatorAction.PERCENT,
    CalculatorAction.FACTORIAL
  ].includes(action);

export const Calculator: VoidComponent = () => {
  const [isExpanded, _setExpanded] = useContext(ExpandContext);
  const [isVibrate, _setVibrate] = useContext(VibrateContext);

  const [isInverted, setInverted] = createSignal(false);
  const [isDegrees, setDegrees] = createSignal(false);
  const [hasToggledDegrees, setToggledDegrees] = createSignal(false);

  const [inputTokens, setInputTokens] = createSignal<Token[]>([]);
  const [outputTokens, setOutputTokens] = createSignal<Token[]>([]);

  const [input, setInput] = createSignal<JSX.Element[]>([]);
  const [output, setOutput] = createSignal<number>();
  const [error, setError] = createSignal<string>();

  const vibrate = () => {
    if (isVibrate()) {
      globalThis.navigator.vibrate(BUTTON_PRESS_VIBRATE_MS);
    }
  };

  const pressAC = () => {
    setInputTokens([]);
    setOutputTokens([]);
    setToggledDegrees(false);
    vibrate();
  };

  const pressBackspace = () => {
    if (outputTokens().length > 0) {
      setOutputTokens([]);
    }
    setInputTokens(tokens => backspace(tokens));
    vibrate();
  };

  const pressEquals = () => {
    setOutputTokens(balanceParentheses(inputTokens()));
    vibrate();
  };

  const processButton = (action: CalculatorAction) => {
    const result = output();

    // If an output or error is currently shown, clear the output tokens
    // to clear the output or error. This causes the original input and the
    // current action to be shown again
    if (result !== undefined || error() !== undefined) {
      setOutputTokens([]);

      if (!isAppendableAction(action)) {
        setInputTokens([]);
      } else if (result !== undefined) {
        setInputTokens(tokenizeNumber(result));
      }
    }

    setInputTokens(tokens => process(tokens, action));
    vibrate();
  };

  createEffect(() => {
    setInput(toString(inputTokens()));
  });

  createEffect(() => {
    try {
      const tokens = outputTokens();

      if (tokens.length > 0) {
        const result = evaluate(parse(tokens, !isDegrees()));

        if (Number.isNaN(result)) {
          setError('Not a number');
          setOutput(undefined);
        } else {
          setOutput(result);
          setError(undefined);
        }
      } else {
        setOutput(undefined);
        setError(undefined);
      }
    } catch {
      setError('Invalid input');
      setOutput(undefined);
    }
  });

  const displayAriaLabel = () => {
    if (error() !== undefined) {
      return 'Error';
    } else if (output() !== undefined) {
      return 'Output';
    }
    return input().length > 0 ? 'Input' : 'Input empty';
  };

  const displayVariant = (): DisplayVariant => {
    if (error() !== undefined) {
      return 'error';
    } else if (output() !== undefined) {
      return 'output';
    }
    return 'input';
  };

  const isOrientationPortrait = createMediaQuery('(orientation: portrait)');

  return (
    <CalculatorExecuteActionContext.Provider value={processButton}>
      <div class={styles['container']}>
        <Display variant={displayVariant()} ariaLabel={displayAriaLabel()}>
          <Switch fallback={input()}>
            <Match when={error() !== undefined}>{error()}</Match>
            <Match when={output() !== undefined}>{output()}</Match>
          </Switch>
        </Display>
        <div class={styles['status-bar']}>
          <ExpandButton />
          <Show when={hasToggledDegrees()}>
            <Span role="headline" size="small">
              {isDegrees() ? 'DEG' : 'RAD'}
            </Span>
          </Show>
        </div>
        <div bool:data-expanded={isExpanded()} class={styles['buttons']}>
          <div class={styles['scientific-buttons']} aria-hidden={!isExpanded()} inert={!isExpanded()}>
            <Dynamic
              component={isOrientationPortrait() ? ScientificButtonsPortrait : ScientificButtonsLandscape}
              toggleInverted={isInverted()}
              toggleDegrees={isDegrees()}
              onClickInverted={() => setInverted(v => !v)}
              onClickDegrees={() => {
                setDegrees(v => !v);
                setToggledDegrees(true);
              }}
            />
          </div>
          <div class={styles['main-buttons']}>
            <Dynamic
              component={isOrientationPortrait() ? MainButtonsPortrait : MainButtonsLandscape}
              pressAC={pressAC}
              pressBackspace={pressBackspace}
              pressEquals={pressEquals}
            />
          </div>
        </div>
      </div>
    </CalculatorExecuteActionContext.Provider>
  );
};
