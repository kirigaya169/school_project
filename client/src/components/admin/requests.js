import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { UserContext } from '../../context';
import { observer } from 'mobx-react';
import axios from 'axios';
import RequestCard from './requestCard';
import serverHost from '../../config';

export default observer( function RequestsView(){
    const context = React.useContext(UserContext);
    const [requests, setRequests] = React.useState([]);

    const getRequests = async(mounted) => {
        if (!mounted){
            return;
        }
        try{
            const data = await axios.get(serverHost + 'api/requests/', {
                headers: {
                    'Authorization': 'Baerar ' + context.token,
                }
            });
            setRequests(data.data.requests);
        }
        catch(e){
            console.log(e);
            if (e.response.status == '403'){
                context.setIsAuth(false);
            }
        }
    }

    React.useEffect(() => {
        let mounted = true;
        getRequests(mounted);
        return () => mounted = false;
    }, []);

    return (
        <div>
            <Typography variant="h3" gutterBottom>
                Заявки
            </Typography>
            <Box display="flex" justifyContent="left" flexWrap="wrap">
                {requests.map((request) => (
                    <RequestCard request={request}/>
                ))}
            </Box>
        </div>
    )
})