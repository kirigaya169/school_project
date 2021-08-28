import jwt_decode from 'jwt-decode';
import {makeObservable, action, observable, extendObservable, autorun, toJS} from 'mobx'
import axios from 'axios';
import serverHost from '../config';
import io from 'socket.io-client';

function autoSave(store, save) {
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
        if (token){
            this.token = token;
            this.user = jwt_decode(token);
            //console.log(this.user);
        }
        else{
            this.user = {};
            this.token = '';
        }
    }
    
    setNotifications(notifications){
        //console.log("not", notifications);
        this.notifications = notifications;
    }

    setCount(count){
        this.count = count;
    }

    addCount(count){
        this.count += count;
    }
    
    setNotification(notification){
        this.notification = notification;
    }

    removeSnackbar(key) {
        this.snackbars = this.snackbars.filter(snackbar => snackbar.key !== key);
    }

    setSnackbars(snacks){
        this.snackbars = snacks;
    }

    load() {
        if (sessionStorage.getItem('user-store')){
            const data = JSON.parse(sessionStorage.getItem('user-store'));
            //console.log(data);
            data.count = 0;
            data.notifications = [];
            data.notification = null;
            data.snackbars = [];
            extendObservable(this, {...data, removeSnackbar: action});
        }
        else {
            makeObservable(this, {
                isAuth: observable,
                user: observable,
                token: observable,
                count: observable,
                notifications: observable,
                notification: observable,
                snackbars: observable,
                removeSnackbar: action,
            })
        }

        axios.get(serverHost + 'api/user/notifications', {headers: {
            'Authorization': "Baerar " + this.token,
          }}).then(data => {
            //console.log("init", data.data.notifications);
            this.setNotifications(data.data.notifications);
            var col = 0;
            for (var i = 0; i < this.notifications.length; i++){
                if (!this.notifications[i].readed) col++;
            }
            this.setCount(col);

          }).catch(e => {
            //console.log(e.response);
          })
          const socket = io(serverHost);
        //console.log(socket);
        socket.emit("join",  {user: this.user.email});
        socket.on("notification", data => {
            //console.log("store ", this.notifications);
            this.notification = data;
            //console.log(data);
            this.notifications.push(data);
            this.addCount(1);  
            this.snackbars.push({
                message: data.text,
                options: {
                    //persist: true,
                    
                },
                key: new Date().getTime() + Math.random(),
            });
            //console.log("store snack", this.snackbars);
        })
        
    }

    save(json){
        sessionStorage.setItem('user-store', json);
    }
}



export default new UserStore();