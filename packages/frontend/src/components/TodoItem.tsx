import {
  Component,
  createSignal,
  createEffect,
  Match,
  Show,
  Switch,
} from 'solid-js';
import { useData } from '../contexts/data';
import type { Todo } from '../types';
import Button from './Button';
import Input from './Input';
import TextArea from './TextArea';

const TodoItem: Component<{ todo: Todo }> = function (props) {
  const { updateTodo, deleteTodo } = useData();
  const [isEditing, setIsEditing] = createSignal(false);

  const [title, setTitle] = createSignal('');

  const [description, setDescription] = createSignal('');

  createEffect(() => {
    setTitle(props.todo.title);
    setDescription(props.todo.description ?? '');
  });

  const toggleTodo = async () => {
    return updateTodo({
      ...props.todo,
      done: !props.todo.done,
    });
  };

  const saveChanges = async () => {
    await updateTodo({
      ...props.todo,
      title: title(),
      description: description(),
    });

    setIsEditing(false);
  };

  return (
    <div class="grid grid-cols-[1rem_1fr_1rem_1rem] gap-2">
      <input type="checkbox" checked={props.todo.done} onChange={toggleTodo} />

      <Show
        when={isEditing()}
        fallback={<h3 class="font-bold">{props.todo.title}</h3>}
      >
        <Input value={title()} setValue={setTitle} />
      </Show>

      <button onClick={() => setIsEditing(!isEditing())}>
        {isEditing() ? '✕' : '✎'}
      </button>

      <button onClick={() => deleteTodo(props.todo)}>🗑</button>

      <Switch>
        <Match when={isEditing()}>
          <TextArea
            value={description()}
            setValue={setDescription}
            class="col-start-2"
          />
        </Match>

        <Match when={props.todo.description}>
          <p class="truncate col-start-2">{props.todo.description}</p>
        </Match>
      </Switch>

      <Show when={isEditing()}>
        <div class="col-start-2 col-span-full">
          <Button onClick={saveChanges} label="Save" />
        </div>
      </Show>
    </div>
  );
};

export default TodoItem;
