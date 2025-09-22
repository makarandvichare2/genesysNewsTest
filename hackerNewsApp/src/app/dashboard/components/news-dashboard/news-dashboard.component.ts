import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewsItemComponent } from '../news-item/news-item.component';
import { NewsService } from '../../services/news.service';
import { catchError, combineLatest, EMPTY, filter, forkJoin, Subscription, switchMap, tap } from 'rxjs';
import { INewsItem } from '../../interfaces/news-item.interface';
import { NewsSelection } from '../../enums/news-selection.enum';
import { CommonModule } from '@angular/common';
import { NewsResponse } from '../../models/news-response-model';
import { Pagination } from '../../models/pagination.model';

@Component({
  selector: 'app-news-dashboard',
  imports: [NewsItemComponent, CommonModule],
  templateUrl: './news-dashboard.component.html',
  styleUrl: './news-dashboard.component.scss',
})
export class NewsDashBoardComponent implements OnInit, OnDestroy {

  newsResponse: NewsResponse = new NewsResponse();
  constructor(private newsService: NewsService) {
    this.setupNewsListener();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.newsService.getNews(NewsSelection.Top);
  }

  loadMore() {
    this.newsService.loadMore();
  }

  private subscription!: Subscription;
  private setupNewsListener() {
    this.subscription = combineLatest(
      [this.newsService.newsSelection$,
      this.newsService.pagination$])
      .pipe(
        filter(([newsSelection, _]) => newsSelection != NewsSelection.None),
        tap(([_, pageInfo]) => {
          this.newsResponse.loading = true;
          this.newsResponse.pageInfo = pageInfo;
          if (this.newsResponse.pageInfo.currentPage == 0) {
            this.newsResponse.data = [];
          }
        }),
        switchMap(([_, pageInfo]) => {
          return this.combinedNewsInfo(pageInfo);
        }),
        catchError(error => {
          this.newsResponse.error = error;
          this.newsResponse.loading = false;
          return EMPTY;
        })
      ).subscribe(
        (newsItems: INewsItem[]) => {
          this.newsResponse.data.push(...newsItems);
          this.newsResponse.loading = false;
          this.newsResponse.error = null;
        })
  }

  private combinedNewsInfo(pageInfo: Pagination) {
    return this.newsService.newItemIdsCache$.pipe(
      switchMap((newsItemsIds: number[]) => {
        if (newsItemsIds.length === 0) {
          return EMPTY;
        }
        const pagedNewsItemIds = newsItemsIds.slice(
          pageInfo.currentPage * pageInfo.pageSize,
          (pageInfo.currentPage + 1) * pageInfo.pageSize);
        const newsDetail$ = pagedNewsItemIds.map(itemId => this.newsService.getNewsItemData(itemId)
        );
        return forkJoin(newsDetail$);
      }));
  }
}
