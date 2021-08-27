import { makeAutoObservable } from "mobx";

export class ThemeStore{
    constructor() {
        this.theme = {};
        makeAutoObservable(this);
    }

    setTheme(theme){
        this.theme = theme;
    }
}

export default new ThemeStore();