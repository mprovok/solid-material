import type { ValidComponent, VoidComponent } from 'solid-js';

import { useNavigate } from '@solidjs/router';

import type { ListItemType } from '../../components/list/List';

import { List } from '../../components/list/List';
import { CalculatorExampleItem } from '../../examples/calculator/Calculator';
import { TodoListExampleItem } from '../../examples/todo-list/TodoList';

export type ExampleListItemType = ListItemType & { component: ValidComponent };

export const ITEMS: ExampleListItemType[] = [TodoListExampleItem, CalculatorExampleItem];

export interface ExampleListProps {
  name: string | undefined;
}

export const ExampleList: VoidComponent<ExampleListProps> = props => {
  const navigate = useNavigate();

  const onClick = (name: string) => navigate(`/examples/${name}`);

  return <List items={ITEMS} name={props.name} onClick={onClick} />;
};
