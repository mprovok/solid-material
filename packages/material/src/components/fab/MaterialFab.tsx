import type { JSX, ParentComponent } from 'solid-js';

import { Show, children } from 'solid-js';

import type { MaterialButtonShape } from '../button/MaterialButton';
import type { TypographyRole, TypographySize } from '../typography/Typography';

import { Transition } from '../../utils/transitions';
import { MaterialButton } from '../button/MaterialButton';
import { MaterialPlainTooltip } from '../tooltip/MaterialPlainTooltip';
import { MaterialTooltip } from '../tooltip/MaterialTooltip';
import { Span } from '../typography/Typography';

import styles from './MaterialFab.module.css';

export type MaterialFabColor =
  | 'primary-container'
  | 'secondary-container'
  | 'tertiary-container'
  | 'primary'
  | 'secondary'
  | 'tertiary';

export type MaterialFabSize = 'small' | 'medium' | 'large';

export interface MaterialFabProps {
  color?: MaterialFabColor;
  size?: MaterialFabSize;

  icon?: JSX.Element;

  title?: string;
  ariaLabel?: string;

  /**
   * Set to true if the FAB will never ever get a label (turn into an extended FAB)
   *
   * It guarantees that the icon stays centered while the icon-only FAB
   * changes its size during an animation.
   */
  iconOnly?: boolean;

  /**
   * @private Only to be used by the `MaterialFabMenu` component
   */
  ariaExpanded?: boolean;

  /**
   * @private Only to be used by the `MaterialFabMenu` component
   **/
  shape?: MaterialButtonShape;

  onClick?: (event: PointerEvent) => void;
}

const LABEL_ROLE: Record<MaterialFabSize, TypographyRole> = {
  small: 'title',
  medium: 'title',
  large: 'headline'
};

const LABEL_SIZE: Record<MaterialFabSize, TypographySize> = {
  small: 'medium',
  medium: 'large',
  large: 'small'
};

export const MaterialFab: ParentComponent<MaterialFabProps> = props => {
  const size = () => props.size ?? 'small';
  const label = children(() => props.children);

  return (
    <sm-fab
      attr:data-color={props.color ?? 'primary-container'}
      attr:data-size={size()}
      bool:data-extended={label() !== undefined}
      bool:data-icon-only={props.iconOnly}
      class={styles['fab']}
    >
      <MaterialTooltip
        variant="plain"
        tooltip={props.title !== undefined ? <MaterialPlainTooltip>{props.title}</MaterialPlainTooltip> : undefined}
      >
        <MaterialButton
          variant="tonal"
          size="medium"
          shape={props.shape ?? 'square'}
          icon={props.icon}
          ariaLabel={props.ariaLabel ?? props.title}
          ariaExpanded={props.ariaExpanded}
          onClick={(event: PointerEvent) => props.onClick?.(event)}
        >
          <div class={styles['trailing']}>
            <Transition>
              <Show when={label()}>
                <span class={styles['label']}>
                  <Show when={typeof label() === 'string'} fallback={label()}>
                    <Span role={LABEL_ROLE[size()]} size={LABEL_SIZE[size()]}>
                      {label()}
                    </Span>
                  </Show>
                </span>
              </Show>
            </Transition>
          </div>
        </MaterialButton>
      </MaterialTooltip>
    </sm-fab>
  );
};
