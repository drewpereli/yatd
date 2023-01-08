import type { Todo } from '@prisma/client';
import { Component } from 'solid-js';

const TodoItem: Component<{ todo: Todo }> = function ({ todo }) {
  return (
    <div>
      <h3>{todo.title}</h3>
      <p>{todo.content}</p>
    </div>
  );
};

export default TodoItem;
