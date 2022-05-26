import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { UpdateIssuesComponent } from './update-issues.component'

describe('UpdateIssuesComponent', () => {
  let component: UpdateIssuesComponent
  let fixture: ComponentFixture<UpdateIssuesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateIssuesComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateIssuesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
