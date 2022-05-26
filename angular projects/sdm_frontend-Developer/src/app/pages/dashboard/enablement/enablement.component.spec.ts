import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { EnablementComponent } from './enablement.component'

describe('EnablementComponent', () => {
  let component: EnablementComponent
  let fixture: ComponentFixture<EnablementComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnablementComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EnablementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
