import { useNavigate } from '@solidjs/router';
import { Component, createSignal } from 'solid-js';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../contexts/auth';
import type { AuthErrorCode } from 'backend/types';
import { useToast } from '../contexts/toast';

const errorMessages: Partial<Record<AuthErrorCode, string>> = {
  auth_failed: 'Username or password is incorrect',
};

const fallbackMessage = 'Something went wrong. Please try again later.';

const Login: Component = function () {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');

  const navigate = useNavigate();

  const { logIn } = useAuth();
  const toasts = useToast();

  const onLogIn = async () => {
    if (!username() || !password()) {
      setError('Username and password are required');
      return;
    }

    const successOrMessage = await logIn({
      username: username(),
      password: password(),
    });

    if (successOrMessage === true) {
      setError('');
      navigate('/');
      toasts.success(`Welcome back, ${username()}!`);
      return;
    }

    const message =
      errorMessages[successOrMessage as AuthErrorCode] || fallbackMessage;

    setError(message);
  };

  return (
    <div class="space-y-4">
      <h1 class="font-bold text-xl">Log In</h1>

      <form class="space-y-4">
        <Input label="Username" value={username()} setValue={setUsername} />
        <Input
          label="Password"
          value={password()}
          setValue={setPassword}
          type="password"
        />

        <div class="flex justify-between">
          <div>{error() && <p class="text-red-500">{error()}</p>}</div>

          <Button label="Log In" onClick={onLogIn} />
        </div>
      </form>
    </div>
  );
};

export default Login;
