import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import SubjectStore from './store/subjectStore.js';
import UserStore from './store/userStore';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { HashRouter } from 'react-router-dom';
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles'

const theme = createMuiTheme({
  backgroundColor: "rgb(199, 142, 255)",
})

ReactDOM.render(
  <React.StrictMode>
  <HashRouter basename='/'>
  <ThemeProvider theme={theme}>
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <App />
    </MuiPickersUtilsProvider>
    </ThemeProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

