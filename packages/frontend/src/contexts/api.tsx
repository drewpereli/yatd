import {
  Accessor,
  createContext,
  createSignal,
  JSXElement,
  onMount,
  useContext,
} from 'solid-js';
import { useLocalStorage } from './local-storage';
import { request, Variables, type RequestOptions } from 'graphql-request';

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

    return request(fullOptions);

    // let response;

    // try {
    //   response = await fetch(`http://localhost:4000/api/v1${url}`, opts);
    // } catch (error: any) {
    //   // If the fetch throws an error, we'll assume it's a network error
    //   setIsOffline(true);
    //   return;
    // }

    // if (isOffline()) setIsOffline(false);

    // return response.json();
  };

  const contextValue = {
    request: r,
    isOffline,
  };

  // // Ping the server every 5 seconds to make sure we're still online
  // // If we're not, the 'request' function will handle updating isOffline
  // onMount(() => {
  //   setInterval(() => request('/ping-connection'), 5000);
  // });

  return (
    <ApiContext.Provider value={contextValue}>
      {props.children}
    </ApiContext.Provider>
  );
};

export function useApi() {
  return useContext(ApiContext) as ContextType;
}
