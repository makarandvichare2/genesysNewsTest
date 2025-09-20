import { Component, Input } from '@angular/core';
import { INewsItem } from '../../interfaces/news-item.interface';

@Component({
  selector: 'app-news-item',
  imports: [],
  templateUrl: './news-item.component.html',
  styleUrl: './news-item.component.scss'
})
export class NewsItemComponent {
  @Input() NewsItem!: INewsItem;
}
