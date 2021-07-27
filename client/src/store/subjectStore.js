import {makeAutoObservable} from 'mobx';
import axios from 'axios';

export class SubjectStore{
    constructor() {
        this.subjects = [];
        axios.get(process.env.REACT_APP_SERVER_HOST + 'api/subjects').then((response) =>{
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
        console.log("subjects", this.subjects);
    }
}
var subjectStore = new SubjectStore();

export default subjectStore;