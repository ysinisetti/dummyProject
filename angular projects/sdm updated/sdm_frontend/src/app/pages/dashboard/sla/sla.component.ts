import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'

import { NzNotificationService } from 'ng-zorro-antd'

@Component({
  selector: 'app-sla',
  templateUrl: './sla.component.html',
  styleUrls: ['./sla.component.scss'],
})
export class SlaComponent implements OnInit {
  searchTerm
  tableData = []
  optionList1 = [
    { label: 'Response Time', value: 'Response Time' },
    { label: 'Resolution Time', value: 'Resolution Time' },
  ]
  isVisible: boolean
  addData: FormGroup
  isVisible1: boolean = false
  editData: FormGroup
  ProjectName: string
  id: any
  id1: any
  projectId: string
  perData: any
  projectid: any
  createData: any
  coustmorName: any
  customerName: any
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private dataService: DataService,
    private notification: NzNotificationService,
  ) {}

  ngOnInit(): void {
    this.addData = this.fb.group({
      slaTarget: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      low: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      normal: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      high: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      urgent: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
    })
    this.editData = this.fb.group({
      slaTarget: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      low: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      normal: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      high: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      urgent: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
    })
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    console.log('mouni', this.ProjectName)
    this.customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    //this.ProjectName = JSON.parse(sessionStorage.getItem('SelectedProjectDetails.ProjectName')
    //this.ProjectName = sessionStorage.getItem('pName');
    this.getAllData()
  }
  onCurrentPageDataChange(data) {
    console.log(data)
  }
  addRow(): void {
    this.isVisible = true
  }
  editRow(values): void {
    console.log(values)
    this.isVisible1 = true
    this.perData = values
    this.editData
      .get('slaTarget')
      .patchValue(this.optionList1.filter(x => x.value === values.slaTargets)[0].value)
    this.editData.get('low').patchValue(values.low)
    this.editData.get('normal').patchValue(values.normal)
    this.editData.get('high').patchValue(values.high)
    this.editData.get('urgent').patchValue(values.urgent)
  }
  handleCancel(): void {
    this.isVisible = false
    this.isVisible1 = false
  }
  getAllData() {
    const id = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.dataService.getSla(apis.slaGet, id).subscribe(res => {
      this.tableData = res
    })
  }
  save(): void {
    this.isVisible = true
    this.isVisible1 = true
  }
  addTarget() {
    const id = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    let dataToAPI = {
      slaTargets: this.addData.controls.slaTarget.value,
      low: this.addData.controls.low.value,
      normal: this.addData.controls.normal.value,
      high: this.addData.controls.high.value,
      urgent: this.addData.controls.urgent.value,
      projectId: id,
    }
    console.log('--->data to table', dataToAPI)
    this.dataService.post(apis.slaPost, dataToAPI).subscribe((res: any) => {
      this.getAllData()
      console.log(res)
      this.isVisible = false

      this.createData = res
      console.log('createData data=======>', this.createData)
      if (this.createData.hasOwnProperty('success') === true) {
        this.notification.create(
          'success',
          'Successfully Added',
          'Your data has been successfully added',
        )
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
      }
    })
    this.addData.reset()
  }
  updateTarget() {
    console.log(this.editData.value)
    this.id = this.perData.id
    this.projectid = this.perData.projectId
    let updated = {
      slaTargets: this.editData.get('slaTarget').value,
      low: this.editData.get('low').value,
      normal: this.editData.get('normal').value,
      high: this.editData.get('high').value,
      urgent: this.editData.get('urgent').value,
      id: this.perData.id,
      projectId: this.projectid,
    }
    console.log('--->data to edit', updated)
    this.dataService.post(apis.slaPut, updated).subscribe((res: any) => {
      console.log('res', res)

      this.getAllData()

      this.createData = res
      console.log('createData data=======>', this.createData)
      if (this.createData.hasOwnProperty('success') === true) {
        this.notification.create(
          'success',
          'Successfully Updated',
          'Your data has been successfully Updated',
        )
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
      }
    })
    this.isVisible1 = false
  }

  deleteRow(tableData): void {
    console.log('mounika', tableData)
    let dId = {
      id: tableData,
    }
    this.dataService.post(apis.slaDelete, dId).subscribe(res => {
      console.log('deleted')
      this.getAllData()
      console.log(res)

      this.createData = res
      console.log('createData data=======>', this.createData)
      if (this.createData.hasOwnProperty('Result') === true) {
        this.notification.create(
          'success',
          'Successfully Deleted',
          'Your data has been successfully Deleted',
        )
      } else {
        this.notification.create('error', 'Failed to Delete', 'Your data is failed to Delete ')
      }
    })
  }
  details() {
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  gotoHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }
  // detailsh(){
  //   this.route.navigate(['/dashboard/allProjects',])
  // }
  // details() {
  //   //this.ProjectName = sessionStorage.getItem('pName')
  //   this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  // }
}
