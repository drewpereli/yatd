import { useNavigate } from '@solidjs/router';
import { Component, createSignal } from 'solid-js';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../contexts/auth';
import type { AuthErrorCode } from 'backend/src/routes/auth-routes';

const errorMessages: Partial<Record<AuthErrorCode, string>> = {
  weak_password: 'Password is too weak',
  username_taken: 'Username is already taken',
};

const fallbackMessage = 'Something went wrong. Please try again later.';

const SignUp: Component = function () {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [passwordConfirmation, setPasswordConfirmation] = createSignal('');
  const [error, setError] = createSignal('');

  const navigate = useNavigate();

  const { signUp } = useAuth();

  const onSignUp = async () => {
    if (!username() || !password() || !passwordConfirmation()) {
      setError('Username, password, and password confirmation are required');
      return;
    }

    if (password() !== passwordConfirmation()) {
      setError('Password and password confirmation do not match');
      return;
    }

    const successOrMessage = await signUp({
      username: username(),
      password: password(),
      passwordConfirmation: passwordConfirmation(),
    });

    if (successOrMessage === true) {
      navigate('/');
    }

    const message =
      errorMessages[successOrMessage as AuthErrorCode] || fallbackMessage;

    setError(message);
  };

  return (
    <div class="space-y-4">
      <h1 class="font-bold text-xl">Sign Up</h1>

      <form class="space-y-4">
        <Input label="Username" value={username()} setValue={setUsername} />
        <Input
          label="Password"
          value={password()}
          setValue={setPassword}
          type="password"
        />
        <Input
          label="Password Confirmation"
          value={passwordConfirmation()}
          setValue={setPasswordConfirmation}
          type="password"
        />

        <div class="flex justify-between">
          <div>{error() && <p class="text-red-500">{error()}</p>}</div>

          <Button label="Sign Up" onClick={onSignUp} />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
