import type { FlowComponent, JSX } from 'solid-js';

import { Show, createUniqueId, useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { MaterialFocusRing } from '../focus-ring/MaterialFocusRing';
import { MaterialRipple } from '../ripple/MaterialRipple';
import { Span } from '../typography/Typography';

import { MaterialListSelectableContext } from './MaterialList';

import styles from './MaterialListItem.module.css';

export type MaterialListItemAlignment = 'top' | 'center';

export interface MaterialListItemProps {
  overlineText?: JSX.Element;
  supportingText?: JSX.Element;
  trailingText?: JSX.Element;

  start?: JSX.Element;
  end?: JSX.Element;

  align?: MaterialListItemAlignment;

  selected?: boolean;
  disabled?: boolean;
  onClick?: (event: PointerEvent) => void;

  // Links
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  download?: string;
  transition?: string;

  ariaLabel?: string;
}

type MaterialListItemType = 'link' | 'button' | 'text';

const ELEMENTS: Record<MaterialListItemType, string> = {
  link: 'a',
  button: 'button',
  text: 'div'
};

export const MaterialListItem: FlowComponent<MaterialListItemProps> = props => {
  const getType = () => {
    if (props.href !== undefined) {
      return 'link';
    } else if (props.onClick) {
      return 'button';
    }
    return 'text';
  };

  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDivElement;

  const isInteractive = () => props.disabled !== true && getType() !== 'text';

  const isSelectable = useContext(MaterialListSelectableContext);

  const id = createUniqueId();

  return (
    <sm-list-element
      bool:data-selected={isSelectable && props.selected}
      bool:data-disabled={props.disabled}
      bool:data-interactive={isInteractive()}
      attr:data-align={props.align}
      role={isSelectable ? 'option' : 'listitem'}
      inert={props.disabled}
      aria-label={props.ariaLabel}
      attr:aria-labelledby={props.ariaLabel === undefined && props.children !== undefined ? id : undefined}
      aria-selected={isSelectable ? props.selected : undefined}
      class={styles['item']}
    >
      <Dynamic
        component={ELEMENTS[getType()]}
        bool:disabled={props.disabled}
        attr:tabindex={isInteractive() ? 0 : -1}
        attr:type={getType() === 'button' ? 'button' : undefined}
        attr:href={props.href}
        attr:target={props.target}
        download={props.download}
        state={props.transition !== undefined ? JSON.stringify({ transition: props.transition }) : undefined}
        class={styles['content']}
        ref={ref}
        onClick={(event: PointerEvent) => props.onClick?.(event)}
      >
        <MaterialFocusRing attachTo={ref} inward />
        <Show when={isInteractive()}>
          <MaterialRipple attachTo={ref} disabled={props.disabled} />
        </Show>
        <Show when={props.start}>
          <div slot="start">{props.start}</div>
        </Show>
        <Show
          when={props.children !== undefined || props.overlineText !== undefined || props.supportingText !== undefined}
        >
          <div class={styles['text']}>
            <Show when={props.overlineText}>
              <Span role="label" size="small" class={styles['overline']}>
                {props.overlineText}
              </Span>
            </Show>
            <Span role="body" size="large" id={id} class={styles['label']}>
              {props.children}
            </Span>
            <Show when={props.supportingText}>
              <Span role="body" size="medium" class={styles['supporting-text']}>
                {props.supportingText}
              </Span>
            </Show>
          </div>
        </Show>
        <Show when={props.trailingText}>
          <Span role="label" size="small" class={styles['trailing-supporting-text']}>
            {props.trailingText}
          </Span>
        </Show>
        <Show when={props.end}>
          <div slot="end">{props.end}</div>
        </Show>
      </Dynamic>
    </sm-list-element>
  );
};
