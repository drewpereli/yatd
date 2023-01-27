import { Component, Show } from 'solid-js';
import { randomId } from '../utils/random-id';

const TextArea: Component<{
  label?: string;
  value: string;
  setValue: (v: string) => unknown;
  type?: string;
  class?: string;
  rows?: number; // Defaults to 7
}> = function (props) {
  // eslint-disable-next-line solid/reactivity
  const id = randomId(props.label || 'input');

  return (
    <div class={props.class}>
      <Show when={props.label}>
        <label for={id}>{props.label}</label>
      </Show>
      <textarea
        id={id}
        value={props.value}
        onInput={(e) => props.setValue(e.currentTarget.value)}
        rows={props.rows || 7}
        class="border border-gray-300 rounded w-full focus:outline-indigo-400 px-2 py-1"
      />
    </div>
  );
};

export default TextArea;
