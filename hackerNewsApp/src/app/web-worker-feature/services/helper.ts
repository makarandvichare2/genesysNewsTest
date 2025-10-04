import { DownloadNewsItemType } from "../type/custom.types";
import moment from "moment";
import { nullableString } from "../../common/types/nullable-string.type";
import { IApiNewsItem } from "../../dashboard/interfaces/news-item.interface";

export class Helpers {

  static downloadFile(csvData: string, fileName: string) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('download', fileName + '.csv');
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static generateCSV(data: IApiNewsItem[], headers: string[]) {
    const colHeaders = Object.keys(data[0]).filter(o => o !== 'kids');
    const csvHeaders = headers.join(',');
    const csvRows = data.map((row: object) => {
      const indexableRow = row as DownloadNewsItemType;
      return colHeaders.map((header: string) => {
        let value = indexableRow[header as keyof DownloadNewsItemType] === null || indexableRow[header as keyof DownloadNewsItemType] === undefined
          ? ''
          : String(Helpers.transform(indexableRow, header));

        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      }).join(',');
    });
    return csvHeaders + '\n' + csvRows.join('\n');
  }
  // private static transformData<T extends PipeTransform>(value: unknown,
  //   PipeClass: PipeConstructor<T>,
  //   ...pipeArgs: unknown[]): ReturnType<T['transform']> {
  //   const pipeInstance = new PipeClass();
  //   return pipeInstance.transform(value, ...pipeArgs) as ReturnType<T['transform']>;;
  // }

  // private static transformData<T extends PipeTransform>(value: unknown,
  //   pipeInstance: T): ReturnType<T['transform']> {

  //   return pipeInstance.transform(value) as ReturnType<T['transform']>;;
  // }

  private static transform(indexableRow: Record<string, unknown>, header: string) {
    if (header === 'time') {
      return moment(indexableRow[header] as number * 1000).fromNow();
    }
    else if (header === 'title') {
      return Helpers.getNewsTitleWithDomainUrl(indexableRow[header] as nullableString, String(indexableRow['url']));
    }
    return indexableRow[header];
  }

  static getNewsTitleWithDomainUrl(value: nullableString, ...args: string[]) {
    if (value === null || value === undefined) {
      return '';
    }

    // const urlObject = new URL(args.join(" "));
    // return value.concat(" (", urlObject.hostname, ")");
    const fullUrl = args.join(" ");
    let domainUrl = '';
    if (fullUrl.length > 0 && fullUrl.indexOf("/", 8) >= 0) {
      domainUrl = fullUrl.substring(0, fullUrl.indexOf("/", 8));
    }
    else if (fullUrl.length > 0) {
      domainUrl = fullUrl;
    }

    return domainUrl.length > 8 ? value.concat(" (", domainUrl, ")") : value;
  }
}

