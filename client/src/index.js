import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import SubjectStore from './store/subjectStore.js';
import UserStore from './store/userStore';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { HashRouter } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
  <HashRouter basename='/'>
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <App />
    </MuiPickersUtilsProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

