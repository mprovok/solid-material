# @solid-material/material

Solid Material is a component library implementing [Material 3 Expressive][url-m3] using [SolidJS][url-solid].

## Features

- Components implementing the M3 Expressive spec

- Layout components

- Theming
  - Baseline and dynamic color schemes based on a source color
  - Static palette color tokens for 11 colors

- Design tokens for easings and springs

- View transitions

## Components

The table below shows the implementation status of the [components][url-m3-components].
Some of the components are mere SolidJS wrappers around their respective web component
from [@material-web][url-material-web].

A few components are missing or have not been reimplemented yet in SolidJS following
the M3 Expressive spec. A few components like the skeleton loader are not found
in the list above, but are mentioned elsewhere on the Material 3 website.

Some components are not in the list below because they are deprecated according to the
Material 3 website and have suitable replacements:

- Segmented buttons (replaced by the connected button group)
- Navigation drawer (replaced by the extended navigation rail)

| Buttons                 | M3     | M3 Expressive     | Solid     |
| ----------------------- | ------ | ----------------- | --------- |
| Button groups           |        | ✅                | ✅        |
| Buttons                 | ❌     | ✅                | ✅        |
| FAB                     | ❌     | ✅                | ✅        |
| Extended FAB            | ❌     | ✅                | ✅        |
| FAB menu                |        | ✅                | ✅        |
| Icon buttons            | ❌     | ✅                | ✅        |
| Split buttons           |        | ✅                | ✅        |
| **Date & time pickers** | **M3** | **M3 Expressive** | **Solid** |
| Date pickers            | ❌     |                   |           |
| Time pickers            | ❌     |                   |           |
| **Loading & progress**  | **M3** | **M3 Expressive** | **Solid** |
| Loading indicator       |        | ❌                |           |
| Progress indicators     | ✅     | ❌                | ❌        |
| **Navigation**          | **M3** | **M3 Expressive** | **Solid** |
| Navigation bar          | ❌     | ✅                | ✅        |
| Navigation rail         | ❌     | ✅                | ✅        |
| **Sheets**              | **M3** | **M3 Expressive** | **Solid** |
| Bottom sheets           | ✅     |                   | ✅        |
| Side sheets             | ✅     |                   | ✅        |
| **Form controls**       | **M3** | **M3 Expressive** | **Solid** |
| Checkbox                | ✅     |                   | ❌        |
| Radio button            | ✅     |                   | ❌        |
| Select                  | ✅     |                   | ❌        |
| Sliders                 | ✅     | ❌                | ❌        |
| Switch                  | ✅     |                   | ❌        |
| Text fields             | ✅     |                   | ❌        |
| **Other components**    | **M3** | **M3 Expressive** | **Solid** |
| App bars (1)            | ❌     | ✅                | ✅        |
| Badges                  | ✅     |                   | ✅        |
| Cards                   | ✅     |                   | ✅        |
| Carousel                | ✅     |                   | ✅        |
| Chips                   | ✅     |                   | ❌        |
| Dialogs                 | ✅     |                   | ❌        |
| Divider                 | ✅     |                   | ❌        |
| Lists (2)               | ❌     | ✅                | ✅        |
| Menus                   | ✅     | ❌                | ❌        |
| Search                  | ❌     | ✅                | ✅        |
| Snackbar                | ✅     |                   | ✅        |
| Tabs                    | ✅     |                   | ❌        |
| Toolbars                |        | ✅                | ✅        |
| Tooltips                | ✅     |                   | ✅        |
| **Not listed**          | **M3** | **M3 Expressive** | **Solid** |
| Skeleton                |        |                   | ✅        |

- Note 1: No search variant for app bar yet.
- Note 2: No expand/collapse functionality yet.

## License

This package is licensed under the Apache 2.0 license.

[url-m3]: https://m3.material.io/
[url-solid]: https://www.solidjs.com/
[url-m3-components]: https://m3.material.io/components
[url-material-web]: https://material-web.dev
