import {makeAutoObservable} from 'mobx'
import {UserStore} from './userStore.js'

class RootStore{
    constructor(){
        makeAutoObservable(this);
        this.userStore = new UserStore();
    }
}

export default RootStore;