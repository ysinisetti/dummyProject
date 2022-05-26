import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchServerPagenationComponent } from './search-server-pagenation.component';

describe('SearchServerPagenationComponent', () => {
  let component: SearchServerPagenationComponent;
  let fixture: ComponentFixture<SearchServerPagenationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchServerPagenationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchServerPagenationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
