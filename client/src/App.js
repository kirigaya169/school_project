import {Container, Toolbar} from '@material-ui/core';
import RegistrationForm from './components/registrationForm.js';
import RequestForm from './components/requestForm.js';
import MainPage from './components/main.js';
import AdminPanel from './components/admin/index.js';
import {HashRouter, Switch, Route, Link, Redirect} from "react-router-dom";
import React from 'react';
import {observer, Provider} from 'mobx-react';  
import  LoginForm from './components/loginForm.js';
import history from './history.js';
import NavBar from './components/navBar.js';
import UserStore from './store/userStore.js';
import {Button} from '@material-ui/core';
import userStore from './store/userStore.js';
import axios from 'axios';
import serverHost from './config.js';
import userCard from './components/admin/userCard.js';

export const App = observer( 
() => {
    React.useEffect(async() => {
      console.log(userStore);
      axios.get(serverHost + 'api/user/check', {headers: {
        "Authorization" : "Baerar " + userStore.token,
      }}).then(data => {
        userStore.setUser(data.data.token);
      }).catch(e => {
        console.log(e.response) ;
      });
    }, [])
    console.log("a", userStore);
    return (<div>
      <NavBar />
      <Container maxWidth="xl">
      <Toolbar />
        <Switch>
            
            <Route path='/registration'>
              {!userStore.isAuth ? <RegistrationForm /> : <Redirect to="/" />}
            </Route>
            <Route path='/login'>
            {!userStore.isAuth ? <LoginForm /> : <Redirect to="/" />}
            </Route>
            <Route path='/request'>
            {userStore.isAuth ? <RequestForm /> : <Redirect to="/" />} 
            </Route>
            <Route path='/admin'>
              {(userStore.isAuth && userStore.user.roles.includes("ADMIN")) ? <AdminPanel /> : <Redirect to="/" />}
            </Route>
            <Route path='/'>
              <MainPage />
            </Route>
          </Switch>
      </Container>
      </div>
    );
  })

export default App;
