import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MileStonesComponent } from './mile-stones.component';

describe('MileStonesComponent', () => {
  let component: MileStonesComponent;
  let fixture: ComponentFixture<MileStonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MileStonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MileStonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
