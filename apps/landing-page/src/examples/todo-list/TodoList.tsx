import type { VoidComponent } from 'solid-js';

import { useNavigate } from '@solidjs/router';
import { MaterialAppBar } from '@solidmaterial/material/components/app-bar';
import { MaterialButton } from '@solidmaterial/material/components/button';
import { MaterialCheckbox } from '@solidmaterial/material/components/checkbox';
import { MaterialIconButton } from '@solidmaterial/material/components/icon-button';
import { MaterialList, MaterialListItem } from '@solidmaterial/material/components/list';
import { MaterialTextField } from '@solidmaterial/material/components/text-field';
import { Span } from '@solidmaterial/material/components/typography';
import { Breakpoints } from '@solidmaterial/material/utils';
import { For, Show } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';

import type { ExampleListItemType } from '../../pages/examples/ExampleList';
import type { ExampleProps } from '../examples.types';

import styles from './TodoList.module.css';

import AddIcon from '@solidmaterial/icons/400/outlined/add.svg';
import ChecklistIcon from '@solidmaterial/icons/400/outlined/checklist.svg';
import DeleteIcon from '@solidmaterial/icons/400/outlined/delete.svg';

type Todo = { id: number; text: string; completed: boolean };

export const TodoList: VoidComponent<ExampleProps> = props => {
  const navigate = useNavigate();
  const navigateBackToList = () => navigate('..', { state: { transition: 'backward' } });

  const isMobile = () => Breakpoints.isCompactWidth() || Breakpoints.isCompactHeight();

  const [todos, setTodos] = createStore<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos(todos.length, { id: Math.max(-1, ...todos.map(t => t.id)) + 1, text, completed: false });
  };

  const removeTodo = (event: PointerEvent, id: number) => {
    event.stopImmediatePropagation();
    setTodos(reconcile(todos.filter(t => t.id !== id)));
  };

  const toggleTodo = (id: number) => {
    setTodos(
      items => items.id === id,
      'completed',
      c => !c
    );
  };

  const onSubmit = (event: SubmitEvent) => {
    if (event.target instanceof HTMLFormElement) {
      const form = event.target;
      const data = Object.fromEntries(new FormData(form));

      const { text } = data;

      if (typeof text !== 'string' || !text.trim()) {
        return;
      }
      addTodo(text);
      form.reset();
    }
  };

  return (
    <>
      <MaterialAppBar
        variant={isMobile() ? 'small' : 'large'}
        title={props.data.label}
        leadingButtonAriaLabel="Go back to list"
        onNavigate={navigateBackToList}
      />
      <main>
        <div class={styles['container']}>
          <form action="" method="dialog" onSubmit={onSubmit} class={styles['form']}>
            <MaterialTextField variant="filled" required name="text" placeholder="Todo" />
            <MaterialButton variant="tonal" size="medium" type="submit" icon={<AddIcon />}>
              Add Todo
            </MaterialButton>
          </form>
          <Show when={todos.length > 0}>
            <section class={styles['list']}>
              <MaterialList segmented={true}>
                <For each={todos}>
                  {todo => {
                    return (
                      <MaterialListItem
                        start={
                          <MaterialCheckbox
                            inert={true}
                            checked={todo.completed}
                            ariaLabel={`Item '${todo.text}' is ${todo.completed ? 'completed' : 'not completed'}`}
                          />
                        }
                        end={
                          <MaterialIconButton
                            variant="text"
                            icon={<DeleteIcon />}
                            title="Remove"
                            onClick={(event: PointerEvent) => removeTodo(event, todo.id)}
                          />
                        }
                        ariaLabel={todo.text}
                        onClick={() => toggleTodo(todo.id)}
                      >
                        <span classList={{ [styles['completed']!]: todo.completed }}>{todo.text}</span>
                      </MaterialListItem>
                    );
                  }}
                </For>
              </MaterialList>
              <Span role="body" size="medium" class={styles['summary']}>
                {`${todos.filter(t => t.completed).length} out of ${todos.length} completed`}
              </Span>
            </section>
          </Show>
        </div>
      </main>
    </>
  );
};

export const TodoListExampleItem: ExampleListItemType = {
  name: 'todo',
  label: 'Todo list',
  icon: ChecklistIcon,
  supportingText: 'Button, checkbox, list, text field',
  component: TodoList
};
