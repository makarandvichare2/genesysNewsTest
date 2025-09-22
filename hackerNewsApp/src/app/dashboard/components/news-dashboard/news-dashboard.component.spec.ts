import { NewsType } from './../../enums/news-type.enum';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NewsDashBoardComponent } from './news-dashboard.component';
import { NewsService } from '../../services/news.service';
import { NewsSelection } from '../../enums/news-selection.enum';
import { BehaviorSubject, of } from 'rxjs';
import { Pagination } from '../../models/pagination.model';
import { INewsItem } from '../../interfaces/news-item.interface';
jest.mock('../../services/news.service');

describe('NewsDashBoardComponent', () => {
  let component: NewsDashBoardComponent;
  let fixture: ComponentFixture<NewsDashBoardComponent>;
  let service: NewsService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsDashBoardComponent],
      providers: [NewsService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NewsDashBoardComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(NewsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getNews with NewsSelection.Top on ngOnInit', () => {

    //Act
    component.ngOnInit();

    //Assert
    expect(service.getNews).toHaveBeenCalledWith(NewsSelection.Top);
  });

  it('should call unsubscribe on ngOnDestroy', () => {
    //Arrange
    const unsubscribeSpy = jest.spyOn(component['subscription'], 'unsubscribe');
    // Act
    component.ngOnDestroy();
    // Assert
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should call loadMore on news service', () => {
    // Act
    component.loadMore();
    // Assert
    expect(service.loadMore).toHaveBeenCalled();
  });

  it('should return different news data on page change ', fakeAsync(() => {
    //Arrange
    const itemIds = [1, 2, 3, 4, 5, 6];
    const item1: INewsItem = {
      id: 1, title: 'Mocked News', url: 'http://mock.com',
      by: 'user1', time: 1234567890, score: 10, descendants: 5, type: NewsType.Story
    };
    const item2: INewsItem = {
      id: 2, title: 'Another Mocked News', url: 'http://another.com',
      by: 'user1', time: 1234567891, score: 4, descendants: 0, type: NewsType.Story
    };
    const pageInfo = new Pagination(2, 0)
    const newsSelectionSubject = new BehaviorSubject(NewsSelection.None);
    const paginationSubject = new BehaviorSubject(pageInfo);
    const newsItemsIdsSubject = new BehaviorSubject(itemIds);

    service.newsSelection$ = newsSelectionSubject.asObservable();
    service.pagination$ = paginationSubject.asObservable();
    service.newItemIdsCache$ = newsItemsIdsSubject.asObservable();
    service.getNewsItemData = jest.fn((id) => {
      return of(id < 3 ? item1 : item2);
    });
    fixture = TestBed.createComponent(NewsDashBoardComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(NewsService);
    fixture.detectChanges();
    newsSelectionSubject.next(NewsSelection.Top);

    tick();
    expect(component.newsResponse.data[0]).toEqual(item1);

    // Act
    pageInfo.currentPage++;
    paginationSubject.next(pageInfo);
    fixture.detectChanges();
    tick();
    expect(component.newsResponse.data.length).toBe(4);
    expect(component.newsResponse.data[0]).toEqual(item1);
    expect(component.newsResponse.data[2]).toEqual(item2);
  }));
});
