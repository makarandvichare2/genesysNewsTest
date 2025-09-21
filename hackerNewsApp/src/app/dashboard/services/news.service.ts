import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, shareReplay, Subject, switchMap } from 'rxjs';
import { INewsItem } from '../interfaces/news-item.interface';
import { environment } from '../../common/enviornment/enviornment.dev';
import { ApiEndPoints } from '../constants/api-endpoints.const';
import { NewsSelection } from '../enums/news-selection.enum';
import { Pagination } from '../models/pagination.model';

@Injectable()
export class NewsService {

  newsSelection$!: Observable<NewsSelection>;
  pagination$!: Observable<Pagination>;
  newItemIdsCache$!: Observable<number[]>;
  private pageInfo = new Pagination(0);
  constructor(private http: HttpClient) {
    this.setupListeners();
  }

  private newsSelectionSubject = new BehaviorSubject<NewsSelection>(NewsSelection.None);
  private paginationSubject = new BehaviorSubject<Pagination>(this.pageInfo);

  getNews(newsSelection: NewsSelection) {
    this.pageInfo.reset();
    this.paginationSubject.next(this.pageInfo);
    this.newsSelectionSubject.next(newsSelection);
  }

  loadMore() {
    this.pageInfo.currentPage = this.pageInfo.currentPage + 1;
    this.paginationSubject.next(this.pageInfo);
  }

  getTopStoriesData(): Observable<number[]> {
    return this.http.get<number[]>(environment.apiUrl + ApiEndPoints.TopStoriesEndPoint);
  }

  getNewStoriesData(): Observable<number[]> {
    return this.http.get<number[]>(environment.apiUrl + ApiEndPoints.NewStoriesEndPoint);
  }

  getNewsItemData(itemId: number): Observable<INewsItem> {
    var finalEndPoint = ApiEndPoints.NewsItemEndPoint.replace("{0}", itemId.toString());
    return this.http.get<INewsItem>(environment.apiUrl + finalEndPoint);
  }

  private setupListeners() {
    this.newsSelection$ = this.newsSelectionSubject.asObservable();
    this.pagination$ = this.paginationSubject.asObservable();

    this.newItemIdsCache$ = this.newsSelection$.pipe(
      switchMap((newsSelection: NewsSelection) => {
        if (newsSelection === NewsSelection.Top) {
          return this.getTopStoriesData();
        }
        else if (newsSelection === NewsSelection.New) {
          return this.getNewStoriesData();
        }
        else {
          return EMPTY;
        }
      }),
      shareReplay(1)
    )
  }
}
