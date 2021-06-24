import React from 'react'
import {TextField, Button, Snackbar} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import axios from 'axios'
import {observer} from 'mobx-react'
import StoreContext from '../context.js';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const RegistrationForm = observer(
    class RegistrationForm extends React.Component{

        constructor(props, context){
            super(props, context);
            console.log(this.context);
            
            this.state = {
                name: '',
                email: '',
                password: '',
                vk_ref: '',
                login: '',
                error_text: '',
                succees_text: '',
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
        }

        handleSubmit(event){
            console.log("submit", this.context);
            event.preventDefault();
            console.log(this.state);
            console.log(process.env.REACT_API_SERVER_HOST);
            axios.post('http://127.0.0.1:8000/'+ "api/user/registration", this.state).then((response) => {
                this.successSend(response);
                
            }).catch((error) => {
                console.log("error", error);
                console.log(error.response.data);
                this.setState({error_text: error.response.data});
                this.errorMessage = error.response.data;
            })
            
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
                    <TextField style={this.style} name="name" id="name" label="Name" value={this.state.name} onChange={this.handleInput} />
                    <TextField style={this.style} name="login" id="login" label="Login" value={this.state.login} onChange={this.handleInput} />
                    <TextField style={this.style} name="email" id="email" label="Email" value={this.state.email} onChange={this.handleInput} />
                </div>
                <div>
                <TextField style={this.style} name="password" id="password" label="Password" type="password" value={this.state.password} onChange={this.handleInput} />
                <TextField style={this.style} name="vk_ref" id="email" label="Contacts" value={this.state.vk_ref} onChange={this.handleInput} />
                </div>
                
                
                <Button variant="contained" color="primary" type="submit">
                    Зарегестрироваться
                </Button>
            </form>)
        }
})

RegistrationForm.contextType = StoreContext;

export default RegistrationForm;