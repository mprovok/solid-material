import type { MdTabs } from '@material/web/tabs/tabs';

import '@material/web/tabs/tabs.js';
import type { Accessor, JSX, VoidComponent } from 'solid-js';

import { Index, Show, createEffect, createSignal, createUniqueId } from 'solid-js';

import type { MaterialTabVariant } from './MaterialTab';

import { MaterialTab } from './MaterialTab';

export type MaterialTabsAlignment = 'start' | 'stretch';

export type MaterialTabType = {
  label?: JSX.Element;
  icon?: JSX.Element;
  ariaLabel?: string;
  panel: Accessor<JSX.Element>;
};

export interface MaterialTabsProps {
  variant: MaterialTabVariant;
  tabs: MaterialTabType[];
  activeTabIndex?: number;

  alignment?: MaterialTabsAlignment;
  ariaLabel?: string;
  inlineIcons?: boolean;
  autoActivate?: boolean;

  onChange?: (index: number) => void;
}

const isMdTabsTarget = (target: EventTarget): target is MdTabs => {
  return 'activeTabIndex' in target;
};

export const MaterialTabs: VoidComponent<MaterialTabsProps> = props => {
  const [activeTabIndex, setActiveTabIndex] = createSignal(props.activeTabIndex ?? 0);

  createEffect(() => {
    setActiveTabIndex(props.activeTabIndex ?? 0);
  });

  const id = createUniqueId();

  const onChange = (event: Event) => {
    if (event.target !== null && isMdTabsTarget(event.target)) {
      setActiveTabIndex(event.target.activeTabIndex);
      props.onChange?.(event.target.activeTabIndex);
    }
  };

  const getTabId = (index: number) => `${id}-tab-${index}`;
  const getPanelId = (index: number) => `${id}-panel-${index}`;

  return (
    <div>
      <md-tabs
        bool:auto-activate={props.autoActivate}
        attr:active-tab-index={activeTabIndex()}
        attr:aria-label={props.ariaLabel}
        onChange={onChange}
      >
        <Index each={props.tabs}>
          {(tab, index) => (
            <MaterialTab
              variant={props.variant}
              icon={tab().icon}
              inlineIcon={props.inlineIcons}
              ariaLabel={tab().ariaLabel}
              ariaControls={getPanelId(index)}
              id={getTabId(index)}
            >
              {tab().label}
            </MaterialTab>
          )}
        </Index>
        <Show when={props.alignment === 'start'}>
          <div style={{ flex: '100%' }}></div>
        </Show>
      </md-tabs>
      <Index each={props.tabs}>
        {(tab, index) => (
          <div
            role="tabpanel"
            id={getPanelId(index)}
            aria-labelledby={getTabId(index)}
            hidden={index !== activeTabIndex()}
          >
            <Show when={index === activeTabIndex()}>{tab().panel()}</Show>
          </div>
        )}
      </Index>
    </div>
  );
};
