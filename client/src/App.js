import {Container, Toolbar} from '@material-ui/core';
import RegistrationForm from './components/registrationForm.js';
import RequestForm from './components/requestForm.js';
import MainPage from './components/main.js';
import AdminPanel from './components/admin/index.js';
import {HashRouter, Switch, Route, Link, Redirect} from "react-router-dom";
import React from 'react';
import {UserContext} from './context.js';
import {observer, Provider} from 'mobx-react';  
import  LoginForm from './components/loginForm.js';
import history from './history.js';
import NavBar from './components/navBar.js';
import UserStore from './store/userStore.js';

export const App = observer( 
class App extends React.Component {
  static contextType = UserContext;
  constructor(){
    super();
  }
  render(){
    return (<div>
      <NavBar />
      <Container maxWidth="xl">
      <Toolbar />
        <HashRouter history={history}>
        <Switch>
            
            <Route path='/registration'>
              {!this.context.isAuth && <RegistrationForm />}
            </Route>
            <Route path='/login'>
            {!this.context.isAuth && <LoginForm />}
            </Route>
            <Route path='/request'>
            {this.context.isAuth && <RequestForm />} 
            </Route>
            <Route path='/admin'>
              {(this.context.isAuth && this.context.user.roles.includes("ADMIN")) && <AdminPanel />}
            </Route>
            <Route path='/'>
              <MainPage />
            </Route>
          </Switch>
        </HashRouter>
      </Container>
      </div>
    );
  }
  
})

export default App;
