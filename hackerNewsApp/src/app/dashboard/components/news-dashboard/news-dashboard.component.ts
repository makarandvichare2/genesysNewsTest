import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewsItemComponent } from '../news-item/news-item.component';
import { NewsService } from '../../services/news.service';
import { catchError, EMPTY, forkJoin, Subscription, switchMap, tap } from 'rxjs';
import { INewsItem } from '../../interfaces/news-item.interface';
import { NewsSelection } from '../../enums/news-selection.enum';
import { CommonModule } from '@angular/common';
import { NewsResponse } from '../../models/news-response-model';

@Component({
  selector: 'app-news-dashboard',
  imports: [NewsItemComponent, CommonModule],
  templateUrl: './news-dashboard.component.html',
  styleUrl: './news-dashboard.component.scss',
  providers: [NewsService]
})
export class NewsDashBoardComponent implements OnInit, OnDestroy {

  newsResponse: NewsResponse = new NewsResponse();
  constructor(private newsService: NewsService) {

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.loadNews();
    this.newsService.getNews(NewsSelection.Top);
  }

  private subscription!: Subscription;
  private loadNews() {
    this.subscription = this.newsService.newsSelection$.pipe(
      tap(() => this.newsResponse.loading = true),
      switchMap((newsSelection: NewsSelection) => {
        const newsItemsIds$ = (newsSelection === NewsSelection.Top)
          ? this.newsService.getTopStories()
          : this.newsService.getNewStories();
        return newsItemsIds$.pipe(
          switchMap((newsItemsIds: number[]) => {
            if (newsItemsIds.length === 0) {
              return EMPTY;
            }
            const newsDetail$ = newsItemsIds.map(itemId =>
              this.newsService.getNewsItem(itemId)
            );
            return forkJoin(newsDetail$);
          }));
      }),
      catchError(error => {
        this.newsResponse.error = error;
        this.newsResponse.loading = false;
        return EMPTY;
      })
    ).subscribe(
      (newsItems: INewsItem[]) => {
        this.newsResponse.data = newsItems;
        this.newsResponse.loading = false;
        this.newsResponse.error = null;
      })
  }
}
