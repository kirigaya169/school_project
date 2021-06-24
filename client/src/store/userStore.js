import jwt_decode from 'jwt-decode';
import {makeAutoObservable} from 'mobx'

export class UserStore{
    constructor(){
        this.isAuth = false;
        this.user = {};
        this.token = '';
        makeAutoObservable(this);
    }

    setIsAuth(auth){
        this.isAuth = auth;
    }

    setUser(token){
        this.token = token;
        this.user = jwt_decode(token);
        console.log(this.user);
    }
}

export default UserStore;