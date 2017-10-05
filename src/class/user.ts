export class UserData{
    private _email: string;
    private _imageUrl: string;
    private _name: string;

    constructor(email: string = "", imageUrl: string = "", name: string = ""){
        this._email = email;
        this._imageUrl = imageUrl;
        this._name = name;
    }


    public getEmail(){
        return this._email;
    }
    public setEmail(email: string){
        this._email = email;
    }

    public getImageUrl(){
        return this._imageUrl;
    }
    public setImageUrl(imageUrl: string){
        this._imageUrl = imageUrl;
    }

    public getName(){
        return this._name;
    }
    public setName(name: string){
        this._name = name;
    }

}