import {Container, Toolbar} from '@material-ui/core';
import RegistrationForm from './components/registrationForm.js';
import RequestForm from './components/requestForm.js';
import MainPage from './components/main.js';
import AdminPanel from './components/admin/index.js';
import {Router, Switch, Route, Link, Redirect} from "react-router-dom";
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
        <Router history={history}>
        <Switch>
            
            <Route path='/school_project/registration'>
              {!this.context.isAuth && <RegistrationForm />}
            </Route>
            <Route path='/school_project/login'>
            {!this.context.isAuth && <LoginForm />}
            </Route>
            <Route path='/school_project/request'>
            {this.context.isAuth && <RequestForm />} 
            </Route>
            <Route path='/school_project/admin'>
              {(this.context.isAuth && this.context.user.roles.includes("ADMIN")) && <AdminPanel />}
            </Route>
            <Route path='/school_project/'>
              <MainPage />
            </Route>
          </Switch>
        </Router>
      </Container>
      </div>
    );
  }
  
})

export default App;
