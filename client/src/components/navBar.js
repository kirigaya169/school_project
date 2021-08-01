import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import Link from '@material-ui/core/Link'
import AddIcon from '@material-ui/icons/Add';
import AccountCircle from '@material-ui/icons/AccountCircle';
import history from '../history.js'
import SettingsIcon from '@material-ui/icons/Settings';
import { Menu, MenuItem } from '@material-ui/core';
import { UserContext } from '../context.js';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1300,
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
  const context = React.useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  }

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  }

  return (
      <AppBar position="fixed" className={classes.root}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
                <Link color='inherit' onClick={() => {
                    history.push('/');
                }}>Главная</Link>
          </Typography>
          <div>

            {(context.isAuth && context.user.roles.includes("ADMIN")) && <IconButton className={classes.title} aria-label="админ-панель" style={{color: 'white'}} onClick={() => {
              history.push('/admin');
            }}>
                <SettingsIcon />
            </IconButton>}

          {context.isAuth && <IconButton className={classes.title} aria-label="подать заявку" style={{color: 'white'}} onClick={() => {
                history.push('/request');
            }}>
                <AddIcon />
            </IconButton>}
          {!context.isAuth ? (<React.Fragment><Button color="inherit" onClick={() => {
              history.push('login');
          }}>Log in</Button>
          <Button color="inherit" onClick={() => {
              history.push('registration');
          }}>Sign in</Button></React.Fragment>) : <React.Fragment>
            <IconButton
              color="inherit"
              onClick={handleProfileMenu}>
              <AccountCircle />
            </IconButton>
          </React.Fragment>}
          </div>
            
        </Toolbar>
        <Menu
        id="account-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => {
            context.setIsAuth(false);
            setAnchorEl(false);
          }}>
            Выйти
          </MenuItem>
        </Menu>
      </AppBar>
  );
}