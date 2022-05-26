import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUiPagenationComponent } from './search-ui-pagenation.component';

describe('SearchUiPagenationComponent', () => {
  let component: SearchUiPagenationComponent;
  let fixture: ComponentFixture<SearchUiPagenationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchUiPagenationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUiPagenationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
