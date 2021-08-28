import React from "react";
import { Badge, IconButton, Popper, Typography, makeStyles, Paper, List, ListItem, 
    ClickAwayListener, Fade, Box, ListItemText, Divider, Button } from "@material-ui/core";
import NotificationsIcon from '@material-ui/icons/Notifications';
import userStore from "../store/userStore";
import { observer, inject } from "mobx-react";
import { useSnackbar } from "notistack";
import { autorun } from "mobx";
import axios from "axios";
import serverHost from "../config";

const useStyles = makeStyles(theme => ({
    popper: {
        zIndex: theme.zIndex.tooltip + 100,
        width: 600,
        textAlign: 'center',
        padding: theme.spacing(2),
    },
    list: {
        overflow: 'auto',
        maxHeight: 600,
    }
}))

var displayed = [];

const Alert = observer(() => {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const storeDisplayed = (id) => {
        displayed = [...displayed, id];
    };
    const action = key => (
        <React.Fragment>
            <Button onClick={() => {closeSnackbar(key)}} style={{color: 'white'}}>Закрыть</Button>
        </React.Fragment>
    );
    autorun(() => {
        //console.log("alerts");
    //console.log("snackbars", userStore.snackbars, userStore.snackbars.length);
    userStore.snackbars.forEach(snackbar => {
        //console.log(snackbar.key, displayed);
        if (displayed.includes(snackbar.key)) return;
        //console.log("aboba", snackbar);
        enqueueSnackbar(snackbar.message, {...snackbar.options, action});
        storeDisplayed(snackbar.key);
        userStore.removeSnackbar(snackbar.key);
    });
    //userStore.setSnackbars([]);
    })
    
    
    return (null);
})

export default observer(function NotificationView(){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(true);
    const classes = useStyles();

    const onButton = e => {
        axios.post(serverHost + 'api/user/read', {}, {
            headers: {
                "Authorization": "Baerar " + userStore.token,
            }
        }).then(data => {}).catch(e => {console.log(e)});
        userStore.setCount(0);
        setAnchorEl(e.currentTarget);
        setOpen(!open);
        if (!open) setAnchorEl(null);
    }

    const onClose = e => {
        setAnchorEl(null);
    }

    const onClickAway = e => {
        //console.log(open, anchorEl);
        if (open) return;
        setAnchorEl(null);
        setOpen(true);
    }

    const dateString = m => {
        var dateString =
        m.getUTCFullYear() + "/" +
        ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
        ("0" + m.getUTCDate()).slice(-2) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2);
        return dateString;
    }

    return(
        <React.Fragment>
        <ClickAwayListener onClickAway={onClickAway}>
        <Box display="inline">
        <IconButton onClick={onButton} style={{color: 'white'}}>
            <Badge color="secondary" badgeContent={userStore.count} max={99}>
                <NotificationsIcon />
            </Badge>
        </IconButton>
        
            <Popper
            className={classes.popper}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            transition
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            onClose={onClose}>
            {({TransitionProps}) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                        <List className={classes.list}>
                        {userStore.notifications.slice().reverse().map(elem => (
                            <React.Fragment>
                                <ListItem button>
                                    <ListItemText primary={elem.text}
                                    secondary={dateString(new Date(elem.date))}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                            
                        </List>
                    </Paper>
                </Fade>
            )}
            
            </Popper>
            </Box>
        </ClickAwayListener>
        <Alert />
        </React.Fragment>
    )
})