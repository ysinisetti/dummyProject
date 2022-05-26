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
  tableData = []
  modelVisible: boolean
  form: FormGroup
  ProjectName: string
  id: any
  projectId: string
  perData: any
  projectid: any
  createData: any
  customerName: any
  optionList:[]
  addBtn = false
  editBtn = false
  addEditdailogheader: string
  btnDisabled: boolean
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private dataService: DataService,
    private notification: NzNotificationService,
    
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      slaTarget: [null, [Validators.required]],
      low: [
        null,
        [Validators.required, Validators.maxLength(150), Validators.pattern('^[\\s0-9a-zA-z]*$')],
      ],
      normal: [
        null,
        [Validators.required, Validators.maxLength(150), Validators.pattern('^[\\s0-9a-zA-z]*$')],
      ],
      high: [
        null,
        [Validators.required, Validators.maxLength(150), Validators.pattern('^[\\s0-9a-zA-z]*$')],
      ],
      urgent: [
        null,
        [Validators.required, Validators.maxLength(150), Validators.pattern('^[\\s0-9a-zA-z]*$')],
      ],
    })
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    console.log('mouni', this.ProjectName)
    this.customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.getAllData()
    this.getDropDown()
  }

  
   // <------ Dropdown integration------->
  getDropDown() {
    this.dataService.get(apis.slaDropDown).subscribe(res => {
      console.log('dropdown', res)
      this.optionList = res
    })
  }
 
 // <------  Table data  integration------->
  getAllData() {
    const id = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.dataService.getSla(apis.slaGet, id).subscribe(res => {
      this.tableData = res
    })
  }
 // <------Methods for routing------->
  goToDashboard() {
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  goToHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }
// <------Add popup------->
  addRow(): void {
    this.modelVisible = true
    this.addEditdailogheader = 'Add SLA'
    this.editBtn = false
    this.addBtn = true
  }
  // <------ Method for closing Popup------->
  cancel(): void {
    this.form.reset()
    this.modelVisible = false
  }

 // <------ method for Edit Popup and patching-------> 
  editRow(values): void {
    console.log(values)
    this.addEditdailogheader = 'Edit SLA'
    this.modelVisible = true
    this.editBtn = true
    this.addBtn = false
    this.perData = values
    this.form.get('slaTarget').patchValue(values.slaTargets)
    this.form.get('low').patchValue(values.low)
    this.form.get('normal').patchValue(values.normal)
    this.form.get('high').patchValue(values.high)
    this.form.get('urgent').patchValue(values.urgent)
  }
// <------integration for adding data------->
  addTarget() {
    this.btnDisabled = true;
    if (this.form.untouched || this.form.invalid) {
      this.modelVisible = true
      this.submitAdd()
    }
    const id = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    if (this.form.valid) {
      let dataToAPI = {
        slaTargets: this.form.controls.slaTarget.value,
        low: this.form.controls.low.value,
        normal: this.form.controls.normal.value,
        high: this.form.controls.high.value,
        urgent: this.form.controls.urgent.value,
        projectId: id,
      }
      console.log('--->data to table', dataToAPI)

      this.dataService.post(apis.slaPost, dataToAPI).subscribe((res: any) => {
        this.getAllData()
        console.log(res)
        this.modelVisible = false
        this.form.reset()
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
      this.form.reset()
    }
    this.btnDisabled = false;
  }
// <------integration for updating data------->
  updateTarget() {
    if (this.form.untouched || this.form.invalid) {
      this.modelVisible = true
      this.submitAdd()
    }
    this.id = this.perData.id
    this.projectid = this.perData.projectId
    if (this.form.valid) {
      let updated = {
        slaTargets: this.form.get('slaTarget').value,
        low: this.form.get('low').value,
        normal: this.form.get('normal').value,
        high: this.form.get('high').value,
        urgent: this.form.get('urgent').value,
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
      this.modelVisible = false
    }
  }
// <------integration for deleting data------->
  deleteTarget(tableData): void {
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
// <------ Method for restricting formdata based on validation------->
  submitAdd(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsTouched()
      this.form.controls[i].updateValueAndValidity()
    }
  }
 
}
