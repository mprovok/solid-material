import type { MaterialButtonShape } from '@solid-material/material/components/button';
import type { VoidComponent } from 'solid-js';

import { MaterialIconButton } from '@solid-material/material/components/icon-button';
import { createEffect, createSignal } from 'solid-js';

import styles from './ColorButton.module.css';

export interface ColorButtonProps {
  color: string;
  shape?: MaterialButtonShape;
  ariaLabel?: string;
  changable?: boolean;
  onChange?: (value: string) => void;
}

export const ColorButton: VoidComponent<ColorButtonProps> = props => {
  // oxlint-disable-next-line no-unassigned-vars
  let ref!: HTMLInputElement;

  const [color, setColor] = createSignal(props.color);

  createEffect(() => {
    setColor(props.color);
  });

  const onInput = (event: InputEvent) => {
    if (event.target instanceof HTMLInputElement) {
      setColor(event.target.value);
      props.onChange?.(event.target.value);
    }
  };

  const onChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      setColor(event.target.value);
      props.onChange?.(event.target.value);
    }
  };

  const onClick = () => {
    props.onChange?.(color());
    if (props.changable !== false) {
      ref.click();
    }
  };

  return (
    <div class={styles['container']} style={{ '--md-comp-button-filled-container-color': color() }}>
      <input
        ref={ref}
        type="color"
        aria-hidden="true"
        tabindex={-1}
        value={color()}
        onInput={onInput}
        onChange={onChange}
      />
      <MaterialIconButton
        variant="filled"
        icon={<svg />}
        shape={props.shape}
        ariaLabel={props.ariaLabel}
        onClick={onClick}
      />
    </div>
  );
};
