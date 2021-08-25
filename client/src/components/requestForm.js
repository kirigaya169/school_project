import React, { useContext } from 'react';
import axios from 'axios';
import {observer} from 'mobx-react';
import {TextField, FormControl, Select, InputLabel, MenuItem, Button, Snackbar, Box, Typography, Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {DateTimePicker} from '@material-ui/pickers';
import MuiAlert from '@material-ui/lab/Alert';
import subjectStore from '../store/subjectStore.js';
import serverHost from '../config.js';
import userStore from '../store/userStore.js';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  field: {
    marginTop: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(1),
  }
}));

var RequestForm = observer(function(props){
    const classes = useStyles();
    var dt = new Date();
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
              'Authorization': 'Baerar ' + userStore.token, 
            }
          });
          setMessage(data.data.data);
        }
        catch(e){
          if (e.response.status == "403"){
            userStore.setIsAuth(false);
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
        <Box textAlign="center">
        <Typography variant="h2">
          Подать заявку
        </Typography>
        <Box mt={3} border={1} borderColor="grey.300" width="30%" mx="auto" borderRadius={20} p={3}>
        <div>
          <TextField fullWidth label="Тема" value={theme} onChange={(e) => {
            //console.log(e);
            setTheme(e.target.value);
          }}></TextField>
          </div>
          <div>
          <TextField fullWidth multiline   label="Описание" value={description} onChange={(e) => {
            setDescription(e.target.value);
          }}></TextField>
          </div>
          <Grid container spacing={3}>
          <Grid className={classes.field} item xs={6}>
          <FormControl fullWidth>
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
          
          </Grid>
          <Grid  item xs={6}>
          <DateTimePicker
          style={{marginTop: 24}}
          fullWidth
          margin="auto"
          clearable
          value={date}
          onChange={setDate}>
          </DateTimePicker>
          </Grid>
          </Grid>
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={sendData}
              >
              Отправить
            </Button>
            </Box>
          </Box>
        </form>
      );
});

export default RequestForm;
