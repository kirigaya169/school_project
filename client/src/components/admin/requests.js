import React from 'react';
import { Typography, Box, CircularProgress } from '@material-ui/core';
import userStore from '../../store/userStore';
import { observer } from 'mobx-react';
import axios from 'axios';
import RequestCard from './requestCard';
import serverHost from '../../config';

export default observer( function RequestsView(){
    const [requests, setRequests] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const getRequests = async() => {
        axios.get(serverHost + 'api/requests/', {
            headers: {
                'Authorization': 'Baerar ' + userStore.token,
            }
        }).then(data => {
            setRequests(data.data.requests);
            setIsLoading(true);
        }).catch(e => {
            console.log(e);
            if (e.response.status == '403'){
                userStore.setIsAuth(false);
            }
        })
    }

    React.useEffect(() => {
        getRequests();
    }, []);

    return (
        <div>
            <Typography variant="h3" gutterBottom>
                Заявки
            </Typography>
            {!isLoading && <CircularProgress />}
            <Box display="flex" justifyContent="left" flexWrap="wrap">
                {requests.map((request) => (
                    <RequestCard request={request}/>
                ))}
            </Box>
        </div>
    )
})