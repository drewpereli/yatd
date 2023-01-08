import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';
import NewTodo from '../components/NewTodo';
import TodoList from '../components/TodoList';
import { isLoggedIn } from '../utils/auth';

const HomePage: Component = function () {
  if (!isLoggedIn()) {
    useNavigate()('/sign-up');
    return;
  }

  return (
    <div>
      <NewTodo />
      <TodoList />
    </div>
  );
};

export default HomePage;
