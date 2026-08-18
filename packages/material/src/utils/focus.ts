type DOMNode =
  | {
      node: Element;
      visited: false;
    }
  | {
      node: HTMLElement | SVGElement;
      visited: true;
    };

const isFocusable = (element: HTMLElement | SVGElement) => {
  // Check if element participates in tabbing order
  if (element.tabIndex < 0) {
    return false;
  }

  // Check if element is enabled if it's a form control
  if ('disabled' in element && element.disabled === true) {
    return false;
  }

  if (element instanceof HTMLLinkElement && element.href === '') {
    return false;
  }

  return true;
};

/**
 * Return the deepest focusable descendant (which is a visible HTML or
 * SVG element) of the given element in tabbing order, or the given element
 * itself if it has no focusable descendent
 *
 * A depth-first search is used to find a focusable element in the DOM subtree.
 * Shadow roots are searched as well.
 */
const findDeepestFocusableDescendant = (root: Element, ltr: boolean) => {
  const stack: DOMNode[] = [{ node: root, visited: false }];

  const getChildren = (parent: ParentNode): Element[] => {
    const children = [...parent.children];
    return ltr ? children.toReversed() : children;
  };

  const pushChildrenOfShadowRootOf = (node: Element) => {
    if (node.shadowRoot) {
      for (const child of getChildren(node.shadowRoot)) {
        stack.push({ node: child, visited: false });
      }
    }
  };

  pushChildrenOfShadowRootOf(root);

  while (stack.length > 0) {
    const { node, visited } = stack.pop()!;

    if (!visited) {
      // Traverse DOM subtree if element is a visible HTML or an SVG element
      if (
        (node instanceof HTMLElement || node instanceof SVGElement) &&
        node.checkVisibility({ visibilityProperty: true })
      ) {
        stack.push({ node, visited: true });

        for (const child of getChildren(node)) {
          stack.push({ node: child, visited: false });
          pushChildrenOfShadowRootOf(child);
        }
      }
    } else if (isFocusable(node)) {
      return node;
    }
  }

  return root;
};

/**
 * Return the deepest focusable element of a sibling of the `element`, the sibling itself, or the parent of the `element`
 *
 * @param element The starting element which is assumed to have currently focus
 * @param next Find the next focusable element in the tabbing order, otherwise the previous
 */
const findNextOrPreviousFocusableElement = (element: Element, next: boolean): Element | null => {
  const sibling = next ? element.nextElementSibling : element.previousElementSibling;

  if (sibling) {
    return findDeepestFocusableDescendant(sibling, next);
  }

  const parent = element.parentElement;

  // Skip any shadow root element and just return its immediate parent (the custom element of the Web Component)
  return parent instanceof ShadowRoot ? parent.host : parent;
};

/**
 * Return the previous or next focusable element relative to the given element, or null if no focusable element was found
 *
 * @param element The currently focused Element
 * @param next Find the next focusable element in the tabbing order, otherwise the previous
 * @returns HTMLElement or SVGElement which is focusable, or undefined
 */
export const getPreviousOrNextFocusableElement = (
  element: Element,
  next: boolean
): HTMLElement | SVGElement | undefined => {
  let node: Element | null = element;

  while ((node = findNextOrPreviousFocusableElement(node, next))) {
    if ((node instanceof HTMLElement || node instanceof SVGElement) && isFocusable(node)) {
      return node;
    }
  }

  return undefined;
};
