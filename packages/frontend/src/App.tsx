import type { Component } from 'solid-js';
import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';

const App: Component = () => {
  return (
    <div class="p-4 flex justify-center">
      <div class="max-w-4xl w-full">
        <NewTodo />

        <TodoList />
      </div>
    </div>
  );
};

export default App;
