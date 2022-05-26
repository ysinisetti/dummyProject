import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAlertsComponent } from './create-alerts.component';

describe('CreateAlertsComponent', () => {
  let component: CreateAlertsComponent;
  let fixture: ComponentFixture<CreateAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
