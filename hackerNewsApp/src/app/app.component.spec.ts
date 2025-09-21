import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NewsService } from './dashboard/services/news.service';
import { TopMenuComponent } from './dashboard/components/top-menu/top-menu.component';
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';

jest.mock('./dashboard/services/news.service');
describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopMenuComponent, RouterOutlet],
      providers: [NewsService]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    //Act
    const app = fixture.componentInstance;

    //Assert
    expect(app).toBeTruthy();
  });

  it('should have top menu', () => {
    //Act
    fixture.detectChanges();
    const topMenuComponent = fixture.debugElement.query(By.directive(TopMenuComponent));

    //Assert
    expect(topMenuComponent).toBeTruthy();
  });
});
