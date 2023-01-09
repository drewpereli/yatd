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
    <div class="grid grid-cols-[1rem_1fr_1rem] gap-2">
      <input type="checkbox" checked={todo.done} onChange={toggleTodo} />

      <h3 class="font-bold">{todo.title}</h3>

      <Show when={todo.description}>
        <p class="truncate col-start-2">{todo.description}</p>
      </Show>
    </div>
  );
};

export default TodoItem;
