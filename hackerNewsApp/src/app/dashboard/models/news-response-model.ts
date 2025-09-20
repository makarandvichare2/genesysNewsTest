import { INewsItem } from '../interfaces/news-item.interface';
import { Pagination } from './pagination.model';
export class NewsResponse {
  loading: boolean = false;
  data: INewsItem[] = [];
  pageInfo: Pagination = new Pagination();
  error: string | null = null;
}
