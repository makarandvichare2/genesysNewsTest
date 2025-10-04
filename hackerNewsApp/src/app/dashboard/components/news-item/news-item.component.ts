import { Component, Input } from '@angular/core';
import { IApiNewsItem } from '../../interfaces/news-item.interface';
import { DateInWordsPipe } from '../../pipes/date-in-words.pipe';
import { NewsTitlePipe } from '../../pipes/news-title.pipe';
import { CommonModule } from '@angular/common';
import { NewsType } from '../../enums/news-type.enum';


@Component({
  selector: 'app-news-item',
  imports: [DateInWordsPipe, NewsTitlePipe, CommonModule],
  templateUrl: './news-item.component.html',
  styleUrl: './news-item.component.scss'
})
export class NewsItemComponent {

  @Input() newsItem!: IApiNewsItem;
  @Input() itemIndex!: number;

  get isStoryType() {
    return this.newsItem.type !== NewsType.Story;
  }
  onClick(url: string) {
    console.log(url);
  }
}
