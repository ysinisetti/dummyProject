import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditenablementComponent } from './editenablement.component';

describe('EditenablementComponent', () => {
  let component: EditenablementComponent;
  let fixture: ComponentFixture<EditenablementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditenablementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditenablementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
