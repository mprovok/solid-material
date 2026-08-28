import type { JSX, VoidComponent } from 'solid-js';

import { MaterialButton } from '@solidmaterial/material/components/button';
import { MaterialButtonGroup } from '@solidmaterial/material/components/button-group';
import { MaterialIcon } from '@solidmaterial/material/components/icon';
import { MaterialIconButton } from '@solidmaterial/material/components/icon-button';
import { Span } from '@solidmaterial/material/components/typography';
import { Breakpoints } from '@solidmaterial/material/utils';
import { For, Match, Show, Switch, createEffect, createMemo, createSignal, useContext } from 'solid-js';

import { ExpandContext, VibrateContext } from '../contexts';

import type { Token } from './tokenizer/types';

import {
  BUTTON_PRESS_VIBRATE_MS,
  CalculatorAction,
  CalculatorExecuteActionContext,
  ICON_SIZE,
  SIZE
} from './Calculator.types';
import { CalculatorButton } from './CalculatorButton';
import { evaluate } from './evaluate/evaluate';
import { FixedWidthDigit } from './FixedWidthDigit';
import { parse } from './parser/parser';
import { Superscript } from './Superscript';
import { toString } from './tokenizer/stringifier';
import { backspace, balanceParentheses, process, tokenizeNumber } from './tokenizer/tokenizer';

import styles from './Calculator.module.css';

import BackspaceIcon from '@solidmaterial/icons/400/rounded/backspace.svg';
import CollapseAllIcon from '@solidmaterial/icons/400/rounded/collapse_all.svg';
import ExpandAllIcon from '@solidmaterial/icons/400/rounded/expand_all.svg';

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
  const [isExpanded, setExpanded] = useContext(ExpandContext);
  const [isVibrate, _] = useContext(VibrateContext);

  const [isInverted, setInverted] = createSignal(false);
  const [isDegrees, setDegrees] = createSignal(false);
  const [hasToggledDegrees, setToggledDegrees] = createSignal(false);

  const [inputTokens, setInputTokens] = createSignal<Token[]>([]);
  const [outputTokens, setOutputTokens] = createSignal<Token[]>([]);

  const [input, setInput] = createSignal<JSX.Element[]>([]);
  const [output, setOutput] = createSignal<number>();
  const [error, setError] = createSignal<string>();

  const isMobile = () => Breakpoints.isCompactWidth() || Breakpoints.isCompactHeight();

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

  const displayFontSize = createMemo(() => (isMobile() ? 'medium' : 'large'));

  return (
    <CalculatorExecuteActionContext.Provider value={processButton}>
      <main class={styles['main']}>
        <div class={styles['container']}>
          <output aria-label={displayAriaLabel()}>
            <Switch
              fallback={
                <Span role="display" size={displayFontSize()} class={styles['input']}>
                  <For each={input()}>{item => <>{item}</>}</For>
                </Span>
              }
            >
              <Match when={error() !== undefined}>
                <Span role="display" size={displayFontSize()} class={styles['error']}>
                  {error()}
                </Span>
              </Match>
              <Match when={output() !== undefined}>
                <Span role="display" size={displayFontSize()} class={styles['output']}>
                  {output()}
                </Span>
              </Match>
            </Switch>
          </output>
          <div class={styles['status-bar']}>
            <MaterialIconButton
              variant="text"
              size="small"
              icon={isExpanded() ? <CollapseAllIcon /> : <ExpandAllIcon />}
              title={isExpanded() ? 'Hide scientific buttons' : 'Show scientific buttons'}
              onClick={() => setExpanded(v => !v)}
            />
            <Show when={hasToggledDegrees()}>
              <Span role="headline" size="small">
                {isDegrees() ? 'DEG' : 'RAD'}
              </Span>
            </Show>
          </div>
          <div bool:data-expanded={isExpanded()} class={styles['buttons']}>
            <div class={styles['scientific-buttons']} aria-hidden={!isExpanded()} inert={!isExpanded()}>
              <MaterialButtonGroup variant="standard">
                <Switch>
                  <Match when={isInverted()}>
                    <CalculatorButton action={CalculatorAction.SQUARE} ariaLabel="Square">
                      <Superscript base="x" superscript="2" />
                    </CalculatorButton>
                  </Match>
                  <Match when={!isInverted()}>
                    <CalculatorButton action={CalculatorAction.SQRT}>√</CalculatorButton>
                  </Match>
                </Switch>
                <CalculatorButton action={CalculatorAction.PI}>π</CalculatorButton>
                <CalculatorButton action={CalculatorAction.OPERATOR_POWER} ariaLabel="Power">
                  ^
                </CalculatorButton>
                <CalculatorButton action={CalculatorAction.FACTORIAL} ariaLabel="Factorial">
                  !
                </CalculatorButton>
              </MaterialButtonGroup>
              <div class={styles['mode-button-row']}>
                <div>
                  <MaterialButton
                    variant="tonal"
                    size={SIZE}
                    toggle={isDegrees()}
                    ariaLabel="Degrees"
                    onClick={() => {
                      setDegrees(v => !v);
                      setToggledDegrees(true);
                    }}
                  >
                    <FixedWidthDigit>Deg</FixedWidthDigit>
                  </MaterialButton>
                </div>
                <div>
                  <MaterialButtonGroup variant="standard">
                    <Switch>
                      <Match when={isInverted()}>
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
                      <Match when={!isInverted()}>
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
                </div>
              </div>
              <div class={styles['mode-button-row']}>
                <div>
                  <MaterialButton
                    variant="tonal"
                    size={SIZE}
                    toggle={isInverted()}
                    ariaLabel="Invert scientific buttons"
                    onClick={() => setInverted(v => !v)}
                  >
                    <FixedWidthDigit>Inv</FixedWidthDigit>
                  </MaterialButton>
                </div>
                <div>
                  <MaterialButtonGroup variant="standard">
                    <CalculatorButton action={CalculatorAction.E} ariaLabel="Euler's number">
                      e
                    </CalculatorButton>
                    <Switch>
                      <Match when={isInverted()}>
                        <CalculatorButton action={CalculatorAction.EXP} ariaLabel="Euler's number raised to a power">
                          <Superscript base="e" superscript="x" />
                        </CalculatorButton>
                        <CalculatorButton action={CalculatorAction.TEN_POWER_X} ariaLabel="10 raised to a power">
                          <Superscript base="10" superscript="x" />
                        </CalculatorButton>
                      </Match>
                      <Match when={!isInverted()}>
                        <CalculatorButton action={CalculatorAction.LN} ariaLabel="Natural logarithm">
                          ln
                        </CalculatorButton>
                        <CalculatorButton action={CalculatorAction.LOG} ariaLabel="Base 10 logarithm">
                          log
                        </CalculatorButton>
                      </Match>
                    </Switch>
                  </MaterialButtonGroup>
                </div>
              </div>
            </div>
            <div class={styles['main-buttons']}>
              <MaterialButtonGroup variant="standard">
                <MaterialButton variant="tonal" size={SIZE} ariaLabel="Clear" onClick={pressAC}>
                  <FixedWidthDigit>AC</FixedWidthDigit>
                </MaterialButton>
                <CalculatorButton action={CalculatorAction.PARENTHESES} ariaLabel="Opening or closing parenthesis">
                  ( )
                </CalculatorButton>
                <CalculatorButton action={CalculatorAction.PERCENT}>%</CalculatorButton>
                <CalculatorButton action={CalculatorAction.OPERATOR_DIVIDE}>÷</CalculatorButton>
              </MaterialButtonGroup>
              <MaterialButtonGroup variant="standard">
                <CalculatorButton action={CalculatorAction.DIGIT_7}>7</CalculatorButton>
                <CalculatorButton action={CalculatorAction.DIGIT_8}>8</CalculatorButton>
                <CalculatorButton action={CalculatorAction.DIGIT_9}>9</CalculatorButton>
                <CalculatorButton action={CalculatorAction.OPERATOR_MULTIPLY}>×</CalculatorButton>
              </MaterialButtonGroup>
              <MaterialButtonGroup variant="standard">
                <CalculatorButton action={CalculatorAction.DIGIT_4}>4</CalculatorButton>
                <CalculatorButton action={CalculatorAction.DIGIT_5}>5</CalculatorButton>
                <CalculatorButton action={CalculatorAction.DIGIT_6}>6</CalculatorButton>
                <CalculatorButton action={CalculatorAction.OPERATOR_SUBTRACT}>−</CalculatorButton>
              </MaterialButtonGroup>
              <MaterialButtonGroup variant="standard">
                <CalculatorButton action={CalculatorAction.DIGIT_1}>1</CalculatorButton>
                <CalculatorButton action={CalculatorAction.DIGIT_2}>2</CalculatorButton>
                <CalculatorButton action={CalculatorAction.DIGIT_3}>3</CalculatorButton>
                <CalculatorButton action={CalculatorAction.OPERATOR_ADD}>+</CalculatorButton>
              </MaterialButtonGroup>
              <MaterialButtonGroup variant="standard">
                <CalculatorButton action={CalculatorAction.DIGIT_0}>0</CalculatorButton>
                <CalculatorButton action={CalculatorAction.DECIMAL_SEPARATOR} ariaLabel="Decimal separator">
                  ,
                </CalculatorButton>
                <MaterialButton variant="tonal" size={SIZE} ariaLabel="Backspace" onClick={pressBackspace}>
                  <MaterialIcon size={ICON_SIZE}>
                    <BackspaceIcon />
                  </MaterialIcon>
                </MaterialButton>
                <MaterialButton variant="tonal" size={SIZE} ariaLabel="Evaluate" onClick={pressEquals}>
                  <FixedWidthDigit>=</FixedWidthDigit>
                </MaterialButton>
              </MaterialButtonGroup>
            </div>
          </div>
        </div>
      </main>
    </CalculatorExecuteActionContext.Provider>
  );
};
