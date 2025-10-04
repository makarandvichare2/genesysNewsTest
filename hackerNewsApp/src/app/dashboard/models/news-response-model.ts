import { IApiNewsItem } from '../interfaces/news-item.interface';
import { Pagination } from './pagination.model';
export class NewsResponse {
  loading = false;
  data: IApiNewsItem[] = [];
  pageInfo: Pagination = new Pagination();
  error: string | null = null;
}
