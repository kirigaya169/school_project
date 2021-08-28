import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import SubjectStore from './store/subjectStore.js';
import UserStore from './store/userStore';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { HashRouter } from 'react-router-dom';
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(199, 142, 255)',
      contrastText: '#fff',
    }
  }
})

ReactDOM.render(
  <React.StrictMode>
  <HashRouter basename='/'>
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
    </MuiPickersUtilsProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

