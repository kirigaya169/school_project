import React from 'react';
import axios from 'axios';
import {Typography, TableRow, TableCell, IconButton, Table, TableContainer, TableHead, TableBody, Paper, Collapse, Box} from '@material-ui/core';
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

    React.useEffect(async() => {
        try{
            const data = await axios.get(serverHost + 'api/lessons/');
            //console.log(data.data.lessons);
            var lessons_data = data.data.lessons;
            lessons_data.sort(function(a, b){
                return new Date(b.date) - new Date(a.date);
            });
            setLessons(lessons_data);
        }
        catch(e){
            console.log(e);
        }
    }, []);
    //console.log(lessons);
    return(
        <div>
            <Typography variant="h2">
                Расписание занятий
            </Typography>
            <TableContainer component={Paper}>
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
            </TableContainer>
        </div>
    )
}