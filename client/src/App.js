import {Container} from '@material-ui/core'
import RegistrationForm from './components/registrationForm.js'
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom"
import React from 'react'
import StoreContext from './context.js'
import {observer} from 'mobx-react';  

export const App = observer( 
class App extends React.Component {
  static contextType = StoreContext;
  constructor(){
    super();
  }
  render(){
    return (
      <Container maxWidth="xl">
      <Router>
      <Switch>
          <Route path='/user/registration'>
            {this.context.userStore.isAuth ? <Redirect to='/' /> : <RegistrationForm />}
          </Route>
        </Switch>
      </Router>
        
      </Container>
    );
  }
  
})

export default App;
