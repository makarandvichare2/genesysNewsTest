import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { INewsItem } from '../interfaces/news-item.interface';
import { environment } from '../../common/enviornment/enviornment.dev';
import { ApiEndPoints } from '../constants/api-endpoints.const';
import { NewsType } from '../enums/news-type.enum';
import { NewsSelection } from '../enums/news-selection.enum';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  stories$!: Observable<INewsItem[]>;
  newsSelection$!: Observable<NewsSelection>;
  constructor(private http: HttpClient) {
    this.newsSelection$ = this.newsSelectionSubject.asObservable();
  }

  private newsSelectionSubject = new Subject<NewsSelection>();

  getNews(newsSelection: NewsSelection) {
    this.newsSelectionSubject.next(newsSelection);
  }

  getTopStories(): Observable<number[]> {
    return this.http.get<number[]>(environment.apiUrl + ApiEndPoints.TopStoriesEndPoint);
  }

  getNewStories(): Observable<number[]> {
    return this.http.get<number[]>(environment.apiUrl + ApiEndPoints.NewStoriesEndPoint);
  }

  getNewsItem(itemId: number): Observable<INewsItem> {
    var finalEndPoint = ApiEndPoints.NewsItemEndPoint.replace("{0}", itemId.toString());
    return this.http.get<INewsItem>(environment.apiUrl + finalEndPoint);
  }
}
