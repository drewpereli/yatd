import { useNavigate } from '@solidjs/router';
import { Component, createSignal } from 'solid-js';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../contexts/auth';

const SignUp: Component = function () {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [passwordConfirmation, setPasswordConfirmation] = createSignal('');

  const navigate = useNavigate();

  const { signUp } = useAuth();

  const onSignUp = async () => {
    if (
      await signUp({
        username: username(),
        password: password(),
        passwordConfirmation: passwordConfirmation(),
      })
    ) {
      navigate('/');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>

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

        <div class="flex items-center justify-end">
          <Button label="Sign Up" onClick={onSignUp} />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
