import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'dateInWords'
})
export class DateInWordsPipe implements PipeTransform {

  transform(value: nullableNumber): string {
    if (value === null || value === undefined) {
      return '';
    }

    return moment(value * 1000).fromNow();
  }

}
