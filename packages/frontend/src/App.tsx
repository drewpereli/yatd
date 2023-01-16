import { Route, Routes } from '@solidjs/router';
import type { Component } from 'solid-js';
import NavBar from './components/NavBar';
import { ApiProvider } from './contexts/api';
import { AuthProvider } from './contexts/auth';
import { DataProvider } from './contexts/data';
import { LocalStorageProvider } from './contexts/local-storage';
import Four0Four from './pages/404';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import SignUp from './pages/SignUp';

const App: Component = () => {
  return (
    <LocalStorageProvider>
      <ApiProvider>
        <AuthProvider>
          <DataProvider>
            <div>
              <NavBar />
              <div class="p-4 flex justify-center">
                <div class="max-w-4xl w-full">
                  <Routes>
                    <Route path="/" component={HomePage} />
                    <Route path="/sign-up" component={SignUp} />
                    <Route path="/login" component={Login} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/*" element={Four0Four} />
                  </Routes>
                </div>
              </div>
            </div>
          </DataProvider>
        </AuthProvider>
      </ApiProvider>
    </LocalStorageProvider>
  );
};

export default App;
