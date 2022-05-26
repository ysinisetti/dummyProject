import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectmeetingsComponent } from './projectmeetings.component'

describe('ProjectmeetingsComponent', () => {
  let component: ProjectmeetingsComponent
  let fixture: ComponentFixture<ProjectmeetingsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectmeetingsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectmeetingsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
