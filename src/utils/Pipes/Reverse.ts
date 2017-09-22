import { Pipe,  PipeTransform   } from '@angular/core';

@Pipe({
    name: 'reverse',
    pure: false
  })
  export class Reverse implements PipeTransform{
    constructor() { }
    transform(value): any {
      var copy;
      if(value!=null){
         copy= value.slice();
        return copy.reverse();
      }
      return value;
    }
  }
  