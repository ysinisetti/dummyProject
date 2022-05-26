import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
 name: 'timeFormat'
})
export class TimeConversion implements PipeTransform {


  setValue: string;
  constructor() { }
  transform(value: number): string {
  if (value === 0 || value < 0) {
  setTimeout(() => {}, 1000);
  return this.setValue = '00:00:00';
  } else {
  const hours: number = Math.floor(value / 3600);
  const minutes: number = Math.floor((value % 3600) / 60);
  return ('00' + hours).slice(-2) + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
  }
  }

  // transform(value: number): string {
  //   let  temp = value * 60;
  //   const hours = Math.floor((temp/3600));
  //   const minutes: number = Math.floor((temp/ 60)/60);
  //   const seconds=Math.floor(temp % 3600 % 60);
  //   return hours + ':' + minutes + ':' + seconds;
  // }
}
