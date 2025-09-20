import { Component, Input } from '@angular/core';
import { INewsItem } from '../../interfaces/news-item.interface';
import { DateInWordsPipe } from '../../pipes/date-in-words.pipe';
import { NewsTitlePipe } from '../../pipes/news-title.pipe';

@Component({
  selector: 'app-news-item',
  imports: [DateInWordsPipe,NewsTitlePipe],
  templateUrl: './news-item.component.html',
  styleUrl: './news-item.component.scss'
})
export class NewsItemComponent {
  @Input() NewsItem!: INewsItem;
}
