import type { GetTodosQuery } from './graphql/generated';

export type Todo = GetTodosQuery['todos'][0];
