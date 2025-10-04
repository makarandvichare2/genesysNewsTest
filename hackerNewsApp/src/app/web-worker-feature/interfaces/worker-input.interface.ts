import { INewsItem } from "../../dashboard/interfaces/news-item.interface";

export interface IWorkerInput {
  csvData: INewsItem[];
  headers: string[];
  fileName: string;
}
