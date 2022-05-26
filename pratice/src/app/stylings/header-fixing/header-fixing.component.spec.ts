import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFixingComponent } from './header-fixing.component';

describe('HeaderFixingComponent', () => {
  let component: HeaderFixingComponent;
  let fixture: ComponentFixture<HeaderFixingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderFixingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderFixingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
