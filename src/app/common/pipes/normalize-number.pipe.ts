import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalizeNumber',
  standalone: true
})
export class NormalizeNumberPipe implements PipeTransform {

  transform(value: number, max: number): number {
    return Math.trunc(((value ?? 0) / max) * 100);
  }

}
