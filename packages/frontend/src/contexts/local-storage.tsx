import {
  createContext,
  createEffect,
  createSignal,
  JSXElement,
  useContext,
} from 'solid-js';

const KEYS = ['authToken'] as const satisfies readonly string[];

type Key = (typeof KEYS)[number];

type ContextType = {
  [k in Key]: {
    get: () => string | null;
    set: (value: string | null) => void;
  };
};

const LocalStorageContext = createContext<ContextType>();

export const LocalStorageProvider = function (props: { children: JSXElement }) {
  const contextValue = KEYS.reduce((ctx: Partial<ContextType>, key) => {
    const [get, set] = createSignal<string | null>(localStorage.getItem(key));

    createEffect(() => {
      const value = get();

      if (value !== null) {
        localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    });

    ctx[key] = { get, set };

    return ctx;
  }, {}) as ContextType;

  return (
    <LocalStorageContext.Provider value={contextValue}>
      {props.children}
    </LocalStorageContext.Provider>
  );
};

export function useLocalStorage() {
  return useContext(LocalStorageContext) as ContextType;
}
