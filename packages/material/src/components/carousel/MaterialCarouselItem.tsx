import type { FlowComponent } from 'solid-js';

import { MaterialFocusRing } from '../focus-ring/MaterialFocusRing';
import { MaterialRipple } from '../ripple/MaterialRipple';

import { MaterialCarouselItemHolder } from './MaterialCarouselItemHolder';

import styles from './MaterialCarouselItem.module.css';

export interface MaterialCarouselItemProps {
  disabled?: boolean;
  ariaLabel?: string;
  onClick: (event: PointerEvent) => void;
}

export const MaterialCarouselItem: FlowComponent<MaterialCarouselItemProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLDivElement;

  // Prevent dragging of just this item instead of scrolling through whole carousel
  // (especially needed in Firefox, WebKit browsers can handle this in CSS)
  const onDragStart = (event: Event) => event.preventDefault();

  return (
    <MaterialCarouselItemHolder>
      <sm-carousel-item
        ref={ref}
        attr:tabindex={props.disabled === true ? -1 : 0}
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
        role="listitem"
        aria-label={props.ariaLabel}
        bool:data-disabled={props.disabled}
        class={styles['item']}
        onClick={(event: PointerEvent) => props.onClick(event)}
      >
        <MaterialFocusRing attachTo={ref} />
        <MaterialRipple attachTo={ref} disabled={props.disabled} />
        <md-elevation></md-elevation>
        <div class={styles['content']} onDragStart={onDragStart}>
          {props.children}
        </div>
      </sm-carousel-item>
    </MaterialCarouselItemHolder>
  );
};
