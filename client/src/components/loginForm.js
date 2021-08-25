import React from 'react'
import {TextField, Button, Snackbar, Typography, Box } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import axios from 'axios'
import {observer} from 'mobx-react'
import history from '../history.js';
import serverHost from '../config.js';
import { withStyles} from '@material-ui/core/styles';
import userStore from '../store/userStore.js'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const styles = theme => ({
    root: {
        textAlign: 'center',
        marginTop: theme.spacing(4),
    },
    border: {
        border: "medium",
    },
    button: {
        width: "200px",
        backgroundColor: theme.backgroundColor,
    }
})

const LoginForm = observer(
    class LoginForm extends React.Component{

        constructor(props){
            console.log(props);
            super(props);
            
            
            this.state = {
                password: '',
                email: '',
                succees_text: '',
                error_text: '',
            }
            this.handleInput = this.handleInput.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.successSend = this.successSend.bind(this)
            
            this.errorMessage = '';
            this.successMessage = '';
        }

        successSend(response){
            userStore.setUser(response.data.token);
            userStore.setIsAuth(true);
            this.setState({succees_text: "Запись успешно создана"});
        }

        async handleSubmit(event){
            event.preventDefault();
            try{
                var data = await axios.post(serverHost + "api/user/login", this.state)
                userStore.setUser(data.data.token);
                userStore.setIsAuth(true);
                this.setState({succees_text: "Запись успешно создана"});
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
            const {classes} = this.props;
            return (<form className={classes.root} onSubmit={this.handleSubmit}>
            <Typography variant="h2" gutterBottom>
                Log in
            </Typography>
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
                <Box borderRadius={16} borderColor="grey.500" border={1} px={5} pb={2} m="auto" width="500px" >
                    <div>
                        <TextField fullWidth margin="normal"  name="email" id="email" label="E-mail" value={this.state.email} onChange={this.handleInput} />
                    </div>
                    <div>
                    <TextField fullWidth style={{marginBottom: 10}} margin="auto"   name="password" id="password" label="Password" type="password" value={this.state.password} onChange={this.handleInput} />
                    </div>
                    
                    
                    <Button className={classes.button} size="large" variant="contained" color="primary" type="submit">
                        Войти
                    </Button>
                </Box>
            </form>)
        }
})

export default withStyles(styles)(LoginForm);