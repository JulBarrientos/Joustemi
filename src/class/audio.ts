
export class AudioData {
    private _name: string;
    private _usu: string;
    private _timeRecorded: string;
    private _playing: boolean;
    private _duration: number;

    constructor(name: string="", usu: string="", timeRecorded: string="", duration: number=0) {
        this._name = name;
        this._usu = usu;
        this._timeRecorded = timeRecorded;
        this._playing = false;
        this._duration = duration;
    }

  
   get Name(): string{
       return this._name;
   }
   set Name(name: string){
       this._name = name;
   }

   get Usu(): string{
       return this._name;
   }
   set Usu(usu: string){
       this._usu = usu;
   }

   get TimeRecorded(): string{
       return this._timeRecorded;
   }
   set TimeRecorded(timeRecorded: string){
       this._timeRecorded = timeRecorded;
   }

   get Playing(): boolean{
    return this._playing
   }
   set Playing(playing: boolean){
       this._playing = playing;
   }

   get Duration(): number{
       return this._duration;
   }
   set Duration(duration: number){
       this._duration = duration;
   }
}