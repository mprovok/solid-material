# @solidmaterial/material

## 1.3.0

### Minor Changes

- Add separate components for leading buttons in app bar

### Patch Changes

- Fix the toolbar to appear fully above the navigation bar

- Prevent canceling dragging spacer after double-click

- Reduce gap between snackbar and navigation bar

- Avoid capturing clicks just below the toolbar and navigation bar

- Move spacer to correct snap width when using keyboard

- Avoid layout shift when toolbar enters/exits the viewport

- Fix computing width and position of spacer near edges of fixed-flexible layout

- Ignore long-press on buttons

- Remove extra padding on left side of FAB with no icon

- Fix modal hidden navigation rail blinking when navigating to a page

- Avoid blinking snackbar when navigating to another page

## 1.2.0

### Minor Changes

- MaterialTheme no longer uses meta theme-color

### Patch Changes

- Fix navigation in browsers not supporting the View Transition API

- Add missing aria-value to drag handle of bottom sheet

## 1.1.1

### Patch Changes

- Fix top-level transition from list-detail layout

- Apply transition to content of detail pane, not the pane itself

## 1.1.0

### Minor Changes

- Support specifying view transition for list items

- Support specifying view transition for anchor buttons

### Patch Changes

- Reverse the direction of forward/backward transition for RTL languages

- Apply transition to just the detail pane of a list-detail layout

- Slightly reduce duration of forward/backward transition

- Fix clicking and dragging drag handle on mobile

- Handle dynamic viewport height on mobile

## 1.0.2

### Patch Changes

- Fix rendering of MaterialCard

## 1.0.1

### Patch Changes

- Fix repository.url in package.json files

- Updated dependencies:
  - @solidmaterial/icons@1.0.1
  - @solidmaterial/vite-plugin-solid-svg@1.0.1

## 1.0.0

### Major Changes

- Initial release
