import '@material/web/slider/slider.js';
import type { VoidComponent } from 'solid-js';

export interface MaterialSliderProps {
  value: number | [number, number];
  scale?: [number, number];
  step?: number;
  labeled?: boolean;

  // Show markers on the slider, only makes sense when step is defined
  ticks?: boolean;

  // Label shown if labeled is true
  label?: string | [string, string];

  ariaLabel?: string | [string, string];
  ariaValueText?: string | [string, string];

  disabled?: boolean;
  onChange?: (values: number[]) => void;
}

const hasShadowRoot = (target: EventTarget): target is Element => {
  return 'shadowRoot' in target;
};

export const MaterialSlider: VoidComponent<MaterialSliderProps> = props => {
  const onChange = (event: Event) => {
    if (event.target !== null && hasShadowRoot(event.target)) {
      const values: number[] = [];

      const inputs = event.target.shadowRoot?.querySelectorAll('input');
      if (inputs !== undefined) {
        for (const input of inputs) {
          values.push(Number(input.value));
        }
      }

      props.onChange?.(values);
    }
  };

  return (
    <md-slider
      value={Array.isArray(props.value) ? undefined : props.value}
      range={Array.isArray(props.value)}
      value-start={Array.isArray(props.value) ? props.value[0] : undefined}
      value-end={Array.isArray(props.value) ? props.value[1] : undefined}
      value-label={props.labeled === true && !Array.isArray(props.label) ? props.label : undefined}
      value-label-start={props.labeled === true && Array.isArray(props.label) ? props.label[0] : undefined}
      value-label-end={props.labeled === true && Array.isArray(props.label) ? props.label[1] : undefined}
      aria-label={Array.isArray(props.ariaLabel) ? undefined : props.ariaLabel}
      // oxlint-disable-next-line jsx-a11y/aria-props
      aria-label-start={Array.isArray(props.ariaLabel) ? props.ariaLabel[0] : undefined}
      // oxlint-disable-next-line jsx-a11y/aria-props
      aria-label-end={Array.isArray(props.ariaLabel) ? props.ariaLabel[1] : undefined}
      aria-valuetext={Array.isArray(props.ariaValueText) ? undefined : props.ariaValueText}
      // oxlint-disable-next-line jsx-a11y/aria-props
      aria-valuetext-start={Array.isArray(props.ariaValueText) ? props.ariaValueText[0] : undefined}
      // oxlint-disable-next-line jsx-a11y/aria-props
      aria-valuetext-end={Array.isArray(props.ariaValueText) ? props.ariaValueText[1] : undefined}
      min={props.scale?.[0]}
      max={props.scale?.[1]}
      step={props.step}
      ticks={props.ticks}
      labeled={props.labeled}
      disabled={props.disabled}
      onChange={onChange}
    ></md-slider>
  );
};
