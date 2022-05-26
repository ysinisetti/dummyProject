import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSidebarFixingComponent } from './header-sidebar-fixing.component';

describe('HeaderSidebarFixingComponent', () => {
  let component: HeaderSidebarFixingComponent;
  let fixture: ComponentFixture<HeaderSidebarFixingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderSidebarFixingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSidebarFixingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
