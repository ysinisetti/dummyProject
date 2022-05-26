import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubProjectsComponent } from './sub-projects.component';

describe('SubProjectsComponent', () => {
  let component: SubProjectsComponent;
  let fixture: ComponentFixture<SubProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
