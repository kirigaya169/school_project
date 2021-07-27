import React from 'react';
import {Card, Typography, CardContent, CardActions, Box} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
    console.log(props);
    return (
    <Box m={1}>
        <Card className={classes.root}>
            <CardContent>
                <Typography component="h2" variant="h5" gutterBottom>
                    Имя
                </Typography>
                <Typography classes={classes.title} color="textSecondary">
                    Информация:
                </Typography>
                <Typography classes={classes.title} color="textSecondary">
                    Класс: 5
                </Typography>
                <Typography classes={classes.title} color="textSecondary">
                    Имя: абоба
                </Typography>
            </CardContent>
        </Card>
    </Box>
    )
}