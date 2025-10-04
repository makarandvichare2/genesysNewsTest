import { Pipe, PipeTransform } from '@angular/core';
import { nullableString } from '../../common/types/nullable-string.type';
import { Helpers } from '../../web-worker-feature/services/helper';

@Pipe({
  name: 'newsTitle'
})
export class NewsTitlePipe implements PipeTransform {

  transform(value: nullableString, ...args: string[]): string {
    return Helpers.getNewsTitleWithDomainUrl(value, ...args);
  }


}
