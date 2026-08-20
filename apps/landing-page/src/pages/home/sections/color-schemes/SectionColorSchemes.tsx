import type { VoidComponent } from 'solid-js';

import { MaterialCard } from '@solidmaterial/material/components/card';
import { MaterialSelect } from '@solidmaterial/material/components/select';
import { H2, H3, Span } from '@solidmaterial/material/components/typography';
import { ColorRoles, DEFAULT_MATERIAL_THEME_COLOR, isThemeVariant } from '@solidmaterial/material/styling';
import { useContext } from 'solid-js';

import { Info } from '../../../../components/info/Info';
import { UnorderedList } from '../../../../components/unordered-list/UnorderedList';
import { ColorContext, ThemeVariantContext } from '../../../../contexts';
import { ColorButton } from '../../components/ColorButton';

import styles from './SectionColorSchemes.module.css';

export const SectionColorSchemes: VoidComponent = () => {
  const [color, setColor] = useContext(ColorContext);
  const [theme, setTheme] = useContext(ThemeVariantContext);

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const initialThemeColor = metaThemeColor?.getAttribute('content') ?? DEFAULT_MATERIAL_THEME_COLOR;

  const onChange = (_event: Event, value: string, _name: string | undefined) => {
    if (value === 'baseline') {
      setTheme(undefined);
    } else if (isThemeVariant(value)) {
      setTheme(value);
    }
  };

  return (
    <section>
      <div>
        <H2 role="display" size="small">
          Color schemes
        </H2>
        <Span role="body" size="large">
          <UnorderedList>
            <li>
              <H3 role="title" size="large">
                Baseline and dynamic color schemes
              </H3>
              <p>
                Use the <code>MaterialTheme</code> component for the baseline or a dynamic theme in which all colors are
                generated from a single source color, which is either the optional <code>color</code> prop or else the{' '}
                <code>content</code> attribute from the <code>&#60;meta name="theme-color"&#62;</code> element.
              </p>
              <p>You can change the source color and theme variant used on this page right here:</p>
              <div class={styles['theme-controls']}>
                <Span role="body" size="large">
                  Color:
                </Span>
                <ColorButton color={color() ?? initialThemeColor} shape="square" onChange={setColor} />
                <Span role="body" size="large">
                  Theme:
                </Span>
                <MaterialSelect
                  variant="filled"
                  name="theme"
                  options={[
                    { label: 'Undefined (baseline)', value: 'baseline' },
                    { label: 'Monochrome', value: 'monochrome' },
                    { label: 'Neutral', value: 'neutral' },
                    { label: 'Tonal spot', value: 'tonal-spot' },
                    { label: 'Vibrant', value: 'vibrant' },
                    { label: 'Expressive', value: 'expressive' },
                    { label: 'Fidelity', value: 'fidelity' },
                    { label: 'Content', value: 'content' }
                  ]}
                  label="Theme"
                  value={theme()}
                  onChange={onChange}
                />
              </div>
              <p>
                <Info>You can reset the color in the settings toolbar in the top-right corner</Info>
              </p>
            </li>
            <li>
              <H3 role="title" size="large">
                Static palette color tokens for 11 colors
              </H3>
            </li>
          </UnorderedList>
        </Span>
      </div>
      <MaterialCard variant="filled" size="extra-large">
        <div class={styles['color-roles']}>
          <ColorRoles />
        </div>
      </MaterialCard>
    </section>
  );
};
