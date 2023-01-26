import {
  Accessor,
  createContext,
  createSignal,
  JSXElement,
  onMount,
  useContext,
} from 'solid-js';
import { useLocalStorage } from './local-storage';
import { GraphQLClient, Variables, type RequestOptions } from 'graphql-request';
import { IsOnlineDocument } from '../graphql/generated';

type ContextType = {
  request: <T = any, V extends Variables = Variables>(
    options: RequestOptions<V, T>
  ) => Promise<T>;
  isOffline: Accessor<boolean>;
};

const ApiContext = createContext<ContextType>();

export const ApiProvider = function (props: { children: JSXElement }) {
  const ls = useLocalStorage();

  const [isOffline, setIsOffline] = createSignal(false);

  const client = new GraphQLClient('http://localhost:4000/graphql', {
    responseMiddleware(rawResponse) {
      // If we get back an error that's missing both a 'data' field (for queries) and a 'request' field (for mutations)
      // assume we're offline
      const nowOffline =
        rawResponse instanceof Error &&
        !('request' in rawResponse) &&
        !('data' in rawResponse);

      if (nowOffline !== isOffline()) {
        setIsOffline(nowOffline);
      }
    },
  });

  const r = async (options: RequestOptions) => {
    const token = ls.authToken.get();

    const headers = {
      ...options.requestHeaders,
      Authorization: token ? `Bearer ${ls.authToken.get()}` : '',
    };

    const fullOptions = {
      ...options,
      requestHeaders: headers,
      url: 'http://localhost:4000/graphql',
    };

    return client.request(fullOptions);
  };

  const contextValue = {
    request: r,
    isOffline,
  };

  // Ping the server every 5 seconds to make sure we're still online
  // If we're not, the graphql client response middleware will handle updating isOffline
  onMount(() => {
    setInterval(() => r({ document: IsOnlineDocument }), 5000);
  });

  return (
    <ApiContext.Provider value={contextValue}>
      {props.children}
    </ApiContext.Provider>
  );
};

export function useApi() {
  return useContext(ApiContext) as ContextType;
}
