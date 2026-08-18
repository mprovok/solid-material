import { createSignal } from 'solid-js';
import { fn } from 'storybook/test';

import preview from '../../../.storybook/preview';
import { MaterialButton } from '../button/MaterialButton';
import { MaterialCard, MaterialCardBody } from '../card/MaterialCard';

import { MaterialSideSheet } from './MaterialSideSheet';

const getSideSheetChildren = () => (
  <MaterialCard variant="filled" size="medium">
    <MaterialCardBody>Side sheet</MaterialCardBody>
  </MaterialCard>
);

const meta = preview.meta({
  title: 'Components/MaterialSideSheet',
  component: MaterialSideSheet
});

export const Standard = meta.story({
  args: {
    open: true,
    variant: 'standard',
    title: 'Title',
    children: getSideSheetChildren()
  }
});

export const Divider = meta.story({
  args: {
    open: true,
    variant: 'standard',
    title: 'Title',
    divider: true,
    children: getSideSheetChildren()
  }
});

export const Actions = meta.story({
  args: {
    open: true,
    variant: 'standard',
    title: 'Title',
    actions: <MaterialButton variant="tonal">Action</MaterialButton>,
    children: getSideSheetChildren()
  }
});

export const Buttons = meta.story({
  args: {
    open: true,
    variant: 'standard',
    title: 'Title',
    onClickBack: fn(),
    onClickClose: fn(),
    children: getSideSheetChildren()
  }
});

export const Modal = meta.story({
  render: () => {
    const [isSideSheetOpen, setIsSideSheetOpen] = createSignal(false);

    const onCloseSideSheet = () => setIsSideSheetOpen(false);
    const onOpenSideSheet = () => setIsSideSheetOpen(true);

    return (
      <div>
        <MaterialButton variant="tonal" onClick={onOpenSideSheet}>
          Open modal side sheet
        </MaterialButton>
        <MaterialSideSheet
          open={isSideSheetOpen()}
          variant="modal"
          title="Title"
          actions={<MaterialButton variant="tonal">Action</MaterialButton>}
          onClickClose={onCloseSideSheet}
          onClose={onCloseSideSheet}
        >
          <MaterialCard variant="filled" size="medium">
            <MaterialCardBody>Side sheet</MaterialCardBody>
          </MaterialCard>
        </MaterialSideSheet>
      </div>
    );
  }
});
