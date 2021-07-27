import React from 'react'
import {Drawer, Toolbar, List, ListItem, ListItemText, ListItemIcon} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import UserView from './users.js'
import {UserContext} from '../../context.js';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    }
}));

export default function AdminPanel(){
    const classes = useStyles();
    console.log('admin');
    var style = {
        zIndex: 0,
    }
    return(
        <div className={classes.root}>
        <Drawer
        className={classes.drawer}
        classes={{
            paper: classes.drawerPaper,
        }}
        variant="permanent">
        <div style={{
            zIndex: 0,
        }}>
            <Toolbar />
            <div className={classes.drawerContainer}>
            <List>
                <ListItem button>
                    <ListItemIcon><AccountCircleIcon /> </ListItemIcon>
                    <ListItemText>Пользователи</ListItemText>
                </ListItem>
                <ListItem button>
                    <ListItemIcon><NotificationsIcon /> </ListItemIcon>
                    <ListItemText>Заявки</ListItemText>
                </ListItem>
            </List>
            </div>
            </div>
        </Drawer>
        <UserView />
    </div>
    );
}