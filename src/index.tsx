import React from 'react';
import ReactDOM from 'react-dom';
import App from 'Pages/App';

import { getTheme } from 'Utils';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store';

import 'Styles/Root.scss';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <div id="app" data-theme={getTheme()}>
        <Provider store={store}>
          <App />
        </Provider>
      </div>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
