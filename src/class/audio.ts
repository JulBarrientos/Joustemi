export class AudioData {
    private _name: string;
    private _usu: string;
    private _timeRecorded: string;

    constructor(name: string="", usu: string="", timeRecorded: string="") {
        this._name = name;
        this._usu = usu;
        this._timeRecorded = timeRecorded;
    }

   public getName(){
       return this._name;
   }
   public setName(name: string){
       this._name = name;
   }

   public getUsu(){
       return this._name;
   }
   public setUsu(usu: string){
       this._usu = usu;
   }

   public getTimeRecorded(){
       return this._timeRecorded;
   }
   public setTimeRecorded(timeRecorded: string){
       this._timeRecorded = timeRecorded;
   }
}