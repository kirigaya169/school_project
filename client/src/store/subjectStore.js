import {makeAutoObservable} from 'mobx';
import axios from 'axios';
import serverHost from '../config';

export class SubjectStore{
    constructor() {
        this.subjects = [];
        axios.get(serverHost + 'api/subjects').then((response) =>{
            this.sendSubjects(response);
        });
        makeAutoObservable(this);
    }

    setSubjects(subjects){
        this.subjects = subjects;
    }

    sendSubjects(response){
        var subjects = response.data.subjects;
        var subj = [];
        for (var i = 0; i < subjects.length; i++){
            subj.push(subjects[i].value);
        }
        this.subjects = subj;
    }
}
var subjectStore = new SubjectStore();

export default subjectStore;