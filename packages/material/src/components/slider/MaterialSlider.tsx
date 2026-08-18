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
      attr:value={Array.isArray(props.value) ? undefined : props.value}
      bool:range={Array.isArray(props.value)}
      attr:value-start={Array.isArray(props.value) ? props.value[0] : undefined}
      attr:value-end={Array.isArray(props.value) ? props.value[1] : undefined}
      attr:value-label={props.labeled === true && !Array.isArray(props.label) ? props.label : undefined}
      attr:value-label-start={props.labeled === true && Array.isArray(props.label) ? props.label[0] : undefined}
      attr:value-label-end={props.labeled === true && Array.isArray(props.label) ? props.label[1] : undefined}
      attr:aria-label={Array.isArray(props.ariaLabel) ? undefined : props.ariaLabel}
      attr:aria-label-start={Array.isArray(props.ariaLabel) ? props.ariaLabel[0] : undefined}
      attr:aria-label-end={Array.isArray(props.ariaLabel) ? props.ariaLabel[1] : undefined}
      attr:aria-valuetext={Array.isArray(props.ariaValueText) ? undefined : props.ariaValueText}
      attr:aria-valuetext-start={Array.isArray(props.ariaValueText) ? props.ariaValueText[0] : undefined}
      attr:aria-valuetext-end={Array.isArray(props.ariaValueText) ? props.ariaValueText[1] : undefined}
      attr:min={props.scale?.[0]}
      attr:max={props.scale?.[1]}
      attr:step={props.step}
      bool:ticks={props.ticks}
      bool:labeled={props.labeled}
      bool:disabled={props.disabled}
      onChange={onChange}
    ></md-slider>
  );
};
