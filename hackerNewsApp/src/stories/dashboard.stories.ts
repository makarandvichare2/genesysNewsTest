import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { of, BehaviorSubject, delay, throwError, Observable, EMPTY } from 'rxjs';
import { waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { NewsDashBoardComponent } from '../app/dashboard/components/news-dashboard/news-dashboard.component';
import { NewsSelection } from '../app/dashboard/enums/news-selection.enum';
import { INewsItem } from '../app/dashboard/interfaces/news-item.interface';
import { Pagination } from '../app/dashboard/models/pagination.model';
import { NewsService } from '../app/dashboard/services/news.service';
import { NewsType } from '../app/dashboard/enums/news-type.enum';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const mockNewsItems: INewsItem[] = [
  { id: 1, title: 'Item 1', url: 'https://example.com/1', by: 'user1', time: 12334234, score: 10, descendants: 5, type: NewsType.Story },
  { id: 2, title: 'Item 2', url: 'https://example.com/2', by: 'user2', time: 12334234, score: 20, descendants: 8, type: NewsType.Story },
  { id: 3, title: 'Item 3', url: 'https://example.com/3', by: 'user3', time: 12334234, score: 15, descendants: 3, type: NewsType.Story },
  { id: 4, title: 'Item 4', url: 'https://example.com/4', by: 'user4', time: 12334234, score: 20, descendants: 12, type: NewsType.Story },
  { id: 5, title: 'Item 5', url: 'https://example.com/5', by: 'user5', time: 12334234, score: 30, descendants: 20, type: NewsType.Story },
  { id: 6, title: 'Item 6', url: 'https://example.com/6', by: 'user6', time: 12334234, score: 20, descendants: 7, type: NewsType.Story },
  { id: 7, title: 'Item 7', url: 'https://example.com/7', by: 'user7', time: 12334234, score: 22, descendants: 9, type: NewsType.Story },
  { id: 8, title: 'Item 8', url: 'https://example.com/8', by: 'user8', time: 12334234, score: 20, descendants: 15, type: NewsType.Story },
  { id: 9, title: 'Item 9', url: 'https://example.com/9', by: 'user9', time: 12334234, score: 40, descendants: 25, type: NewsType.Story },
  { id: 10, title: 'Item 10', url: 'https://example.com/10', by: 'user10', time: 12334234, score: 20, descendants: 30, type: NewsType.Story },
  { id: 11, title: 'Item 11', url: 'https://example.com/11', by: 'user11', time: 12334234, score: 50, descendants: 2, type: NewsType.Story },
  { id: 12, title: 'Item 12', url: 'https://example.com/12', by: 'user12', time: 12334234, score: 5200, descendants: 3, type: NewsType.Story },
  { id: 13, title: 'Item 13', url: 'https://example.com/13', by: 'user10', time: 12334234, score: 50, descendants: 31, type: NewsType.Story },
  { id: 14, title: 'Item 15', url: 'https://example.com/15', by: 'user1', time: 12334234, score: 200, descendants: 34, type: NewsType.Story },
];

const mockNewsIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

class SuccessNewsServiceMock {
  newsSelection$ = new BehaviorSubject<NewsSelection>(NewsSelection.Top);
  pagination$ = new BehaviorSubject<Pagination>(new Pagination(10, 0));
  newItemIdsCache$ = new BehaviorSubject<number[]>(mockNewsIds);

  getNews(selection: NewsSelection) {
    this.newsSelection$.next(selection);
  }

  loadMore() {
    this.pagination$.next(new Pagination(10, 1));
  }

  getNewsItemData(itemId: number): Observable<INewsItem> {
    const newsItem = mockNewsItems.find(item => item.id === itemId);
    if (newsItem) {
      return of(newsItem).pipe(delay(2000));
    }
    return EMPTY;
  }
}

class LoadingNewsServiceMock {
  newsSelection$ = new BehaviorSubject<NewsSelection>(NewsSelection.Top);
  pagination$ = new BehaviorSubject<Pagination>(new Pagination(10, 0));
  newItemIdsCache$ = new BehaviorSubject<number[]>([]);

  getNews(selection: NewsSelection) {
    this.newsSelection$.next(selection);
  }

  loadMore() {
    this.pagination$.next(new Pagination(10, 1));
  }

  getNewsItemData(itemId: number): Observable<INewsItem> {
    return of();
  }
}

class ErrorNewsServiceMock {
  newsSelection$ = new BehaviorSubject<NewsSelection>(NewsSelection.Top);
  pagination$ = new BehaviorSubject<Pagination>(new Pagination(10, 0));
  newItemIdsCache$ = new BehaviorSubject<number[]>(mockNewsIds);

  getNews(selection: NewsSelection) {
    this.newsSelection$.next(selection);
  }

  loadMore() {
    this.pagination$.next(new Pagination(10, 1));
  }

  getNewsItemData(itemId: number): Observable<INewsItem> {
    return throwError(() => 'Something went wrong!');
  }
}

type NewsDashboardStory = StoryObj<NewsDashBoardComponent> & {
  args: {
    responseType?: 'success' | 'loading' | 'error';
    [key: string]: unknown;
  };
};

const meta: Meta<NewsDashBoardComponent> = {
  title: 'News Dashboard',
  component: NewsDashBoardComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule, FontAwesomeModule],
    }),
  ],
};

export default meta;

export const Loading: NewsDashboardStory = {
  decorators: [
    moduleMetadata({
      providers: [
        { provide: NewsService, useClass: LoadingNewsServiceMock },
      ],
    }),
  ],
  args: {
    responseType: 'loading',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      const loadingIndicator = canvas.getByTestId('loading-message');
      expect(loadingIndicator).toBeInTheDocument();
    });
  },
};

export const Success: NewsDashboardStory = {
  decorators: [
    moduleMetadata({
      providers: [
        { provide: NewsService, useClass: SuccessNewsServiceMock },
      ],
    }),
  ],
  args: {
    responseType: 'success',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      const newItemsEls = canvas.getAllByTestId('news-item');
      expect(newItemsEls.length).toBe(10);
      const firstNewsItem = canvas.getAllByText(/Item 1/i)[0];
      expect(firstNewsItem).toBeInTheDocument();
    }, { timeout: 3000 });
  },
};

export const Error: NewsDashboardStory = {
  decorators: [
    moduleMetadata({
      providers: [
        { provide: NewsService, useClass: ErrorNewsServiceMock },
      ],
    }),
  ],
  args: {
    responseType: 'error',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      const errorMessage = canvas.getByTestId('error-message');
      expect(errorMessage).toBeInTheDocument();
    });
  },
};
