import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatustrackerComponent } from './statustracker.component';

describe('StatustrackerComponent', () => {
  let component: StatustrackerComponent;
  let fixture: ComponentFixture<StatustrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatustrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatustrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
