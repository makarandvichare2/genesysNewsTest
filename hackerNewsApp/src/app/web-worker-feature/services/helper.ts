import { INewsItem } from "../../dashboard/interfaces/news-item.interface";

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

  static generateCSV(data: INewsItem[], headers: string[]) {
    const colHeaders = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map((row: object) => {
      const indexableRow = row as Record<string, unknown>;
      return colHeaders.map((header: string) => {
        let value = indexableRow[header] === null || indexableRow[header] === undefined ? '' : String(indexableRow[header]);

        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      }).join(',');
    });
    return csvHeaders + '\n' + csvRows.join('\n');
  }
}
