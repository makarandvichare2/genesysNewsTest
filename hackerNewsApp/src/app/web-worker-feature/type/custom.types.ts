import { IApiNewsItem } from "../../dashboard/interfaces/news-item.interface";

export type DownloadNewsItemType = Omit<IApiNewsItem, 'kids' | 'text'>;
// export type PipeConstructor<T> = new (...args: unknown[]) => T;
