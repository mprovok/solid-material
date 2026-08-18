import type { Component } from 'solid-js';

import styles from './ColorRoles.module.css';

/**
 * A component which shows the color roles defined by Material 3 Expressive
 */
export const ColorRoles: Component = () => {
  return (
    <div class={styles['container']}>
      <div class={styles['color-roles']}>
        <div data-role="accent-colors">
          <div data-role="accent-color-primary">
            <span>Primary</span>
            <span>On Primary</span>
          </div>
          <div data-role="accent-color-secondary">
            <span>Secondary</span>
            <span>On Secondary</span>
          </div>
          <div data-role="accent-color-tertiary">
            <span>Tertiary</span>
            <span>On Tertiary</span>
          </div>

          <div data-role="accent-color-primary-container">
            <span>Primary Container</span>
            <span>On Primary Container</span>
          </div>
          <div data-role="accent-color-secondary-container">
            <span>Secondary Container</span>
            <span>On Secondary Container</span>
          </div>
          <div data-role="accent-color-tertiary-container">
            <span>Tertiary Container</span>
            <span>On Tertiary Container</span>
          </div>
        </div>

        <div data-role="accent-fixed">
          <div data-role="accent-color-primary-fixed">
            <div data-role="fixed">
              <span>Primary Fixed</span>
              <span>Primary Fixed Dim</span>
            </div>
            <span>On Primary Fixed</span>
            <span>On Primary Fixed Variant</span>
          </div>
          <div data-role="accent-color-secondary-fixed">
            <div data-role="fixed">
              <span>Secondary Fixed</span>
              <span>Secondary Fixed Dim</span>
            </div>
            <span>On Secondary Fixed</span>
            <span>On Secondary Fixed Variant</span>
          </div>
          <div data-role="accent-color-tertiary-fixed">
            <div data-role="fixed">
              <span>Tertiary Fixed</span>
              <span>Tertiary Fixed Dim</span>
            </div>
            <span>On Tertiary Fixed</span>
            <span>On Tertiary Fixed Variant</span>
          </div>
        </div>

        <div data-role="accent-colors-error">
          <div data-role="accent-color-error">
            <span>Error</span>
            <span>On Error</span>
          </div>
          <div data-role="accent-color-error-container">
            <span>Error Container</span>
            <span>On Error Container</span>
          </div>
        </div>

        <div data-role="surfaces">
          <div data-role="surface">
            <span>Surface Dim</span>
            <span>Surface</span>
            <span>Surface Bright</span>
          </div>
          <div data-role="surface-container">
            <span>Surface Container Lowest</span>
            <span>Surface Container Low</span>
            <span>Surface Container</span>
            <span>Surface Container High</span>
            <span>Surface Container Highest</span>
          </div>
          <div data-role="surface-variant">
            <span>On Surface</span>
            <div>
              <span>Surface Variant</span>
              <span>On Surface Variant</span>
            </div>
            <span>Outline</span>
            <span>Outline Variant</span>
          </div>
        </div>

        <div data-role="inverses-scrim">
          <div data-role="inverses">
            <span>Inverse Surface</span>
            <span>Inverse On Surface</span>
            <span>Inverse Primary</span>
          </div>
          <div data-role="scrim">
            <span>Scrim</span>
            <span>Shadow</span>
          </div>
        </div>
      </div>
    </div>
  );
};
