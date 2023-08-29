import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { Provider } from 'react-redux';
import { store } from './store';
import { ImageViewer } from './components/ImageViewer';

 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ImageViewer />
    </Provider>
  </React.StrictMode>,
);
