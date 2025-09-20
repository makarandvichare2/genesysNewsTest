import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newsTitle'
})
export class NewsTitlePipe implements PipeTransform {

  transform(value: nullableString, ...args: string[]): string {
    if (value === null || value === undefined) {
      return '';
    }
    return value.concat(" (", args.join(" "), ")");
  }

}
