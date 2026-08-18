import type { JSX, VoidComponent } from 'solid-js';

import { createViewportObserver } from '@solid-primitives/intersection-observer';
import { Match, Show, Switch, createMemo, createSignal, onCleanup, onMount } from 'solid-js';

import { MaterialIconButton } from '../icon-button/MaterialIconButton';
import { H1, H2 } from '../typography/Typography';

import styles from './MaterialAppBar.module.css';

import ArrowBackIcon from '@solid-material/icons/400/outlined/arrow_back.svg';
import ArrowBackIosNewIcon from '@solid-material/icons/400/outlined/arrow_back_ios_new.svg';
import MenuIcon from '@solid-material/icons/400/outlined/menu.svg';

export type MaterialAppBarVariant = 'small' | 'medium' | 'large';

export type MaterialLeadingButtonType = 'back' | 'menu';

export interface MaterialAppBarProps {
  variant: MaterialAppBarVariant;
  title: string;
  subtitle?: string;
  center?: boolean;
  leadingButtonType?: MaterialLeadingButtonType;
  leadingButtonAriaLabel?: string;
  trailingButtons?: JSX.Element;
  onNavigate?: (event: PointerEvent) => void;
}

const isIOS = () => /iphone|ipad/iu.test(globalThis.navigator.userAgent);

export const MaterialAppBar: VoidComponent<MaterialAppBarProps> = props => {
  const [intersectionRatio, setIntersectionRatio] = createSignal(1);

  const onIntersectAppendix = (e: IntersectionObserverEntry) => {
    setIntersectionRatio(e.intersectionRatio);
  };

  // oxlint-disable-next-line no-unassigned-vars
  let refAppendix!: HTMLDivElement;

  const [add, { remove }] = createViewportObserver({
    scrollMargin: '-64px 0px 0px 0px',
    threshold: Array.from({ length: 101 }).map((_, i) => i * 0.01)
  });

  onMount(() => {
    if (refAppendix !== undefined) {
      add(refAppendix, onIntersectAppendix);
      onCleanup(() => remove(refAppendix));
    }
  });

  const isScrolling = () => intersectionRatio() < 0.9;
  const isElevated = () => intersectionRatio() < 0.4;

  const hasAppendixContent = () => props.variant !== 'small';

  const appBarTextOpacity = () => (hasAppendixContent() ? (0.4 - Math.min(0.4, intersectionRatio())) / 0.4 : 1);
  const appendixTextOpacity = () => (Math.max(0.5, intersectionRatio()) - 0.5) / 0.5;

  const leadingButtonType = createMemo(() => props.leadingButtonType ?? 'back');

  return (
    <>
      <sm-app-bar class={styles['app-bar']} bool:data-scrolling={isScrolling()} bool:data-elevated={isElevated()}>
        <md-elevation></md-elevation>
        <Show when={props.onNavigate !== undefined}>
          <div class={styles['back-button']}>
            <MaterialIconButton
              variant="text"
              icon={
                <Switch>
                  <Match when={leadingButtonType() === 'back'}>
                    <Show when={isIOS()} fallback={<ArrowBackIcon />}>
                      <ArrowBackIosNewIcon />
                    </Show>
                  </Match>
                  <Match when={leadingButtonType() === 'menu'}>
                    <MenuIcon />
                  </Match>
                </Switch>
              }
              ariaLabel={props.leadingButtonAriaLabel}
              onClick={(event: PointerEvent) => props.onNavigate?.(event)}
            />
          </div>
        </Show>
        <div
          class={styles['text']}
          classList={{ [styles['center']!]: props.center }}
          style={{ opacity: appBarTextOpacity() }}
        >
          <H1 role="title" size="large">
            {props.title}
          </H1>
          <H2 role="label" size="medium">
            {props.subtitle}
          </H2>
        </div>
        <Show when={props.trailingButtons !== undefined}>
          <div class={styles['trailing-buttons']}>{props.trailingButtons}</div>
        </Show>
      </sm-app-bar>
      <div class={styles['app-bar-background']}>
        <div class={styles['app-bar-background-inner']}></div>
      </div>
      <div ref={refAppendix} class={styles['appendix']}>
        <Show when={hasAppendixContent()}>
          <div
            class={styles['appendix-inner']}
            classList={{ [styles['center']!]: props.center }}
            data-variant={props.variant}
          >
            <div style={{ opacity: appendixTextOpacity() }}>
              <Switch>
                <Match when={props.variant === 'medium'}>
                  <H1 role="headline" size="medium">
                    {props.title}
                  </H1>
                  <H2 role="label" size="large">
                    {props.subtitle}
                  </H2>
                </Match>
                <Match when={props.variant === 'large'}>
                  <H1 role="display" size="small">
                    {props.title}
                  </H1>
                  <H2 role="title" size="medium">
                    {props.subtitle}
                  </H2>
                </Match>
              </Switch>
            </div>
          </div>
        </Show>
      </div>
    </>
  );
};
