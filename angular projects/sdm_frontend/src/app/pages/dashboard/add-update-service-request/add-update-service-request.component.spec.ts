import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AddUpdateServiceRequestComponent } from './add-update-service-request.component'

describe('AddUpdateServiceRequestComponent', () => {
  let component: AddUpdateServiceRequestComponent
  let fixture: ComponentFixture<AddUpdateServiceRequestComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpdateServiceRequestComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateServiceRequestComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
