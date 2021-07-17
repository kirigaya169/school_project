import {Container} from '@material-ui/core'
import RegistrationForm from './components/registrationForm.js'
import RequestForm from './components/requestForm.js'
import {Router, Switch, Route, Link, Redirect} from "react-router-dom"
import React from 'react'
import StoreContext from './context.js'
import {observer, Provider} from 'mobx-react';  
import  LoginForm from './components/loginForm.js';
import history from './history.js';
import NavBar from './components/navBar.js'

export const App = observer( 
class App extends React.Component {
  static contextType = StoreContext;
  constructor(){
    super();
  }
  render(){
    console.log(this.context.userStore);
    return (
      <Container maxWidth="xl">
      <NavBar />
        <Router history={history}>
        <Switch>
            <Route path='/user/registration'>
              {!this.context.userStore.isAuth && <RegistrationForm />}
            </Route>
            <Route path='/user/login'>
            {!this.context.userStore.isAuth && <LoginForm />}
            </Route>
            <Route path='/request'>
            {this.context.userStore.isAuth && <RequestForm />} 
            </Route>
          </Switch>
        </Router>
      </Container>
    );
  }
  
})

export default App;
