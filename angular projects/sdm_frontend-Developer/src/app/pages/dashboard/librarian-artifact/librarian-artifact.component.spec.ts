import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarianArtifactComponent } from './librarian-artifact.component';

describe('LibrarianArtifactComponent', () => {
  let component: LibrarianArtifactComponent;
  let fixture: ComponentFixture<LibrarianArtifactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibrarianArtifactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrarianArtifactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
