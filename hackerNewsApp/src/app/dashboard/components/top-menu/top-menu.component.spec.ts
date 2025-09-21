import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMenuComponent } from './top-menu.component';
import { NewsService } from '../../services/news.service';
import { NewsSelection } from '../../enums/news-selection.enum';

jest.mock('../../services/news.service');

describe('TopMenuComponent', () => {
  let component: TopMenuComponent;
  let fixture: ComponentFixture<TopMenuComponent>;
  let service: NewsService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopMenuComponent],
      providers: [NewsService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TopMenuComponent);
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

  test.each([
    'Hacker News',
    'Top News',
    'Latest News'
  ])('should find link %s', (linkName: string) => {

    //Act
    fixture.detectChanges();
    const link = fixture.debugElement.query(el => el.nativeElement.textContent.trim() === linkName);

    //Assert
    expect(link).toBeTruthy();
  });

  test.each([
    ['Hacker News', 'getNews', NewsSelection.Top],
    ['Top News', 'getNews', NewsSelection.Top],
    ['Latest News', 'getNews', NewsSelection.New]
  ])('should call news service method %s', (linkName: string, method: any, newsSelection: number) => {
    //Act
    const getNewsSpy = jest.spyOn(service, method);
    fixture.detectChanges();
    const link = fixture.debugElement.query(el => el.nativeElement.textContent.trim() === linkName);
    link.nativeElement.click();

    //Assert
    fixture.detectChanges();
    expect(getNewsSpy).toHaveBeenCalledTimes(1);
    expect(getNewsSpy).toHaveBeenCalledWith(newsSelection);
  });
});
