import React from 'react';
import { Card, 
    Box, CardContent, CardActions, Typography, Button, Dialog, DialogTitle, 
    DialogContent, DialogContentText, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import axios from 'axios';
import userStore from '../../store/userStore';
import serverHost from '../../config';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    }, 
    formControl: {
        minWidth: 200,
    }
})

const RequestDialog = function(props){
    const classes = useStyles();
    const {onClose, open, request, setOpen, setIsDeleted} = props;
    const [accept, setAccept] = React.useState(true);
    const [teacher, setTeacher] = React.useState('');
    const [teachers, setTeachers] = React.useState([]);

    React.useEffect(async() => {
        try{
            const data = await axios.get(serverHost + 'api/user/subject', {params: {subject: request.subject}});
            setTeachers(data.data);
        }
        catch(e){
            console.log(e);
            if (e.response.status == '403'){
                userStore.setIsAuth(false);
            }
        }
    }, []);

    const handleClose = () => {
        onClose();
    }

    const onReject = async() => {
        try{
            const data = await axios.post(serverHost + 'api/requests/reject', null,
            {
                params: {
                    id: request._id,
                },
                headers: {
                    'Authorization': 'Baerar ' + userStore.token,
                }
            });
            setOpen(false);
            setIsDeleted(true);
        }
        catch(e){
            console.log(e);
            if (e.response.status == '403'){
                userStore.setIsAuth(false);
            }
        }
    }

    const onAccept = () => {
        setAccept(!accept);
    }

    const onChange = (e) => {
        setTeacher(e.target.value);
    }

    const onAcceptButton = async() => {
        //console.log(serverHost);
        try{
            const data = axios.post(serverHost + 'api/requests/accept', {email: teacher}, {
                params:{
                    id: request._id,
                },
                headers: {
                    'Authorization': 'Baerar ' + userStore.token,
                }
            })
            
            setOpen(false);
            setIsDeleted(true);
        }
        catch(e){
            console.log(e);
            if (e.response.status == '403'){
                userStore.setIsAuth(false);
            }
        }
    }
    
    //console.log(onReject);
    return (<Dialog onClose={handleClose} aria-labelledby="title" open={open}>
        <DialogTitle id="title">
            {request.title}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                Описание: {request.description}
            </DialogContentText>
            {!accept && <FormControl className={classes.formControl}>
                <InputLabel id="choose_label">Выбирите преподавателя</InputLabel>
                <Select
                labelId="choose_label"
                value={teacher}
                onChange={onChange}>
                    {teachers.map((tch) => (
                        <MenuItem value={tch.email}>{tch.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>}
        </DialogContent>
        <DialogActions>
        {accept ? (<div>
            <Button onClick={onReject} color="secondary">
                Отклонить
            </Button>
            <Button onClick={onAccept} color="primary">
                Принять
            </Button></div>) : <div>
                <Button onClick={onAccept}>
                    Отмена
                </Button>
                <Button onClick={onAcceptButton} color="primary">
                    Выбрать
                </Button>
            </div>}
        </DialogActions>
    </Dialog>)
}

export default observer(function RequestCard(props){
    const classes = useStyles();
    const {request} = props;
    const date = new Date(request.date);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [isDeleted, setIsDeleted] = React.useState(false);
    const time_options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      };

    const handleClose = () => {
        setDialogOpen(false);
    }
    
    return (<div>{isDeleted ? null :
        <Box m={2}>
            <Card className={classes.root}>
                <CardContent>
                    <Typography component="h2" variant="h5" gutterBottom>{request.title}</Typography>
                    <Typography className={classes.title} color="textSecondary">
                        {`Дата: ${date.toLocaleString(time_options)}`}  
                    </Typography>
                    <Typography className={classes.title} color="textSecondary">
                        Предмет: {request.subject}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary">
                        Автор: {request.author}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => {
                        setDialogOpen(true);
                    }}>Подробнее</Button>
                </CardActions>
            </Card>
            <RequestDialog setIsDeleted={setIsDeleted} setOpen={setDialogOpen}  open={dialogOpen} onClose={handleClose} request={request}/>
        </Box>}
        </div>
    );
})