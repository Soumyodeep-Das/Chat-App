import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './routers';
import { Provider } from 'react-redux';
import {store} from './redux/store';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import { SocketProvider } from './context/SocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);

// Register the service worker for PWA support
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
