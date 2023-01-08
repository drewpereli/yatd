import {
  Accessor,
  createContext,
  createSignal,
  useContext,
  JSXElement,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import type { Todo } from '@prisma/client';
import { request } from './src/utils/api';

const StoreContext = createContext<ContextType>();

const fetchTodos = async (): Promise<Todo[]> => {
  return request('/todos');
};

const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  return request('/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
};

type ContextType = {
  todos: Todo[];
  fetchTodosIsRunning: Accessor<boolean>;
  createTodosIsRunning: Accessor<boolean>;
  fetchTodos: () => Promise<void>;
  createTodo: (data: Omit<Todo, 'id' | 'done'>) => Promise<void>;
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
    async createTodo(data: Omit<Todo, 'id' | 'done'>) {
      setCreateTodosIsRunning(true);

      const t = await createTodo({
        ...data,
        done: false,
      });

      setTodos([...todos, t]);

      setCreateTodosIsRunning(false);
    },
  };

  return (
    <StoreContext.Provider value={data}>{props.children}</StoreContext.Provider>
  );
};

export function useData() {
  return useContext(StoreContext) as ContextType;
}
