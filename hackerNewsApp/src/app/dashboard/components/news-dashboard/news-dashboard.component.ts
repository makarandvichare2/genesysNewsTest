import { Component, OnInit } from '@angular/core';
import { NewsItemComponent } from '../news-item/news-item.component';
import { NewsService } from '../../services/news.service';
import { EMPTY, forkJoin, Observable, switchMap } from 'rxjs';
import { INewsItem } from '../../interfaces/news-item.interface';
import { NewsType } from '../../enums/news-type.enum';
import { NewsSelection } from '../../enums/news-selection.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-dashboard',
  imports: [NewsItemComponent,CommonModule],
  templateUrl: './news-dashboard.component.html',
  styleUrl: './news-dashboard.component.scss',
  //providers: [NewsService]
})
export class NewsDashBoardComponent implements OnInit {

  newsItems$!: Observable<INewsItem[]>
  constructor(private newsService: NewsService) {

  }
  ngOnInit(): void {
    this.loadNews();
  }

  private loadNews() {
    this.newsService.newsSelection$.pipe(
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
      }));
  }
}
