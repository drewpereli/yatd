import { Component } from 'solid-js';

const Button: Component<{ label: string; onClick: () => unknown }> = function (
  props
) {
  return (
    <button
      class="flex items-center px-4 py-2 rounded text-white bg-indigo-400 hover:bg-indigo-500 active:bg-indigo-400"
      type="button"
      onClick={() => props.onClick()}
    >
      {props.label}
    </button>
  );
};

export default Button;
