import '@material/web/menu/menu-item.js';
import type { FlowComponent } from 'solid-js';

export interface MaterialMenuItemProps {
  selected?: boolean;
  disabled?: boolean;
  keepOpen?: boolean;

  ariaLabel?: string;
  onClick?: (event: PointerEvent | KeyboardEvent) => void;

  // Links
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

export const MaterialMenuItem: FlowComponent<MaterialMenuItemProps> = props => {
  const onClick = (event: PointerEvent) => {
    props.onClick?.(event);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const { key } = event;

    if (key === 'Enter' || key === ' ') {
      props.onClick?.(event);
    }
  };

  return (
    <md-menu-item
      keep-open={props.keepOpen}
      disabled={props.disabled}
      selected={props.selected}
      href={props.href}
      target={props.target}
      aria-label={props.ariaLabel}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {props.children}
    </md-menu-item>
  );
};
