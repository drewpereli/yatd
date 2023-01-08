import { Component, Show } from 'solid-js';
import { randomId } from '../utils/random-id';

const Input: Component<{
  label?: string;
  value: string;
  setValue: (v: string) => unknown;
  type?: string;
}> = function (props) {
  const id = randomId(props.label || 'input');

  return (
    <div>
      <Show when={props.label}>
        <label for={id}>{props.label}</label>
      </Show>
      <input
        id={id}
        value={props.value}
        type={props.type || 'text'}
        onInput={(e) => props.setValue(e.currentTarget.value)}
        class="border border-gray-300 rounded w-full focus:outline-indigo-400 px-2 py-1"
      />
    </div>
  );
};

export default Input;
