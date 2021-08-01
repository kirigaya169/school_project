import jwt_decode from 'jwt-decode';
import {makeObservable, action, observable, extendObservable, autorun, toJS} from 'mobx'

function autoSave(store, save) {
    console.log("save");
    let firstRun = true;
    autorun(() => {
        const json = JSON.stringify(toJS(store));
        if (!firstRun){
            save(json);
        }
        firstRun = false;
    });
}

export class UserStore{
    isAuth = false;
    user = {};
    token = '';

    constructor(){
        this.load();
        makeObservable(this, {
            setUser: action,
            setIsAuth: action,
        })
        
        autoSave(this, this.save.bind(this));
    }

    setIsAuth(auth) {
        this.isAuth = auth;
    }

    setUser(token){
        console.log("token", token);
        if (token){
            this.token = token;
            this.user = jwt_decode(token);
            console.log(this.user);
        }
        else{
            this.user = {};
            this.token = '';
        }
    }

    load() {
        if (sessionStorage.getItem('user-store')){
            const data = JSON.parse(sessionStorage.getItem('user-store'));
            extendObservable(this, data);
        }
        else {
            makeObservable(this, {
                isAuth: observable,
                user: observable,
                token: observable,
            })
        }
    }

    save(json){
        sessionStorage.setItem('user-store', json);
        console.log(sessionStorage.getItem('user-store'));
    }
}



export default UserStore;