import { Component, createSignal } from 'solid-js';
import { useData } from '../contexts/data';
import { randomId } from '../utils/random-id';

const NewTodo: Component = function () {
  const store = useData();

  const [title, setTitle] = createSignal('');
  const [description, setDescription] = createSignal('');

  const [titleId, contentId] = [randomId('title'), randomId('content')];

  const createTodo = async () => {
    await store.createTodo({
      title: title(),
      description: description(),
    });

    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <form class="space-y-4">
        <div>
          <label for={titleId}>Title</label>
          <input
            id={titleId}
            value={title()}
            onInput={(e) => setTitle(e.currentTarget.value)}
            class="border border-gray-300 rounded w-full focus:outline-indigo-400 px-2 py-1"
          />
        </div>

        <div>
          <label for={contentId}>Description</label>
          <textarea
            id={contentId}
            value={description()}
            onInput={(e) => setDescription(e.currentTarget.value)}
            class="border border-gray-300 rounded w-full focus:outline-indigo-400 px-2 py-1"
            rows="7"
          />
        </div>

        <div class="flex items-center justify-end">
          <button
            class="flex items-center px-4 py-2 rounded text-white bg-indigo-400 hover:bg-indigo-500 active:bg-indigo-400"
            type="button"
            onClick={createTodo}
          >
            Create Todo
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTodo;
