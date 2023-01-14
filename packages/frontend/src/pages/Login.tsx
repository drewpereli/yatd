import { useNavigate } from '@solidjs/router';
import { Component, createSignal } from 'solid-js';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../contexts/auth';

const Login: Component = function () {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');

  const navigate = useNavigate();

  const { logIn } = useAuth();

  const onLogIn = async () => {
    if (await logIn({ username: username(), password: password() })) {
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
          <Button label="Log In" onClick={onLogIn} />
        </div>
      </form>
    </div>
  );
};

export default Login;
