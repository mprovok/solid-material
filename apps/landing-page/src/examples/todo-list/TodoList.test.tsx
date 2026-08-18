import type { FlowComponent } from 'solid-js';

import { MemoryRouter, Route } from '@solidjs/router';
import { fireEvent, render, waitFor, within } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { TodoList, TodoListExampleItem } from './TodoList';

const Wrapper: FlowComponent = props => {
  return (
    <MemoryRouter>
      <Route path="/" component={() => props.children} />
    </MemoryRouter>
  );
};

describe('TodoList', () => {
  test('it will render an text input and a button', () => {
    const { getByPlaceholderText, getByText } = render(() => <TodoList data={TodoListExampleItem} />, {
      wrapper: Wrapper
    });

    expect(getByPlaceholderText('Todo')).toBeInTheDocument();
    expect(getByText('Add Todo')).toBeInTheDocument();
  });

  test('it will add a new todo', async () => {
    const { getByPlaceholderText, getByText } = render(() => <TodoList data={TodoListExampleItem} />, {
      wrapper: Wrapper
    });

    const input = getByPlaceholderText('Todo') as HTMLInputElement;
    input.value = 'test new todo';

    const button = getByText('Add Todo');
    fireEvent.click(button);

    expect(input.value).toBe('');
    expect(getByText(/test new todo/)).toBeInTheDocument();
  });

  test('it will mark a todo as completed', async () => {
    const { getByPlaceholderText, findByRole, getByText } = render(() => <TodoList data={TodoListExampleItem} />, {
      wrapper: Wrapper
    });

    const input = getByPlaceholderText('Todo') as HTMLInputElement;
    input.value = 'mark new todo as completed';

    const button = getByText('Add Todo');
    fireEvent.click(button);

    // Wait for item to be added to the DOM
    const item = await findByRole('listitem');
    expect(item).toBeInTheDocument();

    // Check checkbox is not checked
    const completed = item.querySelector('md-checkbox');
    expect(completed?.checked).toBe(false);

    // Click list item
    const itemButtons = within(item).getAllByRole('button');
    fireEvent.click(itemButtons[0] as HTMLButtonElement);

    // Wait for checkbox to become checked
    await waitFor(async () => expect(completed?.checked).toBe(true));

    const text = getByText('mark new todo as completed');
    expect(text).toHaveStyle({
      'text-decoration': 'line-through'
    });
  });
});
