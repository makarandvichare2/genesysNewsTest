import { Component, OnInit } from '@angular/core';
import { NewsSelection } from '../../enums/news-selection.enum';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-top-menu',
  imports: [],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.scss'
})
export class TopMenuComponent {
  constructor(private newsService: NewsService) {

  }
  activeItem: string = 'Top News';

  private setActiveItem(itemName: string): void {
    this.activeItem = itemName;
  }

  getTopNews(itemName: string, event: Event) {

    this.setActiveItem(itemName);
    event.preventDefault();
    this.newsService.getNews(NewsSelection.Top);
  }

  getLatestNews(itemName: string, event: Event) {

    this.setActiveItem(itemName);
    event.preventDefault();
    this.newsService.getNews(NewsSelection.New);
  }
}
