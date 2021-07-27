import React from 'react'
import {TextField, Button, Snackbar, MenuItem, FormControl, Select, InputLabel, Input, Chip} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import axios from 'axios'
import {observer} from 'mobx-react'
import {UserContext, SubjectContext} from '../context.js';
import history from '../history.js'
import subjectStore from '../store/subjectStore.js'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const RegistrationForm = observer(
    class RegistrationForm extends React.Component{

        static MIN_CLASS = 5;
        static MAX_CLASS = 11;

        constructor(props, context){
            super(props, context);
            //console.log(this.context);
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
            axios.get(process.env.REACT_APP_SERVER_HOST + 'api/subjects').then((response) =>{
                this.sendSubjects(response);
            });
            this.style = {
                margin: '10px',
            }
            this.formStyle = {
                margin:'10px',
                minWidth: 120,
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
            this.context.setUser(response.data.token);
            this.context.setIsAuth(true);
            //console.log("success", this.context);
            this.setState({succees_text: "Запись успешно создана"});
            history.push('/');
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
            formData.append('vk_ref', this.state.vk_ref);
            formData.append('roles', this.state.roles);
            formData.append('subjects', this.state.subjects);
            formData.append('_class', this.state._class);
            formData.append('avatar', this.state.photo);
            for (let [key, value] of formData.entries()) { 
                console.log(key, value);
              }
            //console.log("process", process.env.REACT_APP_SERVER_HOST);
            axios.post(process.env.REACT_APP_SERVER_HOST + "api/user/registration", formData
            ).then((response) => {
                this.successSend(response);
                
            }).catch((error) => {
                console.log("error", error);
                console.log(error.response.data.data);
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
            console.log(this);
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
            var classes = [5, 6, 7, 8, 9, 10];
            console.log(this.context);
            return (<form  onSubmit={this.handleSubmit} >
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
                    <TextField style={this.style} name="email" id="email" label="Email" value={this.state.email} onChange={this.handleInput} />
                </div>
                <div>
                <TextField style={this.style} name="password" id="password" label="Password" type="password" value={this.state.password} onChange={this.handleInput} />
                <TextField style={this.style} name="vk_ref" id="email" label="Contacts" value={this.state.vk_ref} onChange={this.handleInput} />
                </div>
                <div>
                    <FormControl style={this.formStyle} id="class" >
                    <InputLabel>Класс</InputLabel>
                    <Select style={this.style} value={this.state._class} onChange={this.handleClass}>
                        {classes.map((_class) => (
                            <MenuItem key={_class} value={_class}>{_class}</MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                </div>
                <FormControl style={this.formStyle} id="role" >
                <InputLabel>Роль</InputLabel>
                <Select style={this.style} value={this.state.roles} onChange={this.handleMenu.bind(this)}>
                    <MenuItem value="USER">Ученик</MenuItem>
                    <MenuItem value="TEACHER">Учитель</MenuItem>
                </Select>
                </FormControl>
                { (this.state.roles == "TEACHER") && 
                <FormControl id="subject" style={this.formStyle}>
                    <Select
                    multiple
                    onChange={this.handleSubject}
                    value={this.state.subjects}
                    input={<Input/>}
                    renderValue= {(selected) => (
                        <div >
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
                
                <Button variant="contained" color="primary" type="submit">
                    Зарегестрироваться
                </Button>

            </form>)
        }
})

RegistrationForm.contextType = UserContext;

export default RegistrationForm;