import React from 'react'
import {TextField, Button, Snackbar} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import axios from 'axios'
import {observer} from 'mobx-react'
import StoreContext from '../context.js';
import history from '../history.js'

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
                username: '',
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
            console.log("handle", this.context);
            console.log(response.data);
            this.context.userStore.setUser(response.data.token);
            this.context.userStore.setIsAuth(true);
            console.log("success", this.context);
            this.setState({succees_text: "Запись успешно создана"});
            history.push('/');
        }

        async handleSubmit(event){
            console.log("submit", this.context);
            event.preventDefault();
            console.log(this.state);
            console.log(process.env.REACT_API_SERVER_HOST);
            try{
            var data = await axios.post(process.env.REACT_APP_SERVER_HOST + "api/user/login", this.state)
            console.log("data", data);
            this.context.userStore.setUser(data.data.token);
            this.context.userStore.setIsAuth(true);
            console.log("success", this.context);
            this.setState({succees_text: "Запись успешно создана"});
            history.push('/');
            }
            catch(e){
                var json = JSON.parse(e.request.response);
                console.log(json.data);
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
            console.log("render", this.context);
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
                    <TextField style={this.style} name="username" id="login" label="Login" value={this.state.username} onChange={this.handleInput} />
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

LoginForm.contextType = StoreContext;

export default LoginForm;