import { Component } from '@angular/core';
import { NewsItemComponent } from '../news-item/news-item.component';

@Component({
  selector: 'app-news-dashboard',
  imports: [NewsItemComponent],
  templateUrl: './news-dashboard.component.html',
  styleUrl: './news-dashboard.component.scss'
})
export class NewsDashBoardComponent {

}
