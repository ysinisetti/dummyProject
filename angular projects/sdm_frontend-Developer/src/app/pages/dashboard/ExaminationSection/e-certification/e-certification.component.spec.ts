import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ECertificationComponent } from './e-certification.component';

describe('ECertificationComponent', () => {
  let component: ECertificationComponent;
  let fixture: ComponentFixture<ECertificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ECertificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ECertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
