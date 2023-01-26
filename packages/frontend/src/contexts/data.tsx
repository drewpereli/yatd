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
  DeleteTodoDocument,
  DeleteTodoMutation,
  DeleteTodoMutationVariables,
  GetTodosDocument,
  UpdateTodoDocument,
  UpdateTodoMutation,
  UpdateTodoMutationVariables,
} from '../graphql/generated';
import { Todo } from '../types';

const StoreContext = createContext<ContextType>();

type ContextType = {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
  createTodo: (data: CreateTodoMutationVariables) => Promise<void>;
  updateTodo: (data: UpdateTodoMutationVariables) => Promise<void>;
  deleteTodo: (data: DeleteTodoMutationVariables) => Promise<void>;
};

export const DataProvider = function (props: { children: JSXElement }) {
  const [todos, setTodos] = createStore<Todo[]>([]);
  const { request } = useApi();

  const createTodo = async (
    todo: CreateTodoMutationVariables
  ): Promise<CreateTodoMutation['createTodo']> => {
    const resp = await request({
      document: CreateTodoDocument,
      variables: todo,
    });

    return resp.createTodo;
  };

  const updateTodo = async (
    todo: UpdateTodoMutationVariables
  ): Promise<UpdateTodoMutation['updateTodo']> => {
    const resp = await request({
      document: UpdateTodoDocument,
      variables: todo,
    });

    return resp.updateTodo;
  };

  const deleteTodo = async (
    vars: DeleteTodoMutationVariables
  ): Promise<DeleteTodoMutation['deleteTodo']> => {
    const resp = await request({
      document: DeleteTodoDocument,
      variables: vars,
    });

    return resp.deleteTodo;
  };

  const data: ContextType = {
    todos,
    async fetchTodos() {
      const resp = await request({ document: GetTodosDocument });
      setTodos(resp.todos);
    },
    async createTodo(data: CreateTodoMutationVariables) {
      const t = await createTodo(data);

      setTodos([...todos, t]);
    },
    async updateTodo(data) {
      const t = await updateTodo(data);

      setTodos(todos.map((todo) => (todo.id === t.id ? t : todo)));
    },
    async deleteTodo(data) {
      const { id } = await deleteTodo(data);

      setTodos(todos.filter((todo) => todo.id !== id));
    },
  };

  return (
    <StoreContext.Provider value={data}>{props.children}</StoreContext.Provider>
  );
};

export function useData() {
  return useContext(StoreContext) as ContextType;
}
