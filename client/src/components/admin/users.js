import React from 'react';
import axios from 'axios';
import { observer } from 'mobx-react';
import {Typography, Box, CircularProgress} from '@material-ui/core'
import {UserContext} from '../../context.js'
import UserCard from './userCard.js';

export default observer(function(props) {
    const context = React.useContext(UserContext);
    const [users, setUsers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const getUsers = async(mounted) => {
        if (!mounted){
            return;
        }
        console.log(context.token);
        try{
            var data = await axios.get(process.env.REACT_APP_SERVER_HOST + 'api/user/', {
                headers: {
                    'Authorization' : 'Baerar ' + context.token},
            })
            console.log(data.data.users);
            setUsers(data.data.users);
        }
        catch(e){
            if (e.response.status == '403'){
                console.log(context.user);
                context.setIsAuth(false);
            }
        }
    }
    React.useEffect(() => {
        setIsLoading(true);
        console.log("start");
        let mounted = true;
        getUsers(mounted);
        setIsLoading(false);
        console.log("stop");
        return () => mounted = false;
    }, [])

    console.log('render');
    return (<div>
        <Typography variant="h3" component="h2" gutterBottom>
            Роли пользователей
        </Typography>
        <div style={{width: '100%'}}>
        {isLoading ? <CircularProgress /> : 
            <Box display="flex" justifyContent="left" flexWrap="wrap">
                {users.map((user) => (
                    <UserCard user={user}/>
                ))}
            </Box>}
        </div>
    </div>)
})
