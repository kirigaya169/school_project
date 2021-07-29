import React from 'react';
import {Card, Typography, CardContent, CardActions, Box, Chip, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import {UserContext} from '../../context.js'

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    },

})

export default function UserCard(props){
    const classes = useStyles();
    const context = React.useContext(UserContext);
    console.log(context.token);
    const user = props.user;
    const [isAdmin, setIsAdmin] = React.useState(user.roles.includes("ADMIN"));
    const changeAdminRole = async() => {
        try{
            console.log("token", context.token);
            const data = await axios.post(process.env.REACT_APP_SERVER_HOST + 'api/user/change_role', {email: user.email},
            {
                headers: {
                    'Authorization': 'Baerar ' + context.token,
                }
            });
            setIsAdmin(data.data.data);
            console.log(isAdmin);
        }
        catch(e) {
            console.log(e.response);
            if (e.response.status == "403"){
            
            }
        }
    }
    console.log("isAdmin", isAdmin);
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
}