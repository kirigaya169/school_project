import React from 'react'
import SubjectStore from './store/subjectStore.js';
import UserStore from './store/userStore.js';

//const SubjectContext = React.createContext(new SubjectStore());
const UserContext = React.createContext(new UserStore());

export {UserContext}; 