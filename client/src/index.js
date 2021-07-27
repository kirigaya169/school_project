import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import SubjectStore from './store/subjectStore.js';
import UserStore from './store/userStore';
import {UserContext } from './context.js';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

ReactDOM.render(
  <React.StrictMode>
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <UserContext.Provider value={new UserStore()}>
        <App />
      </UserContext.Provider>
    </MuiPickersUtilsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

