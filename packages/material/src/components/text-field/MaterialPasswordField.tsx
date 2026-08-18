import type { VoidComponent } from 'solid-js';

import { createEffect, createSignal } from 'solid-js';

import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import type { MaterialTextFieldProps } from './MaterialTextField';

import { MaterialTextField } from './MaterialTextField';

import VisibilityIcon from '@solid-material/icons/400/outlined/visibility.svg';
import VisibilityOffIcon from '@solid-material/icons/400/outlined/visibility_off.svg';

export interface MaterialPasswordFieldProps extends Omit<
  MaterialTextFieldProps,
  'type' | 'multipleEmail' | 'rows' | 'columns' | 'step' | 'minimum' | 'maximum' | 'noSpinner'
> {
  visible?: boolean;
}

export const MaterialPasswordField: VoidComponent<MaterialPasswordFieldProps> = props => {
  const [isVisible, setVisible] = createSignal(props.visible ?? false);

  createEffect(() => {
    setVisible(props.visible ?? false);
  });

  const onClickToggleVisibility = () => {
    setVisible(visible => !visible);
  };

  return (
    <MaterialTextField type={isVisible() ? 'text' : 'password'} {...props}>
      <div slot="trailing-icon">
        <MaterialIconButton
          variant="text"
          icon={isVisible() ? <VisibilityOffIcon /> : <VisibilityIcon />}
          toggle={isVisible()}
          title={isVisible() ? 'Click to hide' : 'Click to show'}
          ariaLabel={isVisible() ? 'Click to hide' : 'Click to show'}
          onClick={onClickToggleVisibility}
        />
      </div>
    </MaterialTextField>
  );
};
