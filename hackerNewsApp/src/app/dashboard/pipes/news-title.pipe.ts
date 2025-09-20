import { Pipe, PipeTransform } from '@angular/core';
import { nullableString } from '../../common/types/nullable-string.type';

@Pipe({
  name: 'newsTitle'
})
export class NewsTitlePipe implements PipeTransform {

  transform(value: nullableString, ...args: string[]): string {
    if (value === null || value === undefined) {
      return '';
    }

    // const urlObject = new URL(args.join(" "));
    // return value.concat(" (", urlObject.hostname, ")");
    let fullUrl = args.join(" ");
    let domainUrl = '';
    if (fullUrl.length > 0 && fullUrl.indexOf("/", 8) >= 0) {
      domainUrl = fullUrl.substring(0, fullUrl.indexOf("/", 8));
    }
    else if (fullUrl.length > 0) {
      domainUrl = fullUrl;
    }

    return domainUrl.length > 0 ? value.concat(" (", domainUrl, ")") : value;
  }

}
