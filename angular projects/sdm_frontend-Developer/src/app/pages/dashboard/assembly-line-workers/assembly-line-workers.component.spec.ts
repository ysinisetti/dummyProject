import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyLineWorkersComponent } from './assembly-line-workers.component';

describe('AssemblyLineWorkersComponent', () => {
  let component: AssemblyLineWorkersComponent;
  let fixture: ComponentFixture<AssemblyLineWorkersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblyLineWorkersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyLineWorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
