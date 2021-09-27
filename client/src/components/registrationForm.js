import React from 'react'
import {TextField, Button, Snackbar, MenuItem, FormControl, Select, InputLabel, Input, Chip, Box, Typography} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import axios from 'axios'
import {observer} from 'mobx-react'
import history from '../history.js';
import subjectStore from '../store/subjectStore.js';
import serverHost from '../config.js';
import userStore from '../store/userStore.js';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const RegistrationForm = observer(
    class RegistrationForm extends React.Component{

        static MIN_CLASS = 1;
        static MAX_CLASS = 11;

        constructor(props){
            super(props);
            this.subjects = [];
            this.handleInput = this.handleInput.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            //this.hadnleMenu = this.handleMenu.bind(this);
            this.successSend = this.successSend.bind(this);
            this.sendSubjects = this.sendSubjects.bind(this);
            this.handleSubject = this.handleSubject.bind(this);
            this.handleClass = this.handleClass.bind(this);
            
            this.state = {
                name: '',
                email: '',
                password: '',
                vk_ref: '',
                roles: '',
                subjects: [],
                all_subjects: [],
                error_text: '',
                succees_text: '',
                _class: 5,
                photo: null,
            }
            
            this.classes = [5, 6, 7, 8, 9, 10];
            axios.get(serverHost + 'api/subjects').then((response) =>{
                this.sendSubjects(response);
            });
            this.style = {
                marginBottom: '10px',
            }
            this.formStyle = {
                margin:'10px',
                minWidth: 70,
            }
            this.errorMessage = '';
            this.successMessage = '';
        }

        sendSubjects(response){
            //console.log('data', response.data);
            this.subjects = response.data.subjects;
            var subj = [];
            for (var i = 0; i < this.subjects.length; i++){
                subj.push(this.subjects[i].value);
            }
            this.setState({all_subjects: subj});
            //console.log("subjects", this.subjects);
        }

        successSend(response){
            //onsole.log("handle", this.context);
            //console.log(response.data);
            userStore.setUser(response.data.token);
            userStore.setIsAuth(true);
            //console.log("success", this.context);
            this.setState({succees_text: "Запись успешно создана"});
        }

        handleClass(event){
            this.setState({_class: event.target.value});
        }

        async handleSubmit(event){
            //console.log("submit", this.context);
            event.preventDefault();
            const formData = new FormData();
            var sendData = {
                'name': this.state.name,
                'email': this.state.email,
                'password': this.state.password,
                'vk_ref': this.state.vk_ref,
                'roles': this.state.roles,
                'subjects': this.state.subjects,
                '_class': this.state._class,
            }
            formData.append('name', this.state.name);
            formData.append('email', this.state.email);
            formData.append('password', this.state.password);
            formData.append('roles', this.state.roles);
            formData.append('subjects', this.state.subjects);
            formData.append('_class', this.state._class);
            formData.append('avatar', this.state.photo);
            //console.log("process", process.env.REACT_APP_SERVER_HOST);
            axios.post(serverHost + "api/user/registration", formData   
            ).then((response) => {
                this.successSend(response);
                
            }).catch((error) => {
                console.log("error", error);
                this.setState({error_text: error.response.data.data});
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

        handleMenu(event){
            this.setState({roles: event.target.value});
            //console.log("menu", this.state.roles[0]);
        }

        handleSubject(event){
            const { value: options } = event.target;
            //console.log(event);
            var value = [];
            for (var i = 0; i < options.length; i++){
                value.push(options[i]);
            }
            this.setState({
                subjects: value
            });
            //console.log(this.state);
        }

        handlePhoto(event){
            this.setState({photo: event.target.files[0]});
        }

        render(){
            //console.log(this.subjects);
            //console.log(process.env.REACT_APP_SERVER_HOST);
            //console.log("render", this.context);
            var classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            return (<form onSubmit={this.handleSubmit} >
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
                <Box textAlign="center" mt={2}  >
                    <Typography variant="h2" gutterBottom>
                        Sign in
                    </Typography>
                </Box>
                <Box textAlign="center" borderColor="grey.400" border={1} width="500px" px={2} pb={2} borderRadius={16} mx="auto">
                    
                    <div>
                        <TextField variant="outlined" margin="normal" style={{marginRight: 5, width: "49.5%"}} name="name" id="name" label="Имя" value={this.state.name} onChange={this.handleInput} />
                        <TextField variant="outlined" margin="normal" style={{width: "49.5%"}} name="email" id="email" label="Email" value={this.state.email} onChange={this.handleInput} />
                    </div>
                    <div>
                    <TextField variant="outlined" fullWidth margin="normal" style={this.style} name="password" id="password" label="Password" type="password" value={this.state.password} onChange={this.handleInput} />
                    </div>
                    <Box textAlign="start">
                    <div>
                        <FormControl variant="outlined" style={this.formStyle} id="class" >
                        <InputLabel id="class_label">Класс</InputLabel>
                        <Select labelId="class_label" label="Класс" style={this.style} value={this.state._class} onChange={this.handleClass}>
                            {classes.map((_class) => (
                                <MenuItem key={_class} value={_class}>{_class}</MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                    </div>
                    <Box display="flex" mb={2}>
                    <FormControl variant="outlined" style={{width: 150}} id="role" >
                    <InputLabel>Роль</InputLabel>
                    
                    <Select label="Роль" style={this.style} value={this.state.roles} onChange={this.handleMenu.bind(this)}>
                        <MenuItem value="USER">Ученик</MenuItem>
                        <MenuItem value="TEACHER">Учитель</MenuItem>
                    </Select>
                    </FormControl>
                    { (this.state.roles == "TEACHER") && 
                    <FormControl variant="outlined" id="subject" style={{marginLeft: 10, width: "100%"}}>
                    <InputLabel>Предметы</InputLabel>
                        <Select
                        label="Предмет"
                        autoWidth
                        
                        multiple
                        onChange={this.handleSubject}
                        value={this.state.subjects}
                        input={<Input/>}
                        renderValue= {(selected) => (
                            <div style={{display: "flex", flexWrap: "wrap"}}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </div>
                        )} >
                            {subjectStore.subjects.map((subject) => (
                                <MenuItem key={subject} value={subject}>
                                    {subject}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    }
                    </Box>
                    </Box>
                    <div>
                        <Button variant="contained" color="primary" type="submit">
                            Зарегистрироваться
                        </Button>
                    </div>
                </Box>
            </form>)
        }
})


export default RegistrationForm;
