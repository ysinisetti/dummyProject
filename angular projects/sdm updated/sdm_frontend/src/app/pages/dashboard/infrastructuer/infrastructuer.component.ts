import { DataService } from './../../../data.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { apis } from 'src/app/api'
import { HostListener } from '@angular/core'
import { DatePipe } from '@angular/common'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
@Component({
  selector: 'app-infrastructuer',
  templateUrl: './infrastructuer.component.html',
  styleUrls: ['./infrastructuer.component.scss'],
  providers: [DatePipe],
})
export class InfrastructuerComponent implements OnInit {
  allInfrasDetails: any
  visible = false
  inputValue?: string
  isVisible = false
  isVisible1 = false
  searchTask: any
  addInfraForm: FormGroup
  editInfraForm: FormGroup
  searchForm: FormGroup
  inputValue1?: string
  noteForm: FormGroup
  selectedInfraId: any
  loggedUserId = JSON.parse(sessionStorage.getItem('loginData')).LoginId
  selectedProjectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
  userName = JSON.parse(sessionStorage.getItem('loginData')).FName
  records: any
  ProjectName: string
  selectedType: string
  pageNum: number
  pageSize: number
  noOfRecords: number
  totalPages: number
  searchTerm: string
  header = 'Search'
  customerName: any

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private datePipe: DatePipe,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.editInfraForm = this.fb.group({
      contactEmailId: [
        '',
        [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
      ],
      contactName: [
        '',
        [Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-z ]*$')],
      ],
      description: [
        '',
        [Validators.required, Validators.maxLength(225), Validators.pattern('^[a-zA-z0-9 ]*$')],
      ],
      environment: [
        '',
        [Validators.required, Validators.maxLength(1), Validators.pattern('^[a-zA-z]*$')],
      ],
      hostName: [
        '',
        [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-z0-9.]*$')],
      ],
      infraType: [
        '',
        [Validators.required, Validators.maxLength(1), Validators.pattern('^[a-zA-z]*$')],
      ],
      location: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z ]*$')],
      ],
      name: [
        '',
        [Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-z ]*$')],
      ],
      operatingSystem: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z0-9 .]*$')],
      ],
      privateIPAddress: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'),
        ],
      ],
      publicIPAddress: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'),
        ],
      ],
    })
    this.addInfraForm = this.fb.group({
      contactEmailId: [
        '',
        [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
      ],
      contactName: [
        '',
        [Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-z ]*$')],
      ],
      description: [
        '',
        [Validators.required, Validators.maxLength(225), Validators.pattern('^[a-zA-z0-9 ]*$')],
      ],
      environment: [
        '',
        [Validators.required, Validators.maxLength(1), Validators.pattern('^[a-zA-z]*$')],
      ],
      hostName: [
        '',
        [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-z0-9 . ]*$')],
      ],
      infraType: [
        '',
        [Validators.required, Validators.maxLength(1), Validators.pattern('^[a-zA-z]*$')],
      ],
      location: [
        '',
        [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-z ]*$')],
      ],
      name: [
        '',
        [Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-z ]*$')],
      ],
      operatingSystem: ['', [Validators.required, Validators.pattern('^[a-zA-z0-9 .]*$')]],
      privateIPAddress: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'),
        ],
      ],
      publicIPAddress: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'),
        ],
      ],
    })

    this.searchForm = this.fb.group({
      searchValue: [null],
      searchContact: [null],
      searchType: [null],
      searchLocation: [null],
    })

    this.pageSize = 10
    this.pageNum = 1
    this.totalPages = 10
    this.getAllInfras()
  }

  //////////////////////BreadCrumb Routing////////////

  dashboard() {
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  ////////////////////////////////Get all Infra Records

  getAllInfras() {
    const infraType = this.searchForm.controls.searchType.value
    const location = this.searchForm.controls.searchLocation.value
    const contactName = this.searchForm.controls.searchContact.value
    const name = this.searchForm.controls.searchValue.value
    var reqBody = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      projectId: JSON.parse(sessionStorage.getItem('projectDetails')).Id,
      infraType: infraType === null || infraType === undefined ? '' : infraType,
      location: location === null || location === undefined ? '' : location,
      contactName: contactName === null || contactName === undefined ? '' : contactName,
      name: name === null || name === undefined ? '' : name,
    }
    console.log('ReqBody', reqBody)
    this.dataService.post(apis.getAllInfras, reqBody).subscribe(res => {
      console.log('All Infras', res)
      this.allInfrasDetails = res[0].data
      this.totalPages = res[0].count
      this.records = res[0].count
    })
  }

  InfraType = {
    V: 'Virtual Server',
    P: 'Physical Server',
  }
  InfraTypes = [
    { label: 'Virtual Server', value: 'V' },
    { label: 'Physical Server', value: 'P' },
  ]
  locations = [
    { label: 'AWS', value: 'A' },
    { label: 'On prem', value: 'O' },
    { label: 'Azure', value: 'Z' },
  ]
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
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to insert', 'Your data is failed to add')
      }
      this.getAllInfras()
    })
    this.isVisible = false
    this.addInfraForm.reset()
    this.getAllInfras()
  }

  //////////////////////////////Update/Edit an Infra based on Id////////////////////////

  editRow(values): void {
    this.selectedInfraId = values.id
    console.log(values)
    this.isVisible1 = true
    this.editInfraForm.get('contactEmailId').patchValue(values.contactEmailId)
    this.editInfraForm.get('contactName').patchValue(values.contactName)
    this.editInfraForm.get('description').patchValue(values.description)
    this.editInfraForm.get('environment').patchValue(values.environment)
    this.editInfraForm.get('hostName').patchValue(values.hostName)
    this.editInfraForm.get('infraType').patchValue(values.infraType)
    this.editInfraForm.get('location').patchValue(values.location)
    this.editInfraForm.get('name').patchValue(values.name)
    this.editInfraForm.get('operatingSystem').patchValue(values.operatingSystem)
    this.editInfraForm.get('privateIPAddress').patchValue(values.privateIPAddress)
    this.editInfraForm.get('publicIPAddress').patchValue(values.publicIPAddress)
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
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
      this.getAllInfras()
    })
    this.isVisible1 = false
    this.getAllInfras()
  }

  // Delete a infra based on Id

  deleteRow(id): void {
    let dId = { id: id }
    this.dataService.post(apis.deleteInfras, dId).subscribe(res => {
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('error', 'Not Deleted', 'Record deleted')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create(
          'success',
          'Successfully Deleted',
          'Your data is Deleted successfully',
        )
      }
      this.getAllInfras()
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
  submitForm1(x) {
    console.log('submitted', this.editInfraForm, x)
  }

  //pagination
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllInfras()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.pageNum = 1
    this.getAllInfras()
  }

  onChange(): void {
    console.log('change')
    this.getAllInfras()
  }

  resetSearchFields() {
    this.searchForm.reset()
    this.getAllInfras()
  }

  //////////////////////Breadcrumb//////////////////

  gotoHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }

  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
