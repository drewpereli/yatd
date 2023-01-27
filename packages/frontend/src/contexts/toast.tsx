import { createContext, JSXElement, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { randomId } from '../utils/random-id';

type ToastFn = (message: string) => void;

type ContextType = {
  toasts: Toast[];
  success: ToastFn;
  danger: ToastFn;
  remove: (id: string) => void;
};

export type Toast = {
  message: string;
  type: 'success' | 'danger';
  id: string;
};

const ToastContext = createContext<ContextType>();

const MAX_TOASTS = 5;

export const DEFAULT_TIMEOUT = 3000;

export const ToastProvider = function (props: { children: JSXElement }) {
  const [toasts, setToasts] = createStore<Toast[]>([]);

  const contextValue: ContextType = {
    toasts,
    success: (message: string) => {
      if (toasts.length >= MAX_TOASTS) return;

      setToasts([...toasts, { message, type: 'success', id: randomId() }]);
    },
    danger: (message: string) => {
      if (toasts.length >= MAX_TOASTS) return;

      setToasts([...toasts, { message, type: 'danger', id: randomId() }]);
    },
    remove: (id: string) => {
      setToasts(toasts.filter((toast) => toast.id !== id));
    },
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {props.children}
    </ToastContext.Provider>
  );
};

export function useToast() {
  return useContext(ToastContext) as ContextType;
}
