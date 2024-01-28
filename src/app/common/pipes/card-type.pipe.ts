import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardType',
  standalone: true
})
export class CardTypePipe implements PipeTransform {

  transform(number: number): string {
    switch(number) {
      case 0: return 'A';
      case 1: return 'B';
      case 2: return 'C';
      case 3: return 'D';
      default: return '?';
    }
  }

}
