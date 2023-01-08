import { Component } from 'solid-js';
import NewTodo from '../components/NewTodo';
import TodoList from '../components/TodoList';

const HomePage: Component = function () {
  return (
    <div>
      <NewTodo />
      <TodoList />
    </div>
  );
};

export default HomePage;
