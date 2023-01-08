import { Route, Routes } from '@solidjs/router';
import type { Component } from 'solid-js';
import { DataProvider } from '../data';
import Four0Four from './pages/404';
import HomePage from './pages/Home';

const App: Component = () => {
  return (
    <DataProvider>
      <div class="p-4 flex justify-center">
        <div class="max-w-4xl w-full">
          <Routes>
            <Route path="/" component={HomePage} />
            <Route path="/*" element={Four0Four} />
          </Routes>
        </div>
      </div>
    </DataProvider>
  );
};

export default App;
