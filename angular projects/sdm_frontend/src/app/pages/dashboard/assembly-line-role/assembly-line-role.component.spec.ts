import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AssemblyLineRoleComponent } from './assembly-line-role.component'

describe('AssemblyLineRoleComponent', () => {
  let component: AssemblyLineRoleComponent
  let fixture: ComponentFixture<AssemblyLineRoleComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssemblyLineRoleComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyLineRoleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
