import {
  Accessor,
  createContext,
  createSignal,
  useContext,
  JSXElement,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { useApi } from './api';
import {
  CreateTodoDocument,
  CreateTodoMutation,
  CreateTodoMutationVariables,
  GetTodosDocument,
} from '../graphql/generated';
import { Todo } from '../types';

const StoreContext = createContext<ContextType>();

type ContextType = {
  todos: Todo[];
  fetchTodosIsRunning: Accessor<boolean>;
  createTodosIsRunning: Accessor<boolean>;
  fetchTodos: () => Promise<void>;
  createTodo: (data: CreateTodoMutationVariables) => Promise<void>;
  // updateTodo: (todo: Omit<Todo, 'userId'>) => Promise<void>;
  // deleteTodo: (id: number) => Promise<void>;
};

export const DataProvider = function (props: { children: JSXElement }) {
  const [todos, setTodos] = createStore<Todo[]>([]);
  const [fetchTodosIsRunning, setFetchTodosIsRunning] = createSignal(false);
  const [createTodosIsRunning, setCreateTodosIsRunning] = createSignal(false);
  const { request } = useApi();

  const fetchTodos = async () => {
    return request({ document: GetTodosDocument });
  };

  const createTodo = async (
    todo: CreateTodoMutationVariables
  ): Promise<CreateTodoMutation['createTodo']> => {
    const resp = await request({
      document: CreateTodoDocument,
      variables: todo,
    });

    return resp.createTodo;
  };

  // const updateTodo = async (todo: Omit<Todo, 'userId'>): Promise<Todo> => {
  //   return request(`/todos/${todo.id}`, {
  //     method: 'PUT',
  //     body: JSON.stringify(todo),
  //   });
  // };

  // const deleteTodo = async (id: number): Promise<void> => {
  //   return request(`/todos/${id}`, {
  //     method: 'DELETE',
  //   });
  // };

  const data: ContextType = {
    todos,
    fetchTodosIsRunning,
    createTodosIsRunning,
    async fetchTodos() {
      setFetchTodosIsRunning(true);
      const t = await fetchTodos();
      setTodos(t.todos);
      setFetchTodosIsRunning(false);
    },
    async createTodo(data: CreateTodoMutationVariables) {
      setCreateTodosIsRunning(true);

      const t = await createTodo(data);

      setTodos([...todos, t]);

      setCreateTodosIsRunning(false);
    },
    // async updateTodo(data) {
    //   const t = await updateTodo(data);

    //   setTodos(todos.map((todo) => (todo.id === t.id ? t : todo)));
    // },
    // async deleteTodo(id) {
    //   await deleteTodo(id);

    //   setTodos(todos.filter((todo) => todo.id !== id));
    // },
  };

  return (
    <StoreContext.Provider value={data}>{props.children}</StoreContext.Provider>
  );
};

export function useData() {
  return useContext(StoreContext) as ContextType;
}
