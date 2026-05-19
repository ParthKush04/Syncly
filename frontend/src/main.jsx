import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import './index.css';
import { StreamVideoSessionProvider } from './context/StreamVideoSessionContext.jsx';
import GlobalErrorCatcher from './components/common/GlobalErrorCatcher.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StreamVideoSessionProvider>
      <GlobalErrorCatcher>
        <App />
      </GlobalErrorCatcher>
    </StreamVideoSessionProvider>
  </React.StrictMode>
);
