import { Route, Routes } from '@solidjs/router';
import type { Component } from 'solid-js';
import { DataProvider } from '../data';
import Four0Four from './pages/404';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import SignUp from './pages/SignUp';

const App: Component = () => {
  return (
    <DataProvider>
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
    </DataProvider>
  );
};

export default App;
