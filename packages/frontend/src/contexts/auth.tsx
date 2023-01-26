import { Accessor, createContext, useContext, JSXElement } from 'solid-js';
import { useLocalStorage } from './local-storage';
import { useApi } from './api';
import { AuthErrorCode } from 'backend/types';
import { CreateUserDocument, LogInDocument } from '../graphql/generated';

const authErrorMessages = Object.values(AuthErrorCode);

const AuthContext = createContext<ContextType>();

type ContextType = {
  isLoggedIn: Accessor<boolean>;
  signUp: (data: {
    username: string;
    password: string;
  }) => Promise<boolean | AuthErrorCode>;
  logIn: (data: {
    username: string;
    password: string;
  }) => Promise<boolean | AuthErrorCode>;
  logOut: () => Promise<void>;
};

type ErrorResponse = {
  response: {
    errors: { message: string }[];
  };
};

function isResponseError(error: unknown): error is ErrorResponse {
  return typeof error === 'object' && error !== null && 'response' in error;
}

function isAuthErrorCode(str: string): str is AuthErrorCode {
  return (authErrorMessages as string[]).includes(str);
}

export const AuthProvider = function (props: { children: JSXElement }) {
  const ls = useLocalStorage();
  const { request } = useApi();

  const signUp: ContextType['signUp'] = async function (data) {
    try {
      const resp = await request({
        document: CreateUserDocument,
        variables: data,
      });

      if (resp.createUser.token) {
        ls.authToken.set(resp.createUser.token);
        return true;
      }
    } catch (error) {
      if (!isResponseError(error)) throw error;

      const { message } = error.response.errors[0];

      if (isAuthErrorCode(message)) return message;
    }

    return false;
  };

  const logIn: ContextType['logIn'] = async function ({ username, password }) {
    try {
      const resp = await request({
        document: LogInDocument,
        variables: { username, password },
      });

      if (resp.login.token) {
        ls.authToken.set(resp.login.token);
        return true;
      }
    } catch (error) {
      if (!isResponseError(error)) throw error;

      const { message } = error.response.errors[0];

      if (isAuthErrorCode(message)) return message;
    }

    return false;
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
