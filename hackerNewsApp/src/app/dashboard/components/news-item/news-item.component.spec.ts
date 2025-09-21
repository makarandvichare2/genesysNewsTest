import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsItemComponent } from './news-item.component';
import { DateInWordsPipe } from '../../pipes/date-in-words.pipe';
import { NewsTitlePipe } from '../../pipes/news-title.pipe';
import { INewsItem } from '../../interfaces/news-item.interface';
import { NewsType } from '../../enums/news-type.enum';

describe('NewsItemComponent', () => {
  let component: NewsItemComponent;
  let fixture: ComponentFixture<NewsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsItemComponent,DateInWordsPipe, NewsTitlePipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    //component = fixture.debugElement.query(By.directive(NewsItemComponent)).componentInstance;
    component.itemIndex =1;
    component.newsItem = <INewsItem>{
      title :'title 1',
      by:'user 1',
      descendants:2,
      id:1,
      score:22,
      time:3232313,
      type:NewsType.Story,
      url:''
    }
    expect(component).toBeTruthy();
  });
});
