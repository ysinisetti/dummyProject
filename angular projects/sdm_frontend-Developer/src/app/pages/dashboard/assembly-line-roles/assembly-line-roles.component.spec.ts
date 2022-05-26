import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyLineRolesComponent } from './assembly-line-roles.component';

describe('AssemblyLineRolesComponent', () => {
  let component: AssemblyLineRolesComponent;
  let fixture: ComponentFixture<AssemblyLineRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblyLineRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyLineRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
