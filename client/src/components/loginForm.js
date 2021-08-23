import React from 'react'
import {TextField, Button, Snackbar} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import axios from 'axios'
import {observer} from 'mobx-react'
import {UserContext} from '../context.js';
import history from '../history.js';
import serverHost from '../config.js'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const LoginForm = observer(
    class LoginForm extends React.Component{

        constructor(props, context){
            console.log(props);
            super(props, context);
            
            
            this.state = {
                password: '',
                email: '',
                succees_text: '',
                error_text: '',
            }
            this.handleInput = this.handleInput.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.successSend = this.successSend.bind(this)
            this.style = {
                margin: '10px',
            }
            this.errorMessage = '';
            this.successMessage = '';
        }

        successSend(response){
            this.context.setUser(response.data.token);
            this.context.setIsAuth(true);
            this.setState({succees_text: "Запись успешно создана"});
        }

        async handleSubmit(event){
            event.preventDefault();
            try{
                var data = await axios.post(serverHost + "api/user/login", this.state)
                this.context.setUser(data.data.token);
                this.context.setIsAuth(true);
                this.setState({succees_text: "Запись успешно создана"});
                history.push('/');
            }
            catch(e){
                console.log("error", e);
                var json = JSON.parse(e.request.response);
                this.setState({error_text: json.data});
            }
        }

        handleInput(event){
            var target = event.target;
            var value = target.value;
            var name = target.name;
            this.setState({
                [name]: value
            })
        }

        render(){
            return (<form  onSubmit={this.handleSubmit}>
                <Snackbar open={this.state.error_text !== ''} autoHideDuration={6000} onClose={(event, reason) => {
                    if (reason === 'clickaway') {
                return;
                }
                this.setState({
                    error_text: '',
                });
                }}>
                    <Alert severity="error">
                    {this.state.error_text}
                    </Alert>
                </Snackbar>
                <div>
                    <TextField style={this.style} name="email" id="email" label="E-mail" value={this.state.email} onChange={this.handleInput} />
                </div>
                <div>
                <TextField style={this.style} name="password" id="password" label="Password" type="password" value={this.state.password} onChange={this.handleInput} />
                </div>
                
                
                <Button variant="contained" color="primary" type="submit">
                    Войти
                </Button>
            </form>)
        }
})

LoginForm.contextType = UserContext;

export default LoginForm;