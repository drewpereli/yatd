import { Accessor, createContext, useContext, JSXElement } from 'solid-js';
import { AuthErrorCode } from 'backend/src/routes/auth-routes';
import { useLocalStorage } from './local-storage';
import { useApi } from './api';

const AuthContext = createContext<ContextType>();

type ContextType = {
  isLoggedIn: Accessor<boolean>;
  signUp: (data: {
    username: string;
    password: string;
    passwordConfirmation: string;
  }) => Promise<boolean | AuthErrorCode>;
  logIn: (data: {
    username: string;
    password: string;
  }) => Promise<boolean | AuthErrorCode>;
  logOut: () => Promise<void>;
};

export const AuthProvider = function (props: { children: JSXElement }) {
  const ls = useLocalStorage();
  const { request } = useApi();

  const signUp: ContextType['signUp'] = async function (data) {
    const resp = await fetch('http://localhost:4000/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      }),
    }).then((res) => res.json());

    if (resp.access_token) {
      ls.authToken.set(resp.access_token);
      return true;
    }

    return resp.errors?.[0]?.msg ?? false;
  };

  const logIn: ContextType['logIn'] = async function ({ username, password }) {
    const resp = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((r) => r.json());

    if (resp.access_token) {
      ls.authToken.set(resp.access_token);
      return true;
    }

    return resp.errors?.[0]?.msg ?? false;
  };

  const logOut: ContextType['logOut'] = async function () {
    ls.authToken.set(null);
  };

  const auth: ContextType = {
    signUp,
    logIn,
    isLoggedIn: () => !!ls.authToken.get(),
    logOut,
  };

  return (
    <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext) as ContextType;
}
