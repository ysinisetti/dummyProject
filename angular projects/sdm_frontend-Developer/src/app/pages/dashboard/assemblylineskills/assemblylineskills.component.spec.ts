import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblylineskillsComponent } from './assemblylineskills.component';

describe('AssemblylineskillsComponent', () => {
  let component: AssemblylineskillsComponent;
  let fixture: ComponentFixture<AssemblylineskillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblylineskillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblylineskillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
