import { useNavigate } from '@solidjs/router';
import { Component, createSignal } from 'solid-js';
import Button from '../components/Button';
import Input from '../components/Input';
import { request } from '../utils/api';
import { setAuthToken } from '../utils/auth';

const SignUp: Component = function () {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [passwordConfirmation, setPasswordConfirmation] = createSignal('');

  const navigate = useNavigate();

  const signUp = async () => {
    const resp = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        username: username(),
        password: password(),
        password_confirmation: passwordConfirmation(),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (resp.access_token) {
      setAuthToken(resp.access_token);
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
          <Button label="Sign Up" onClick={signUp} />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
