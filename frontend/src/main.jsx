import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import './index.css';
import { StreamVideoSessionProvider } from './context/StreamVideoSessionContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StreamVideoSessionProvider>
      <App />
    </StreamVideoSessionProvider>
  </React.StrictMode>
);
