import React from 'react';
import { Switch } from '@material-ui/core';
import themeStore from '../store/themeStore';
import { observer } from 'mobx-react';
import { createMuiTheme } from '@material-ui/core';

const useStyles = createMuiTheme()

export default observer(function(){
    const [check, setCheck] = React.useState(false)
    //const classes = useStyles();
    const handleChange = e => {
        setCheck(!check);
        //console.log(check);
        if (!check) {
            themeStore.setTheme({
                palette: {
                    primary: {
                        main: 'rgb(199, 142, 255)',
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#a140ff',
                        contrastText: '#fff',
                    }
                }
            });
        }
        else {
            themeStore.setTheme({});
        }
    }

    return (
        <Switch
        checked={check}
        onChange={handleChange}
        inputProps={{'aria-label': 'переключить тему'}}
        
        />
    )
})