import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NewsService } from './news.service';
import { environment } from '../../common/enviornment/enviornment.dev';
import { ApiEndPoints } from '../constants/api-endpoints.const';
import { NewsSelection } from '../enums/news-selection.enum';
import { INewsItem } from '../interfaces/news-item.interface';
import { NewsType } from '../enums/news-type.enum';

describe('NewsService', () => {
  let service: NewsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NewsService],
    });
    service = TestBed.inject(NewsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get top stories data', () => {
    const mockIds = [1, 2, 3];
    service.getTopStoriesData().subscribe(ids => {
      expect(ids).toEqual(mockIds);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiEndPoints.TopStoriesEndPoint
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockIds);
  });

  it('should get new stories data', () => {
    const mockIds = [4, 5, 6];
    service.getNewStoriesData().subscribe(ids => {
      expect(ids).toEqual(mockIds);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiEndPoints.NewStoriesEndPoint
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockIds);
  });

  it('should get a news item by ID', () => {
    const itemId = 123;
    const mockNewsItem: INewsItem = {
      id: itemId,
      title: 'Test News Item',
      by: 'testuser',
      time: 123456789,
      url: 'http://example.com',
      score: 10,
      descendants: 5,
      type: NewsType.Story,
    };

    service.getNewsItemData(itemId).subscribe(newsItem => {
      expect(newsItem).toEqual(mockNewsItem);
    });

    const expectedUrl = `${environment.apiUrl}${ApiEndPoints.NewsItemEndPoint.replace('{0}', itemId.toString())}`;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockNewsItem);
  });

  it('should update news selection and reset pagination when getNews is called', () => {
    const newSelection = NewsSelection.New;
    service.getNews(newSelection);

    service.newsSelection$.subscribe(selection => {
      expect(selection).toBe(newSelection);
    });

    service.pagination$.subscribe(pagination => {
      expect(pagination.currentPage).toBe(0);
    });
  });

  it('should increment current page when loadMore is called', () => {
    // Initial call to set up the pagination subject
    service.getNews(NewsSelection.Top);

    // First call to loadMore
    service.loadMore();
    service.pagination$.subscribe(pagination => {
      expect(pagination.currentPage).toBe(1);
    });

    // Second call to loadMore
    service.loadMore();
    service.pagination$.subscribe(pagination => {
      expect(pagination.currentPage).toBe(2);
    });
  });

  it('should switch between top and new stories on news selection change', (done) => {
    const topStoriesIds = [1, 2, 3];
    const newStoriesIds = [4, 5, 6];

    // Simulate selecting Top News
    service.getNews(NewsSelection.Top);

    // Expect the HTTP request for top stories
    let req = httpTestingController.expectOne(environment.apiUrl + ApiEndPoints.TopStoriesEndPoint);
    req.flush(topStoriesIds);

    service.newItemIdsCache$.subscribe(ids => {
      expect(ids).toEqual(topStoriesIds);
      // Simulate selecting New News
      service.getNews(NewsSelection.New);

      // Expect the HTTP request for new stories
      req = httpTestingController.expectOne(environment.apiUrl + ApiEndPoints.NewStoriesEndPoint);
      req.flush(newStoriesIds);

      service.newItemIdsCache$.subscribe(newIds => {
        expect(newIds).toEqual(newStoriesIds);
        done();
      });
    });
  });
});
