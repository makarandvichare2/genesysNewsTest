import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsDashBoardComponent } from './news-dashboard.component';

describe('NewsDashBoardComponent', () => {
  let component: NewsDashBoardComponent;
  let fixture: ComponentFixture<NewsDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsDashBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
