import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraTableDataComponent } from './extra-table-data.component';

describe('ExtraTableDataComponent', () => {
  let component: ExtraTableDataComponent;
  let fixture: ComponentFixture<ExtraTableDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraTableDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
