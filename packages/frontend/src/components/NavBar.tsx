import { A } from '@solidjs/router';
import { Component, Show } from 'solid-js';
import { useAuth } from '../contexts/auth';
import logo from '/images/logo.png';

const NavBar: Component = function () {
  const { isLoggedIn } = useAuth();

  return (
    <div class="h-12 flex items-center justify-between space-x-8 px-8 shadow text-sm">
      <A href="/">
        <img src={logo} alt="logo" class="h-8" />
      </A>

      <div class="flex items-center h-full space-x-8">
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
    </div>
  );
};

export default NavBar;
