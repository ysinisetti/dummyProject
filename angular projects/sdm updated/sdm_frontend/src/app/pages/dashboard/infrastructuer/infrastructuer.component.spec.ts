import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuerComponent } from './infrastructuer.component';

describe('InfrastructuerComponent', () => {
  let component: InfrastructuerComponent;
  let fixture: ComponentFixture<InfrastructuerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfrastructuerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
