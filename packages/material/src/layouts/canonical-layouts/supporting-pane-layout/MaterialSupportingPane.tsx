import type { FlowComponent } from 'solid-js';

import { Match, Show, Switch, createSignal } from 'solid-js';

import { MaterialBottomSheet } from '../../../components/bottom-sheet';
import { MaterialSideSheet } from '../../../components/side-sheet/MaterialSideSheet';
import { Breakpoints } from '../../../utils';
import { MaterialPane } from '../../pane/MaterialPane';

export type MaterialSupportingPaneContainerVariant = 'standard' | 'modal';

export interface MaterialSupportingPaneProps {
  variant: MaterialSupportingPaneContainerVariant;
  title?: string;
  dragHandle?: boolean;
  dragHandleAriaLabel?: string;
  open?: boolean;
  onClose?: () => void;
}

export const MaterialSupportingPane: FlowComponent<MaterialSupportingPaneProps> = props => {
  const isMobile = () => Breakpoints.isCompactWidth() || Breakpoints.isMediumWidth();

  const [isOpen, setOpen] = createSignal(() => props.open ?? true);

  return (
    <MaterialPane>
      <Switch>
        <Match when={isMobile()}>
          <Show when={props.variant === 'modal'} fallback={<aside bool:data-open={isOpen()}>{props.children}</aside>}>
            <MaterialBottomSheet
              variant="modal"
              dragHandle={props.dragHandle}
              dragHandleAriaLabel={props.dragHandleAriaLabel}
              open={isOpen()}
              onClose={() => props.onClose?.()}
            >
              {props.children}
            </MaterialBottomSheet>
          </Show>
        </Match>
        <Match when={!isMobile()}>
          <MaterialSideSheet
            open={isOpen()}
            variant={props.variant}
            title={props.title}
            onClickClose={props.onClose !== undefined || props.variant === 'modal' ? () => setOpen(false) : undefined}
            onClose={() => props.onClose?.()}
          >
            {props.children}
          </MaterialSideSheet>
        </Match>
      </Switch>
    </MaterialPane>
  );
};
