export type DragHandlePosition = {
  value: number;
  maximum: number;
  snapWidths: number[];
  percentage: number;
};

export interface MaterialBodyLayoutWithDragHandleProps {
  showDragHandle?: boolean;
  dragHandleAriaLabel?: string;
  dragHandleAriaValue?: (position: DragHandlePosition) => string;
  onMoveSpacer?: (position: number, range: [number, number]) => void;
  onDragSpacer?: (isDragging: boolean) => void;
}
