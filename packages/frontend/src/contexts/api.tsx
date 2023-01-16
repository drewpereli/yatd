import { createContext, JSXElement, useContext } from 'solid-js';
import { useLocalStorage } from './local-storage';

type ContextType = {
  request: (url: `/${string}`, options?: RequestInit) => Promise<any>;
};

const ApiContext = createContext<ContextType>();

export const ApiProvider = function (props: { children: JSXElement }) {
  const ls = useLocalStorage();

  const request = async (url: `/${string}`, options: RequestInit = {}) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ls.authToken.get()}`,
    };

    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    const opts = {
      ...options,
      headers,
    };

    const res = await fetch(`http://localhost:4000/api/v1${url}`, opts);
    return res.json();
  };

  const contextValue = {
    request,
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {props.children}
    </ApiContext.Provider>
  );
};

export function useApi() {
  return useContext(ApiContext) as ContextType;
}
