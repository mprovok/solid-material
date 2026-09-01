import type { MdTabs } from '@material/web/tabs/tabs';

import '@material/web/tabs/tabs.js';
import type { JSX } from '@solidjs/web';
import type { Accessor, VoidComponent } from 'solid-js';

import { For, Show, createSignal, createUniqueId } from 'solid-js';

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
  const [activeTabIndex, setActiveTabIndex] = createSignal(() => props.activeTabIndex ?? 0);

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
        auto-activate={props.autoActivate}
        active-tab-index={activeTabIndex()}
        aria-label={props.ariaLabel}
        onChange={onChange}
      >
        <For each={props.tabs} keyed={false}>
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
        </For>
        <Show when={props.alignment === 'start'}>
          <div style={{ flex: '100%' }}></div>
        </Show>
      </md-tabs>
      <For each={props.tabs} keyed={false}>
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
      </For>
    </div>
  );
};
