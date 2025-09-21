import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
import { of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { NewsDashBoardComponent } from '../app/dashboard/components/news-dashboard/news-dashboard.component';
import { NewsSelection } from '../app/dashboard/enums/news-selection.enum';
import { INewsItem } from '../app/dashboard/interfaces/news-item.interface';
import { Pagination } from '../app/dashboard/models/pagination.model';
import { NewsService } from '../app/dashboard/services/news.service';
import { NewsType } from '../app/dashboard/enums/news-type.enum';

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

const mockNewsItemsMap = new Map(mockNewsItems.map(item => [item.id, item]));

const mockNewsIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,15];

const paginationSubject = new BehaviorSubject(new Pagination());
const newsSelectionSubject = new BehaviorSubject(NewsSelection.None);

const newsService = {
  newsSelection$: newsSelectionSubject.asObservable(),
  pagination$: paginationSubject.asObservable(),
  newItemIdsCache$: of(mockNewsIds),
  getNewsItemData: (id: number) => of(mockNewsItemsMap.get(id)),
  getNews: (selection: NewsSelection) => {
    newsSelectionSubject.next(selection);
    paginationSubject.next(new Pagination());
  },
  loadMore: () => {
    const currentPagination = paginationSubject.getValue();
    const newPage = currentPagination.currentPage + 1;
    if (newPage * currentPagination.pageSize < mockNewsIds.length) {
      paginationSubject.next(new Pagination(newPage * currentPagination.pageSize, newPage));
    } else {
      console.log('No more items to load in mock.');
    }
  },
};

const meta: Meta<NewsDashBoardComponent> = {
  title: 'Dashboard/NewsDashBoardComponent',
  component: NewsDashBoardComponent,
  decorators: [
    applicationConfig({
      providers: [
        { provide: NewsService, useValue: newsService },
        { provide: HttpClient, useValue: {} }
      ]
    })
  ]
};
export default meta;

type Story = StoryObj<NewsDashBoardComponent>;

export const LoadingState: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const loadingMessage = canvas.getByText('Loading news...');
    await expect(loadingMessage).toBeVisible();

    const firstItem = await canvas.findByText(mockNewsItems[0].title);
    await expect(firstItem).toBeVisible();

    await expect(loadingMessage).not.toBeInTheDocument();
  },
};

