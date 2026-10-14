import type { VoidComponent } from 'solid-js';

import { H1 } from '@solidmaterial/material/components/typography';

import styles from './Logo.module.css';

/**
 * Renders the logo of Solid Material
 *
 * In Chrome Devtools, right click on the element and then choose "Capture node screenshot"
 * to export it to a PNG file.
 *
 * 1. Open the PNG file in Inkscape
 * 2. Select the image with the select tool (S) and then choose Path > Trace Bitmap...
 * 3. On tab Multicolor:
 *     - Detection mode: Colors
 *     - Enable "Remove background"
 *     - Speckles: 1000
 *     - Smooth corners: 1.0
 *     - Optimize: 0.0
 * 4. Delete the image element and save it to an SVG file
 * 5. Edit the SVG file, add fill and stroke attributes and clean up the XML
 */
export const Logo: VoidComponent = () => {
  return (
    <div class={styles['container']}>
      <div class={styles['logo']} />
      <H1 role="display" size="large">
        Solid Material
      </H1>
    </div>
  );
};
