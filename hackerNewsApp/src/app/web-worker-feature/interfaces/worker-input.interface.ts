import { IApiNewsItem } from "../../dashboard/interfaces/news-item.interface";
import { DownloadNewsItemType } from "../type/custom.types";

export interface IWorkerInput {
  csvData: IApiNewsItem[];
  headers: string[];
}
