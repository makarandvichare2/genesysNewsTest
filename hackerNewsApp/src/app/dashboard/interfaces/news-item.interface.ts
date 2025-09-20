export interface INewsItem {
  id: number;
  type: NewsType;
  by: string;
  time: number;
  title: string;
  url: string;
  score: number;
  descendants: number;
}
