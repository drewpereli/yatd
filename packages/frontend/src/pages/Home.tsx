import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';
import NewTodo from '../components/NewTodo';
import TodoList from '../components/TodoList';
import { useAuth } from '../contexts/auth';

const HomePage: Component = function () {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn()) {
    useNavigate()('/login');
    // eslint-disable-next-line solid/components-return-once
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
