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
import { Link as BrowserLink } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import { Menu, MenuItem } from '@material-ui/core';
import userStore from '../store/userStore.js';

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
                <Link component={BrowserLink} to="/" color='inherit'>Главная</Link>
          </Typography>
          <div>

            {(userStore.isAuth && userStore.user.roles.includes("ADMIN")) && <IconButton component={BrowserLink} to="/admin" className={classes.title} aria-label="админ-панель" style={{color: 'white'}}>
                <SettingsIcon />
            </IconButton>}

          {userStore.isAuth && <IconButton className={classes.title} component={BrowserLink} to="/request" aria-label="подать заявку" style={{color: 'white'}}>
                <AddIcon/>
            </IconButton>}
          {!userStore.isAuth ? (<React.Fragment><Button component={BrowserLink} to="/login" color="inherit">Log in</Button>
          <Button color="inherit" component={BrowserLink} to="/registration">Sign in</Button></React.Fragment>) : <React.Fragment>
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
            userStore.setIsAuth(false);
            setAnchorEl(false);
          }}>
            Выйти
          </MenuItem>
        </Menu>
      </AppBar>
  );
}