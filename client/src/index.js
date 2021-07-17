import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import RootStore from './store/indexStore.js';
import StoreContext from './context.js';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

ReactDOM.render(
  <React.StrictMode>
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <StoreContext.Provider value={new RootStore()}>
      <App />
      </StoreContext.Provider>
    </MuiPickersUtilsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

