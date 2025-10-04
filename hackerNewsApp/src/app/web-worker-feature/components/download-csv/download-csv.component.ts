import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewsService } from '../../../dashboard/services/news.service';
import { catchError, combineLatest, EMPTY, filter, Subscription, switchMap, tap } from 'rxjs';
import { INewsItem } from '../../../dashboard/interfaces/news-item.interface';
import { NewsSelection } from '../../../dashboard/enums/news-selection.enum';
import { NewsResponse } from '../../../dashboard/models/news-response-model';
import { DownloadService } from '../../services/download.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { NewsItemComponent } from '../../../dashboard/components/news-item/news-item.component';
import { IWorkerInput } from '../../interfaces/worker-input.interface';
/// <reference lib="webworker" />
@Component({
  selector: 'app-download-csv',
  imports: [NewsItemComponent, CommonModule, FontAwesomeModule],
  templateUrl: './download-csv.component.html',
  styleUrl: './download-csv.component.scss'
})
export class DownloadCsvComponent implements OnInit, OnDestroy {

  faSpinner = faSpinner;
  result = '';
  newsResponse: NewsResponse = new NewsResponse();
  constructor(private newsService: NewsService, private downloadService: DownloadService) {
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

  download() {
    if (typeof Worker !== 'undefined') {
      this.result = 'Calculating in background...';

      // 1. Create a new Worker instance
      // The CLI handles the path resolution using new URL(...)
      const worker = new Worker(new URL('../../services/mak-worker.worker', import.meta.url));

      // 2. Listen for messages from the worker
      worker.onmessage = ({ data }) => {
        this.result = data;
        console.log('Calculation complete, worker terminated.');
        worker.terminate(); // Terminate to free up resources
      };

      // 3. Post the message (data) to the worker to start the task
      const data = {
        csvData: this.newsResponse.data,
        headers: ["Id", "Type", "By", "Time", "Title", "Url", "Score", "Descendants"],
        fileName: 'csv' + new Date().toString()
      } as IWorkerInput;
      worker.postMessage(data);

    } else {
      // Fallback: Web Workers are not supported
      this.result = 'Web Workers not supported.';
    }
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
        })
      ).subscribe(
        (newsItems: INewsItem[]) => {
          this.newsResponse.data.push(...newsItems);
          this.newsResponse.loading = false;
          this.newsResponse.error = null;
        })
  }
}
