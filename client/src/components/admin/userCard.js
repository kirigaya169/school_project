import React from 'react';
import {Card, Typography, CardContent, CardActions, Box, Chip, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import userStore from '../../store/userStore.js';
import { observer } from 'mobx-react'
import serverHost from '../../config.js';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    },

})

export default observer(function UserCard(props){
    const classes = useStyles();
    const user = props.user;
    const [isAdmin, setIsAdmin] = React.useState(user.roles.includes("ADMIN"));
    const changeAdminRole = async() => {
        try{
            const data = await axios.post(serverHost + 'api/user/change_role', {email: user.email},
            {
                headers: {
                    'Authorization': 'Baerar ' + userStore.token,
                }
            });
            setIsAdmin(data.data.data);
        }
        catch(e) {
            console.log(e.response);
            if (e.response.status == "403"){
                userStore.setIsAuth(false);
            }
        }
    }
    return (
    <Box m={1}>
        <Card className={classes.root}>
            <CardContent>
                <Typography component="h2" variant="h5" gutterBottom>
                    {user.name} {isAdmin && <Chip size="small" label="Админ"/>}
                </Typography>
                <Typography component="h3" gutterBottom>
                    {user.roles.includes("TEACHER") ? "Учитель" : "Ученик"}
                </Typography>
                <Typography classes={classes.title} color="textSecondary">
                    Информация:
                </Typography>
                <Typography classes={classes.title} color="textSecondary">
                    Класс: {user.class}
                </Typography>
                <Typography classes={classes.title} color="textSecondary">
                    Почта: {user.email}
                </Typography>
            </CardContent>
            <CardActions>
                <Button 
                    size="small"
                    color="primary"
                    onClick={changeAdminRole}
                    >
                    {isAdmin ? "Удалить роль админа" : "Сделать админом"}
                    </Button>
            </CardActions>
        </Card>
    </Box>
    )
})