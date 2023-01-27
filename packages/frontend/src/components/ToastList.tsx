import { Component, For } from 'solid-js';
import { useToast } from '../contexts/toast';
import ToastComponent from './Toast';

const ToastList: Component = function () {
  const { toasts } = useToast();

  return (
    <div class="fixed bottom-8 right-8 flex flex-col-reverse translate-x">
      <For each={toasts}>
        {(toast) => <ToastComponent toast={toast} class="mt-2" />}
      </For>
    </div>
  );
};

export default ToastList;
