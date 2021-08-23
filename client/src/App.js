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
import {Button} from '@material-ui/core'

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
        <Switch>
            
            <Route path='/registration'>
              {!this.context.isAuth ? <RegistrationForm /> : <Redirect to="/" />}
            </Route>
            <Route path='/login'>
            {!this.context.isAuth ? <LoginForm /> : <Redirect to="/" />}
            </Route>
            <Route path='/request'>
            {this.context.isAuth ? <RequestForm /> : <Redirect to="/" />} 
            </Route>
            <Route path='/admin'>
              {(this.context.isAuth && this.context.user.roles.includes("ADMIN")) ? <AdminPanel /> : <Redirect to="/" />}
            </Route>
            <Route path='/'>
              <MainPage />
            </Route>
          </Switch>
      </Container>
      </div>
    );
  }
  
})

export default App;
