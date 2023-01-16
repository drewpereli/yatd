import { Component, Show } from 'solid-js';
import { useApi } from '../contexts/api';

const OfflineWarning: Component = () => {
  const { isOffline } = useApi();

  return (
    <Show when={isOffline()}>
      <div class="fixed top-0 left-1/2 -translate-x-1/2 h-10 bg-yellow-200 rounded-b px-8 flex items-center justify-center text-gray-600">
        You are offline. Some features may not work.
      </div>
    </Show>
  );
};

export default OfflineWarning;
