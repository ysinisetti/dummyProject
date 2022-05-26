import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayStoreComponent } from './play-store.component';

describe('PlayStoreComponent', () => {
  let component: PlayStoreComponent;
  let fixture: ComponentFixture<PlayStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
