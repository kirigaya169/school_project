import React from 'react';
import axios from 'axios';
import { observer } from 'mobx-react';
import {Typography, Box, CircularProgress} from '@material-ui/core'
import userStore from '../../store/userStore.js';
import UserCard from './userCard.js';
import serverHost from '../../config.js';

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

export default observer(function(props) {
    const [users, setUsers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const getUsers = async() => {
    axios.get(serverHost + 'api/user/', {
        headers: {
            'Authorization' : 'Baerar ' + userStore.token},
    }).then(data => {
        setUsers(data.data.users);
        setIsLoading(true);
    }).catch(e => {
        if (e.response.status == '403'){
            //console.log(userStore.user);
            userStore.setIsAuth(false);
        }
    })
        
    }
    React.useEffect(() => {
        //let mounted = true;
        getUsers();
        //return () => mounted = false;
    }, [])

    //console.log(isLoading);
    return (<div>
        <Typography variant="h3" component="h2" gutterBottom>
            Роли пользователей
        </Typography>
        <div style={{width: '100%'}}>
        {!isLoading ? <CircularProgress /> : 
            <Box display="flex" justifyContent="left" flexWrap="wrap">
                {users.map((user) => (
                    <UserCard user={user}/>
                ))}
            </Box>}
        </div>
    </div>)
})
