import {
  Accessor,
  createContext,
  createSignal,
  useContext,
  JSXElement,
  createEffect,
} from 'solid-js';
import { request } from '../utils/api';
import {
  clearAuthTokenLocalStorage,
  getAuthTokenLocalStorage,
  setAuthTokenLocalStorage,
} from '../utils/local-storage';

const AuthContext = createContext<ContextType>();

type ContextType = {
  isLoggedIn: Accessor<boolean>;
  signUp: (data: {
    username: string;
    password: string;
    passwordConfirmation: string;
  }) => Promise<boolean>;
  logIn: (data: { username: string; password: string }) => Promise<boolean>;
  logOut: () => Promise<void>;
};

export const AuthProvider = function (props: { children: JSXElement }) {
  const [authToken, setAuthToken] = createSignal<string | null>(
    getAuthTokenLocalStorage()
  );

  createEffect(() => {
    const token = authToken();

    if (token) {
      setAuthTokenLocalStorage(token);
    } else {
      clearAuthTokenLocalStorage();
    }
  });

  const signUp: ContextType['signUp'] = async function (data) {
    const resp = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      }),
    });

    if (resp.access_token) {
      setAuthToken(resp.access_token);
      return true;
    }

    return false;
  };

  const logIn: ContextType['logIn'] = async function ({ username, password }) {
    const resp = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (resp.access_token) {
      setAuthToken(resp.access_token);
      return true;
    }

    return false;
  };

  const logOut: ContextType['logOut'] = async function () {
    setAuthToken(null);
  };

  const auth: ContextType = {
    signUp,
    logIn,
    isLoggedIn: () => !!authToken(),
    logOut,
  };

  return (
    <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext) as ContextType;
}
