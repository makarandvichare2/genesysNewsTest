import { INewsItem } from '../interfaces/news-item.interface';
export class NewsResponse {
  loading: boolean = false;
  data: INewsItem[] = [];
  error: string | null = null;
}
