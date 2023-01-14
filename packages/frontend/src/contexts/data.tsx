import {
  Accessor,
  createContext,
  createSignal,
  useContext,
  JSXElement,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import type { Todo } from '@prisma/client';
import { request } from '../utils/api';

const StoreContext = createContext<ContextType>();

const fetchTodos = async (): Promise<Todo[]> => {
  return request('/todos');
};

const createTodo = async (
  todo: Omit<Todo, 'id' | 'userId' | 'createdAt'>
): Promise<Todo> => {
  return request('/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
  });
};

const updateTodo = async (todo: Omit<Todo, 'userId'>): Promise<Todo> => {
  return request(`/todos/${todo.id}`, {
    method: 'PUT',
    body: JSON.stringify(todo),
  });
};

type ContextType = {
  todos: Todo[];
  fetchTodosIsRunning: Accessor<boolean>;
  createTodosIsRunning: Accessor<boolean>;
  fetchTodos: () => Promise<void>;
  createTodo: (
    data: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'done'>
  ) => Promise<void>;
  updateTodo: (todo: Parameters<typeof updateTodo>[0]) => Promise<void>;
};

export const DataProvider = function (props: { children: JSXElement }) {
  const [todos, setTodos] = createStore<Todo[]>([]);
  const [fetchTodosIsRunning, setFetchTodosIsRunning] = createSignal(false);
  const [createTodosIsRunning, setCreateTodosIsRunning] = createSignal(false);

  const data: ContextType = {
    todos,
    fetchTodosIsRunning,
    createTodosIsRunning,
    async fetchTodos() {
      setFetchTodosIsRunning(true);
      const t = await fetchTodos();
      setTodos(t);
      setFetchTodosIsRunning(false);
    },
    async createTodo(data) {
      setCreateTodosIsRunning(true);

      const t = await createTodo({
        ...data,
        done: false,
      });

      setTodos([...todos, t]);

      setCreateTodosIsRunning(false);
    },
    async updateTodo(data) {
      const t = await updateTodo(data);

      setTodos(todos.map((todo) => (todo.id === t.id ? t : todo)));
    },
  };

  return (
    <StoreContext.Provider value={data}>{props.children}</StoreContext.Provider>
  );
};

export function useData() {
  return useContext(StoreContext) as ContextType;
}
