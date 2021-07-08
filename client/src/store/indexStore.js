import {makeAutoObservable} from 'mobx'
import {UserStore} from './userStore.js'
import {SubjectStore} from './subjectStore.js'

class RootStore{
    constructor(){
        makeAutoObservable(this);
        this.userStore = new UserStore();
        this.subjectStore = new SubjectStore(); 
    }
}

export default RootStore;