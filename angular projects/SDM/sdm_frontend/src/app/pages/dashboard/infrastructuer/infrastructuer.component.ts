import { DataService } from './../../../data.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Tasks } from '../tasks/tasks.component'
import { Router } from '@angular/router'
import { apis } from 'src/app/api'
import { Server } from 'http'

@Component({
  selector: 'app-infrastructuer',
  templateUrl: './infrastructuer.component.html',
  styleUrls: ['./infrastructuer.component.scss'],
})
export class InfrastructuerComponent implements OnInit {
  allResoursesDetails: any

  visible = false
  inputValue?: string
  isVisible = false
  isVisible1 = false
  searchTask: any
  addInfraForm: FormGroup
  editInfraForm: FormGroup
  inputValue1?: string
  noteForm: FormGroup
  selectedInfraId: any
  loggedUserId = JSON.parse(sessionStorage.getItem('loginData')).LoginId
  selectedProjectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
  userName = JSON.parse(sessionStorage.getItem('loginData')).FName
  records: any
  ProjectName: string

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private route: Router,
  ) {}

  ngOnInit(): void {
    this.editInfraForm = this.fb.group({
      contactEmailId: [
        '',
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      contactName: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z ]*$')],
      ],
      // createdBy: [
      // '',
      // [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z ]*$')],
      // ],
      description: [
        '',
        [Validators.required, Validators.maxLength(250), Validators.pattern('^[a-zA-z0-9 ]*$')],
      ],
      environment: [
        '',
        [Validators.required, Validators.maxLength(1), Validators.pattern('^[a-zA-z]*$')],
      ],
      hostName: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z0-9.]*$')],
      ],
      infraType: [
        '',
        [Validators.required, Validators.maxLength(1), Validators.pattern('^[a-zA-z]*$')],
      ],
      location: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z ]*$')],
      ],
      // modifiedBy: [
      // '',
      // [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z ]*$')],
      // ],
      name: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z ]*$')],
      ],
      operatingSystem: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z0-9 .]*$')],
      ],
      privateIPAddress: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'),
        ],
      ],
      publicIPAddress: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'),
        ],
      ],
      // privateIPAddress: ['',[ Validators.required, Validators.maxLength(15),Validators.pattern('^[0-9 .]*$')]],
      // publicIPAddress: ['',[ Validators.required, Validators.maxLength(15),Validators.pattern('^[0-9 .]*$')]],
    })
    this.addInfraForm = this.fb.group({
      contactEmailId: [
        '',
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      contactName: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z ]*$')],
      ],
      // createdBy: [
      // '',
      // [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z ]*$')],
      // ],
      description: [
        '',
        [Validators.required, Validators.maxLength(250), Validators.pattern('^[a-zA-z0-9 ]*$')],
      ],
      environment: [
        '',
        [Validators.required, Validators.maxLength(1), Validators.pattern('^[a-zA-z]*$')],
      ],
      hostName: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z0-9 . ]*$')],
      ],
      infraType: [
        '',
        [Validators.required, Validators.maxLength(1), Validators.pattern('^[a-zA-z]*$')],
      ],
      location: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z ]*$')],
      ],
      // modifiedBy: [
      // '',
      // [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z ]*$')],
      // ],
      name: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z ]*$')],
      ],
      operatingSystem: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z0-9 .]*$')],
      ],
      privateIPAddress: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'),
        ],
      ],
      publicIPAddress: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'),
        ],
      ],
      // privateIPAddress: ['',[ Validators.required, Validators.maxLength(15),Validators.pattern('^[0-9 .]*$')]],
      // publicIPAddress: ['',[ Validators.required, Validators.maxLength(15),Validators.pattern('^[0-9 .]*$')]],
    })
    // this.noteForm = this.fb.group({
    // notes : ['',[Validators.required, Validators.maxLength(250),Validators.pattern('^[a-zA-z]*$')]]
    // })

    this.getAllInfras()
    this.ProjectName = sessionStorage.getItem('pName')
  }

  //Get all Infra Records

  getAllInfras() {
    this.dataService.get(apis.getAllInfras).subscribe(res => {
      console.log('All Infras', res)
      ;(this.records = res.length), (this.allResoursesDetails = res)
    })
  }

  InfraType = {
    s: 'Physical Server',
    V: 'Virtual Server',
    P: 'Physical Server',
  }
  EnvironmentType = {
    l: 'Staging',
    w: 'Dev',
    S: 'Staging',
    D: 'Dev',
    P: 'Prod',
  }
  OperatingSystem = {
    w: 'Windows',
    l: 'Linux',
    M: 'Mac',
    W: 'Windows',
    L: 'Linux',
  }

  //Add a new Infra

  addRow(): void {
    this.isVisible = true
  }
  newInfra() {
    console.log(this.addInfraForm.controls.infraType.value)
    let newInfras = {
      contactEmailId: this.addInfraForm.controls.contactEmailId.value,
      contactName: this.addInfraForm.controls.contactName.value,
      createdBy: this.userName,
      description: this.addInfraForm.controls.description.value,
      environment: this.addInfraForm.controls.environment.value,
      hostName: this.addInfraForm.controls.hostName.value,
      // "id": 1,
      infraType: this.addInfraForm.controls.infraType.value,
      location: this.addInfraForm.controls.location.value,
      modifiedBy: this.userName,
      name: this.addInfraForm.controls.name.value,
      operatingSystem: this.addInfraForm.controls.operatingSystem.value,
      privateIPAddress: this.addInfraForm.controls.privateIPAddress.value,
      projectId: this.selectedProjectId,
      publicIPAddress: this.addInfraForm.controls.publicIPAddress.value,
      userId: this.loggedUserId,
    }
    this.dataService.post(apis.postInfras, newInfras).subscribe(res => {
      // console.log('releases rsponse', res)
      // console.log('Add new Release', newInfras)
    })
    this.isVisible = false
    this.getAllInfras()
    this.addInfraForm.reset()
    this.getAllInfras()
  }

  //Update/Edit an Infra based on Id

  editRow(values): void {
    this.selectedInfraId = values.id
    console.log(this.selectedInfraId)
    this.isVisible1 = true
    this.editInfraForm.get('contactEmailId').patchValue(values.contactEmailId)
    this.editInfraForm.get('contactName').patchValue(values.contactName)
    //this.editInfraForm.get('createdBy').patchValue(values.createdBy)
    this.editInfraForm.get('description').patchValue(values.description)
    this.editInfraForm.get('environment').patchValue(values.environment)
    this.editInfraForm.get('hostName').patchValue(values.hostName)
    this.editInfraForm.get('infraType').patchValue(values.infraType)
    this.editInfraForm.get('location').patchValue(values.location)
    //this.editInfraForm.get('modifiedBy').patchValue(values.modifiedBy)
    this.editInfraForm.get('name').patchValue(values.name)
    this.editInfraForm.get('operatingSystem').patchValue(values.operatingSystem)
    this.editInfraForm.get('privateIPAddress').patchValue(values.privateIPAddress)
    //this.editInfraForm.get('projectId').patchValue(values.Description)
    this.editInfraForm.get('publicIPAddress').patchValue(values.publicIPAddress)
    //this.editInfraForm.get('userId').patchValue(values.Description)
  }
  modifyInfra() {
    let updated = {
      contactEmailId: this.editInfraForm.controls.contactEmailId.value,
      contactName: this.editInfraForm.controls.contactName.value,
      createdBy: this.userName,
      description: this.editInfraForm.controls.description.value,
      environment: this.editInfraForm.controls.environment.value,
      hostName: this.editInfraForm.controls.hostName.value,
      id: this.selectedInfraId,
      infraType: this.editInfraForm.controls.infraType.value,
      location: this.editInfraForm.controls.location.value,
      modifiedBy: this.userName,
      name: this.editInfraForm.controls.name.value,
      operatingSystem: this.editInfraForm.controls.operatingSystem.value,
      privateIPAddress: this.editInfraForm.controls.privateIPAddress.value,
      projectId: this.selectedProjectId,
      publicIPAddress: this.editInfraForm.controls.publicIPAddress.value,
      userId: this.loggedUserId,
    }
    this.dataService.post(apis.updateInfras, updated).subscribe(res => {
      console.log('updating Releases', res)
    })
    this.isVisible1 = false
    this.getAllInfras()
  }

  // Delete a infra based on Id

  deleteRow(id): void {
    let dId = { id: id }
    this.dataService.post(apis.deleteInfras, dId).subscribe(res => {
      console.log(res)
    })
    this.getAllInfras()
  }

  cancel(): void {
    this.isVisible = false
    this.addInfraForm.reset()
    this.isVisible1 = false
  }
  save(): void {
    this.isVisible = true
    this.isVisible1 = true
  }

  // submitForm() {
  // console.log('submitted', this.addInfraForm)
  // }

  submitForm1(x) {
    console.log('submitted', this.editInfraForm, x)
  }

  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
