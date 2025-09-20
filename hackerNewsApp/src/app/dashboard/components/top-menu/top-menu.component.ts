import { Component, OnInit } from '@angular/core';
import { NewsSelection } from '../../enums/news-selection.enum';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-top-menu',
  imports: [],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.scss'
})
export class TopMenuComponent implements OnInit {
  constructor(private newsService: NewsService) {

  }
  ngOnInit(): void {
    this.newsService.getNews(NewsSelection.Top);
  }
  getTopNews() {
    this.newsService.getNews(NewsSelection.Top);
  }

  getLatestNews() {
    this.newsService.getNews(NewsSelection.New);
  }
}
