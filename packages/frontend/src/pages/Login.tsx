import { useNavigate } from '@solidjs/router';
import { Component, createSignal } from 'solid-js';
import Button from '../components/Button';
import Input from '../components/Input';
import { request } from '../utils/api';
import { setAuthToken } from '../utils/auth';

const Login: Component = function () {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');

  const navigate = useNavigate();

  const logIn = async () => {
    const resp = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username(),
        password: password(),
      }),
    });

    console.log(resp);

    if (resp.access_token) {
      setAuthToken(resp.access_token);
      navigate('/');
      return;
    }
  };

  return (
    <div>
      <h1>Log In</h1>

      <form class="space-y-4">
        <Input label="Username" value={username()} setValue={setUsername} />
        <Input
          label="Password"
          value={password()}
          setValue={setPassword}
          type="password"
        />

        <div class="flex items-center justify-end">
          <Button label="Log In" onClick={logIn} />
        </div>
      </form>
    </div>
  );
};

export default Login;
