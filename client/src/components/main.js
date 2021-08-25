import React from 'react';
import axios from 'axios';
import {Typography, TableRow, TableCell, IconButton, Table, TableContainer, TableHead, TableBody, Paper, Collapse, Box, CircularProgress} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';
import serverHost from '../config';

const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });  

const Row = (props) => {
    const classes = useRowStyles();
    const {lesson} = props;
    const [open, setOpen] = React.useState(false);
    const time_options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      };
    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton size="small" onClick={() => {setOpen(!open)}}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{lesson.title}</TableCell>
                <TableCell align="right">{lesson.subject}</TableCell>
                <TableCell align="right">{new Date(lesson.date).toLocaleString(time_options)}</TableCell>
                <TableCell align="right">{lesson.teacher_name}</TableCell>
                <TableCell align="right">{lesson.pupil_name}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Описание
                            </Typography>
                            <Typography component="div">
                                {lesson.description}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

export default function MainPage(){

    const [lessons, setLessons] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(async() => {
        await axios.get(serverHost + 'api/lessons/').then(data => {
            var lessons_data = data.data.lessons;
            lessons_data.sort(function(a, b){
                return new Date(b.date) - new Date(a.date);
            });
            setLessons(lessons_data);
            setIsLoading(true);
        }).catch(e => {
            console.log(e);
        });
    }, []);
    //console.log(lessons);
    return(
        <div>
            <Box textAlign="center" my={2.5}>
                <Typography  variant="h2">
                    Хуй
                </Typography>
            </Box>

            {isLoading ? <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>
                                Название
                            </TableCell>
                            <TableCell align="right">
                                Предмет
                            </TableCell>
                            <TableCell align="right">
                                Дата
                            </TableCell>
                            <TableCell align="right">
                                Учитель
                            </TableCell>
                            <TableCell align="right">
                                Ученик
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {lessons.map((lesson) => (
                        <Row lesson={lesson} key={lesson.title}/>
                    ))}
                </Table>
            </TableContainer> : <Box display="flex" height="80vh" justifyContent="center" alignItems="center"><CircularProgress /></Box>}
        </div>
    )
}