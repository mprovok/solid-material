import type { VoidComponent } from 'solid-js';

import { Show } from 'solid-js';

import { MaterialIconButton } from '../icon-button/MaterialIconButton';

import ArrowBackIcon from '@solidmaterial/icons/400/outlined/arrow_back.svg';
import ArrowBackIosNewIcon from '@solidmaterial/icons/400/outlined/arrow_back_ios_new.svg';

const isIOS = () => /iphone|ipad/iu.test(globalThis.navigator.userAgent);

export interface MaterialAppBarBackButtonProps {
  ariaLabel?: string;
  title?: string;
  onClick?: (event: PointerEvent) => void;
}

/**
 * Render a back button for an app bar
 *
 * Should be used in the `leadingButton` prop of the {@link MaterialAppBar}.
 */
export const MaterialAppBarBackButton: VoidComponent<MaterialAppBarBackButtonProps> = props => {
  return (
    <MaterialIconButton
      variant="text"
      icon={
        <Show when={isIOS()} fallback={<ArrowBackIcon />}>
          <ArrowBackIosNewIcon />
        </Show>
      }
      ariaLabel={props.ariaLabel}
      title={props.title}
      onClick={(event: PointerEvent) => props.onClick?.(event)}
    />
  );
};
