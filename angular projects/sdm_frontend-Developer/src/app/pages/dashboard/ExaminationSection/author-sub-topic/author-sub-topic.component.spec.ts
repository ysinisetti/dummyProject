import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorSubTopicComponent } from './author-sub-topic.component';

describe('AuthorSubTopicComponent', () => {
  let component: AuthorSubTopicComponent;
  let fixture: ComponentFixture<AuthorSubTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorSubTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorSubTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
