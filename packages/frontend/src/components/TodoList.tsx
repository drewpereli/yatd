import { Component, For, onMount, Show } from 'solid-js';
import { useData } from '../../data';
import TodoItem from './TodoItem';

const TodoList: Component = function () {
  const data = useData();

  onMount(data.fetchTodos);

  const doneTodos = () => data.todos.filter((todo) => todo.done);
  const notDoneTodos = () => data.todos.filter((todo) => !todo.done);

  return (
    <div class="space-y-4">
      <Show when={!data.fetchTodosIsRunning()} fallback={<div>Loading...</div>}>
        <div class="space-y-2">
          <h3 class="text-xl font-bold">Not Done</h3>
          <For each={notDoneTodos()}>{(todo) => <TodoItem todo={todo} />}</For>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl font-bold">Done</h3>
          <For each={doneTodos()}>{(todo) => <TodoItem todo={todo} />}</For>
        </div>
      </Show>
    </div>
  );
};

export default TodoList;
