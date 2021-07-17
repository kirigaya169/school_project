import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import Link from '@material-ui/core/Link'
import AddIcon from '@material-ui/icons/Add';
import history from '../history.js'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
                <Link color='inherit' onClick={() => {
                    history.push('/');
                }}>Главная</Link>
          </Typography>
          <div>
          <IconButton className={classes.title}aria-label="подать заявку" style={{color: 'white'}} onClick={() => {
                history.push('/request');
            }}>
                <AddIcon />
            </IconButton>
          <Button color="inherit" onClick={() => {
              history.push('user/login');
          }}>Login</Button>
          </div>
            
        </Toolbar>
      </AppBar>
    </div>
  );
}