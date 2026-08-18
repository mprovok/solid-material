import type { Accessor } from 'solid-js';

export const mod = (a: number, b: number): number => a - Math.floor(a / b) * b;

export const isEnabledButtonElement = (target: EventTarget): target is HTMLButtonElement =>
  target instanceof HTMLButtonElement && !target.disabled;

export const isFocusableElement = (target: EventTarget): target is HTMLElement =>
  target instanceof HTMLElement && target.tabIndex >= 0;

export const clickElement = (_index: number, element: HTMLElement): void => element.click();

export const focusElement = (element?: HTMLOrSVGElement): void => element?.focus();

// oxlint-disable-next-line max-params
export const createOnKeyDown = (
  role: Accessor<string>,
  nextKeys: Accessor<string[]>,
  prevKeys: Accessor<string[]>,
  isEnabledElement: (target: EventTarget) => target is HTMLElement,
  refList: Accessor<HTMLElement>,
  setActiveElement: (index: number, element: HTMLElement) => void,
  setFocus: (element?: HTMLOrSVGElement) => void = focusElement,
  onKeyPress?: (key: string, items: HTMLElement[]) => void
): ((event: KeyboardEvent) => void) => {
  return (event: KeyboardEvent) => {
    const items = [...refList().querySelectorAll(`[role="${role()}"]`)];
    const { key } = event;

    if (key === 'Enter' || key === ' ') {
      const index = items.findIndex(item => item.matches(':focus-within'));
      const element = items[index];

      if (element !== undefined && isEnabledElement(element)) {
        setActiveElement(index, element);
      }
    } else {
      const enabledItems = items.filter(isEnabledElement);
      const focusedIndex = enabledItems.findIndex(item => item.matches(':focus-within'));

      if (key === 'Home') {
        setFocus(enabledItems[0]);
        event.preventDefault();
      } else if (key === 'End') {
        setFocus(enabledItems.at(-1));
        event.preventDefault();
      } else if (nextKeys().includes(key)) {
        const nextIndex = mod(focusedIndex + 1, enabledItems.length);
        setFocus(enabledItems[nextIndex]);
        event.preventDefault();
      } else if (prevKeys().includes(key)) {
        const prevIndex = mod(focusedIndex - 1, enabledItems.length);
        setFocus(enabledItems[prevIndex]);
        event.preventDefault();
      } else {
        onKeyPress?.(key, enabledItems);
      }
    }
  };
};
