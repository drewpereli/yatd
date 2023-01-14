import { A } from '@solidjs/router';
import { Component, Show } from 'solid-js';
import { useAuth } from '../contexts/auth';

const NavBar: Component = function () {
  const { isLoggedIn } = useAuth();

  return (
    <div class="h-12 flex items-center justify-end space-x-8 px-8 shadow text-sm">
      <Show
        when={!isLoggedIn()}
        fallback={
          <A class="text-gray-600 hover:underline" href="/logout">
            Log Out
          </A>
        }
      >
        <A class="text-gray-600 hover:underline" href="/login">
          Log In
        </A>
        <A class="text-gray-600 hover:underline" href="/sign-up">
          Sign Up
        </A>
      </Show>
    </div>
  );
};

export default NavBar;
