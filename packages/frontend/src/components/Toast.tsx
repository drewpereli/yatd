import { Component, createSignal, onMount } from 'solid-js';
import { DEFAULT_TIMEOUT, Toast, useToast } from '../contexts/toast';
import { timeout } from '../utils/task';

const ToastComponent: Component<{ toast: Toast; class?: string }> = function (props) {
  const toasts = useToast();

  const [animating, setAnimating] = createSignal<null | 'in' | 'out'>(null);

  const classes = () => {
    const colorClassesOptions: Record<Toast['type'], string> = {
      success: 'bg-green-100 text-green-800',
      danger: 'bg-red-100 text-red-800',
    };

    const colorClasses = colorClassesOptions[props.toast.type];

    const animatingClasses = animating() !== 'in' ? 'translate-x-[38rem]' : '';

    const staticClasses =
      'block text-left w-[36rem] flex items-center p-4 rounded text-xl font-semibold border border-current transition-transform';

    return [staticClasses, colorClasses, animatingClasses, props.class].join(
      ' '
    );
  };

  const transitionDuration = 150;

  const remove = async () => {
    setAnimating('out');
    // Wait for the transition to finish, plus a little extra, before removing the toast.
    // The little-extra is because if there are toasts above this one, and they move down instantly when
    // this toast exist, it looks abrupt.
    await timeout(transitionDuration + 50);
    toasts.remove(props.toast.id);
  };

  onMount(() => {
    setTimeout(() => setAnimating('in'), 0);

    setTimeout(remove, DEFAULT_TIMEOUT);
  });

  return (
    <button
      class={classes()}
      type="button"
      onClick={remove}
      style={{ 'transition-duration': `${transitionDuration}ms` }}
    >
      <p>{props.toast.message}</p>
    </button>
  );
};

export default ToastComponent;
