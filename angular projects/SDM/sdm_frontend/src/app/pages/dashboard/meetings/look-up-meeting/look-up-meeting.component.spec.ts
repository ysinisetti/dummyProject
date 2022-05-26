import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { LookUpMeetingComponent } from './look-up-meeting.component'

describe('LookUpMeetingComponent', () => {
  let component: LookUpMeetingComponent
  let fixture: ComponentFixture<LookUpMeetingComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LookUpMeetingComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LookUpMeetingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
