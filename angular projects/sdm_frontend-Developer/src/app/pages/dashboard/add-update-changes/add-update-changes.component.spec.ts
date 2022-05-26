import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateChangesComponent } from './add-update-changes.component';

describe('AddUpdateChangesComponent', () => {
  let component: AddUpdateChangesComponent;
  let fixture: ComponentFixture<AddUpdateChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
