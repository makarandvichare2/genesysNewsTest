import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewsItemComponent } from '../news-item/news-item.component';
import { NewsService } from '../../services/news.service';
import { catchError, combineLatest, EMPTY, filter, Subscription, switchMap, tap } from 'rxjs';
import { IApiNewsItem } from '../../interfaces/news-item.interface';
import { NewsSelection } from '../../enums/news-selection.enum';
import { CommonModule } from '@angular/common';
import { NewsResponse } from '../../models/news-response-model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-news-dashboard',
  imports: [NewsItemComponent, CommonModule, FontAwesomeModule],
  templateUrl: './news-dashboard.component.html',
  styleUrl: './news-dashboard.component.scss',
})
export class NewsDashBoardComponent implements OnInit, OnDestroy {
  faSpinner = faSpinner;
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
          return this.newsService.combinedNewsInfo(pageInfo);
        }),
        catchError(error => {
          this.newsResponse.error = error;
          this.newsResponse.loading = false;
          return EMPTY;
        }),
        // map((newsItems: IApiNewsItem[]) => {
        //   return newsItems.map((newsItem) => {
        //     const { kids, ...requiredColumn } = newsItem;
        //     return requiredColumn;
        //   });
        // })
      ).subscribe(
        (newsItems: IApiNewsItem[]) => {
          this.newsResponse.data.push(...newsItems);
          this.newsResponse.loading = false;
          this.newsResponse.error = null;
        })
  }
}
