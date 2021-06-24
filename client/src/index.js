import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import RootStore from './store/indexStore.js';
import StoreContext from './context.js';

ReactDOM.render(
  <React.StrictMode>
  <StoreContext.Provider value={new RootStore()}>
    <App />
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

