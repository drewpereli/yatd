import type { Todo } from '@prisma/client';
import { Component, Show } from 'solid-js';
import { useData } from '../../data';

const TodoItem: Component<{ todo: Todo }> = function ({ todo }) {
  const { updateTodo } = useData();

  const toggleTodo = async () => {
    return updateTodo({
      ...todo,
      done: !todo.done,
    });
  };

  return (
    <div class="flex items-center space-x-4">
      <input type="checkbox" checked={todo.done} onChange={toggleTodo} />

      <h3 class="font-bold">{todo.title}</h3>

      <Show when={todo.description}>
        <p class="truncate">{todo.description}</p>
      </Show>
    </div>
  );
};

export default TodoItem;
