import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMenuComponent } from './dashboard/components/top-menu/top-menu.component';
import { NewsService } from './dashboard/services/news.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [NewsService]
})
export class AppComponent {
  title = 'hackerNewsApp';
}
