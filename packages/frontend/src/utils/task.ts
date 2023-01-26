import { createSignal } from 'solid-js';

export function createTask<Args extends any[], Ret>(
  fn: (...args: Args) => Promise<Ret>
) {
  const [isRunning, setIsRunning] = createSignal(false);

  const perform = async (...args: Args) => {
    try {
      setIsRunning(true);
      return await fn(...args);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    isRunning,
    perform,
  };
}
