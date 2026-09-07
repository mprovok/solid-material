import type { FlowComponent } from 'solid-js';

import { MemoryRouter, Route } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { TodoList, TodoListExampleItem } from './TodoList';

const Wrapper: FlowComponent = props => {
  return (
    <MemoryRouter>
      <Route path="/" component={() => props.children} />
    </MemoryRouter>
  );
};

describe('TodoList', () => {
  test('it will render a text input and a button', async () => {
    const { baseElement } = render(() => <TodoList data={TodoListExampleItem} />, {
      wrapper: Wrapper
    });
    const screen = page.elementLocator(baseElement);

    await expect.element(screen.getByRole('textbox', { name: 'Todo' })).toBeInTheDocument();
    await expect.element(screen.getByText('Add Todo')).toBeInTheDocument();
  });

  test('it will add a new todo', async () => {
    const { baseElement, queryByRole } = render(() => <TodoList data={TodoListExampleItem} />, {
      wrapper: Wrapper
    });
    const screen = page.elementLocator(baseElement);

    expect(queryByRole('listitem')).toBeNull();

    const input = screen.getByRole('textbox', { name: 'Todo' });
    await userEvent.fill(input, 'test new todo');

    const button = screen.getByText('Add Todo');
    await userEvent.click(button);

    await expect.element(input).toHaveValue('');
    await expect.element(screen.getByText(/test new todo/u)).toBeInTheDocument();
  });

  test('it will remove a new todo', async () => {
    const { baseElement, queryByRole } = render(() => <TodoList data={TodoListExampleItem} />, {
      wrapper: Wrapper
    });
    const screen = page.elementLocator(baseElement);

    const input = screen.getByRole('textbox', { name: 'Todo' });
    await userEvent.fill(input, 'test new todo');

    const button = screen.getByText('Add Todo');
    await userEvent.click(button);

    // Wait for item to be added to the DOM
    const item = screen.getByRole('listitem');
    await expect.element(item).toBeInTheDocument();

    const removeButton = screen.getByRole('button', { name: 'Remove', exact: true });
    await userEvent.click(removeButton);

    expect(queryByRole('listitem')).toBeNull();
  });

  test('it will mark a todo as completed', async () => {
    const { baseElement } = render(() => <TodoList data={TodoListExampleItem} />, {
      wrapper: Wrapper
    });
    const screen = page.elementLocator(baseElement);

    const input = screen.getByRole('textbox', { name: 'Todo' });
    await userEvent.fill(input, 'mark new todo as completed');

    const button = screen.getByText('Add Todo');
    await userEvent.click(button);

    // Wait for item to be added to the DOM
    const item = screen.getByRole('listitem');
    await expect.element(item).toBeInTheDocument();

    // Check checkbox is not checked
    const completed = screen.getByRole('checkbox');
    await expect.element(completed).not.toBeChecked();

    // Click list item
    const itemButton = item.getByRole('button').first();
    await userEvent.click(itemButton);

    // Wait for checkbox to become checked
    await expect.element(completed).toBeChecked();

    const text = screen.getByText('mark new todo as completed');
    await expect.element(text).toHaveStyle({
      textDecoration: 'line-through'
    });
  });
});
