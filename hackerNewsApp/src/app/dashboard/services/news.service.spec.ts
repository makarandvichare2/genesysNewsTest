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
    //Assert
    expect(service).toBeTruthy();
  });

  it('should get top stories data', () => {
    //Arrange
    const newItemIds = [1, 2, 3];

    //Act
    service.getTopStoriesData().subscribe(ids => {
      expect(ids).toEqual(newItemIds);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiEndPoints.TopStoriesEndPoint
    );

    //Assert
    expect(req.request.method).toBe('GET');
    req.flush(newItemIds);
  });

  it('should get new stories data', () => {
    //Arrange
    const newItemIds = [4, 5, 6];

    //Act
    service.getNewStoriesData().subscribe(ids => {
      expect(ids).toEqual(newItemIds);
    });

    //Assert
    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiEndPoints.NewStoriesEndPoint
    );
    expect(req.request.method).toBe('GET');
    req.flush(newItemIds);
  });

  it('should get a news item by ID', () => {
    //Arrange
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

    //Act
    service.getNewsItemData(itemId).subscribe(newsItem => {
      expect(newsItem).toEqual(mockNewsItem);
    });

    const expectedUrl = `${environment.apiUrl}${ApiEndPoints.NewsItemEndPoint.replace('{0}', itemId.toString())}`;

    //Assert
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockNewsItem);
  });

  it('should update news selection and reset pagination when getNews is called', () => {
    //Arrange
    const newSelection = NewsSelection.New;

    //Act
    service.getNews(newSelection);

    //Assert
    service.newsSelection$.subscribe(selection => {
      expect(selection).toBe(newSelection);
    });

    service.pagination$.subscribe(pagination => {
      expect(pagination.currentPage).toBe(0);
    });
  });

  it('should increment current page when loadMore is called', () => {
    //Act
    // Initial call to set up the pagination subject
    service.getNews(NewsSelection.Top);

    //Act and Assert
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

  it('should get top news when selection changed to top', (done) => {
    //Arrange
    const newItemIds = [1, 2, 3];

    service.newItemIdsCache$.subscribe(ids => {
      expect(ids).toEqual(newItemIds);
      done();
    });

    //Act
    service.getNews(NewsSelection.Top);

    // Assert
    let req = httpTestingController.expectOne(environment.apiUrl + ApiEndPoints.TopStoriesEndPoint);
    req.flush(newItemIds);
  });

  it('should get new news when selection changed to new', (done) => {
    //Arrange
    const newItemIds = [1, 2, 3];

    service.newItemIdsCache$.subscribe(ids => {
      expect(ids).toEqual(newItemIds);
      done();
    });

    //Act
    service.getNews(NewsSelection.New);

    // Assert
    let req = httpTestingController.expectOne(environment.apiUrl + ApiEndPoints.NewStoriesEndPoint);
    req.flush(newItemIds);
  });

  it('should switch between top and new stories on news selection change', (done) => {

    //Arrange
    //Selecting Top news selection
    const topNewsIds = [1, 2, 3];
    const newNewsIds = [4, 5, 6];
    service.newItemIdsCache$.subscribe(ids => {
      expect(ids).toEqual(topNewsIds);
    });

    service.getNews(NewsSelection.Top);

    let req = httpTestingController.expectOne(environment.apiUrl + ApiEndPoints.TopStoriesEndPoint);
    req.flush(topNewsIds);

    service.newItemIdsCache$.subscribe(ids => {
      expect(ids).toEqual(newNewsIds);
      done();
    });

    //Act
    service.getNews(NewsSelection.New);

    // Assert
    req = httpTestingController.expectOne(environment.apiUrl + ApiEndPoints.NewStoriesEndPoint);
    req.flush(newNewsIds);
  });
});
