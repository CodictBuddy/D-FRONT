import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgoPipe'
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, ...args: any): any {
    if (value) {
      let seconds = Math.floor((+new Date() - +new Date(value)) / 1000)

      if (seconds < 29) {
        return 'Just now';
      }
      const divider = [60, 60, 24, 30, 12];
      const string = [' second', ' minute', ' hour', ' day', ' month', ' year'];
      let i;
      for (i = 0; Math.floor(seconds / divider[i]) > 0; i++) {
        seconds /= divider[i];

      }
      const plural = Math.floor(seconds) > 1 ? 's' : '';
      return Math.floor(seconds) + string[i] + plural + ' ago'
    }
    return value;
  }
}
function elseif() {
  throw new Error('Function not implemented.');
}

