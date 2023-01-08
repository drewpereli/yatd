import { Component, For, onMount, Show } from 'solid-js';
import { useData } from '../../data';
import TodoItem from './TodoItem';

const TodoList: Component = function () {
  const data = useData();

  onMount(data.fetchTodos);

  return (
    <div>
      <Show when={!data.fetchTodosIsRunning()} fallback={<div>Loading...</div>}>
        <For each={data.todos}>{(todo) => <TodoItem todo={todo} />}</For>
      </Show>
    </div>
  );
};

export default TodoList;
