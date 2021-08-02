import React, { useContext } from 'react';
import axios from 'axios';
import {observer} from 'mobx-react';
import {TextField, FormControl, Select, InputLabel, MenuItem, Button, Snackbar} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {DateTimePicker} from '@material-ui/pickers';
import {UserContext} from '../context.js';
import MuiAlert from '@material-ui/lab/Alert';
import subjectStore from '../store/subjectStore.js';
import serverHost from '../config.js';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

var RequestForm = observer(function(props){
    const classes = useStyles();
    var dt = new Date();
    var context = useContext(UserContext);
    const [theme, setTheme] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [date, setDate] = React.useState(new Date(dt.getFullYear(), dt.getMonth(), dt.getDay(), dt.getHours(), dt.getMinutes()));
    const [message, setMessage] = React.useState('');
    //var defaultDate = dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDay() + ' ' + dt.getHours() + ':' + dt.getMinutes();
    
    var sendData = async () => {
        var formData = new FormData();
        formData.append('title', theme);
        formData.append('description', description);
        formData.append('subject', subject);
        formData.append('date', date);
        try{
          var data = await axios.post(serverHost + 'api/requests/', formData, {
            headers: {
              'Authorization': 'Baerar ' + context.token, 
            }
          });
          setMessage(data.data.data);
        }
        catch(e){
          if (e.response.status == "403"){
            context.setIsAuth(false);
          }
          console.log(e);
        }
        
    }

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setMessage('');
    };

    return (
        <form className={classes.root} noValidate>
        <Snackbar open={message} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {message}
        </Alert>
        </Snackbar>
        <div>
          <TextField label="Тема" value={theme} onChange={(e) => {
            //console.log(e);
            setTheme(e.target.value);
          }}></TextField>
          </div>
          <div>
          <TextField multiline   label="Описание" value={description} onChange={(e) => {
            setDescription(e.target.value);
          }}></TextField>
          </div>
          <div>
          <FormControl>
          <InputLabel id="subject">Предмет</InputLabel>
            <Select
            labelId="subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
            }}
            >
            {subjectStore.subjects.map((subject) => (
              <MenuItem key={subject} value={subject}>{subject}</MenuItem>
            ))}
            </Select>
          </FormControl>
          </div>
          <div>
          <DateTimePicker
          clearable
          value={date}
          onChange={setDate}>

          </DateTimePicker>
          </div>
            <Button
              color="primary"
              variant="contained"
              onClick={sendData}
              >
              Отправить
            </Button>
        </form>
      );
});

export default RequestForm;
