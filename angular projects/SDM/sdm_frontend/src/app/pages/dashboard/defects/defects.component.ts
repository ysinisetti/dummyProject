import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-defects',
  templateUrl: './defects.component.html',
  styleUrls: ['./defects.component.scss'],
})
export class DefectsComponent implements OnInit {
  searchTerm
  projectid: any
  type: any
  title: any
  rowdata: any
  description: any
  taskId: any
  releaseId: any
  targetDate: any
  resolvedDate: any
  severity: any
  createdBy: any
  modifiedDate: any
  modifiedBy: any
  tableData = []
  prjForm: FormGroup
  addForm: boolean
  addData: FormGroup
  editForm: boolean = false
  editData: FormGroup
  perData: any
  ProjectName: string

  optionList3 = [
    { label: 'Minor', value: 'I' },
    { label: 'Moderate', value: 'O' },
    { label: 'Major', value: 'A' },
    { label: 'Cosmetic', value: 'C' },
    { label: 'Critical', value: 'R' },
  ]
  optionList2 = [
    { label: 'Defects', value: 'D' },
    { label: 'Change Request', value: 'C' },
    { label: 'Enhancement', value: 'E' },
    { label: 'Service Request', value: 'S' },
  ]
  optionList1 = [
    { label: 'Low', value: 'L' },
    { label: 'Medium', value: 'M' },
    { label: 'High', value: 'H' },
  ]
  optionList = [
    { label: 'Open', value: 'Open' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Under investigation', value: 'Under investigation' },
    { label: 'Resolved', value: 'Resolved' },
  ]
  editstartdate: Date

  constructor(private fb: FormBuilder, private dataService: DataService, private route: Router) {}

  ngOnInit(): void {
    this.addData = this.fb.group({
      releaseId: [
        '',
        [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
      title: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      priority: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      assignedTo: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      status: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      targetDate: ['', [Validators.required]],
      AssignedDate: ['', [Validators.required]],
      severity: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      type: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      description: [
        '',
        [Validators.required, Validators.maxLength(500), Validators.pattern('^[\\sa-zA-z0-9 .]*$')],
      ],
    })

    this.editData = this.fb.group({
      releaseId: [
        '',
        [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
      type: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      title: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      priority: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      assignedTo: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      status: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      severity: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      textArea: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      targetDate: ['', [Validators.required]],
      resolvedDate: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      assignedDate: ['', [Validators.required]],
    })
    this.ProjectName = sessionStorage.getItem('pName')
    this.getAllData()
  }
  onCurrentPageDataChange(data) {
    console.log(data)
  }
  addRow(): void {
    this.addForm = true
  }

  editRow(values): void {
    this.editForm = true
    this.perData = values
    this.editstartdate = new Date(values.assignedDate)
    this.editData.get('type').patchValue(this.optionList2.filter(x => x.value === values.type)[0])
    this.editData.get('title').patchValue(values.title)
    this.editData
      .get('priority')
      .patchValue(this.optionList1.filter(x => x.value === values.priority)[0])
    this.editData.get('assignedTo').patchValue(values.assignedTo)
    this.editData
      .get('status')
      .patchValue(this.optionList.filter(x => x.value === values.status)[0])
    this.editData.get('assignedDate').patchValue(values.assignedDate)
    this.editData
      .get('severity')
      .patchValue(this.optionList3.filter(x => x.value === values.severity)[0])
    this.editData.get('resolvedDate').patchValue(values.resolvedDate)
    this.editData.get('textArea').patchValue(values.description)
    this.editData.get('releaseId').patchValue(values.releaseId)
  }
  handleCancel(): void {
    this.addForm = false
    this.addData.reset()
    this.editForm = false
  }
  // save(): void {
  //   this.addForm = true
  //   this.editForm = true
  // }

  getAllData() {
    this.dataService.get(apis.issueGet).subscribe(res => {
      this.tableData = res
      console.log('tabledata', this.tableData)
    })
  }

  addIssue() {
    this.addForm = true
    this.projectid = '1'
    this.taskId = '1'
    //this.releaseId = '1'
    this.resolvedDate = '2020-10-06'
    this.createdBy = 'chandan'
    this.modifiedBy = 'pooja'
    let dataToAPI = {
      type: this.addData.controls.type.value,
      title: this.addData.controls.title.value,
      priority: this.addData.controls.priority.value,
      assignedTo: this.addData.controls.assignedTo.value,
      status: this.addData.controls.status.value,
      targetDate: this.addData.controls.targetDate.value,
      description: this.addData.controls.description.value,
      releaseId: this.addData.controls.releaseId.value,
      assignedDate: this.addData.controls.AssignedDate.value,
      severity: this.addData.controls.severity.value,
      createdBy: this.createdBy,
      modifiedBy: this.modifiedBy,
      projectId: this.projectid,
      taskId: this.taskId,
      resolvedDate: this.resolvedDate,
    }
    console.log('--->data to table', dataToAPI)
    this.dataService.post(apis.issuesPost, dataToAPI).subscribe((res: any) => {
      this.getAllData()
      console.log(res)
    })
    this.addForm = false
    this.addData.reset()
  }

  updateIssue() {
    this.editForm = false
    this.projectid = this.perData.projectId
    this.taskId = this.perData.taskId
    //this.releaseId = this.perData.releaseId
    this.targetDate = '2020-10-06'
    this.createdBy = this.perData.createdBy
    this.modifiedBy = this.perData.modifiedBy
    const data = {
      id: this.perData.id,
      type: this.editData.get('type').value.value,
      title: this.editData.get('title').value,
      priority: this.editData.get('priority').value.value,
      assignedTo: this.editData.get('assignedTo').value,
      status: this.editData.get('status').value.value,
      targetDate: this.targetDate,
      description: this.editData.get('textArea').value,
      projectId: this.projectid,
      taskId: this.taskId,
      releaseId: this.editData.get('releaseId').value,
      assignedDate: this.editData.get('assignedDate').value,
      resolvedDate: this.editData.get('resolvedDate').value,
      severity: this.editData.controls.severity.value.value,
      createdBy: this.createdBy,
      modifiedBy: this.modifiedBy,
    }
    console.log(data)
    this.dataService.post(apis.issuePut, data).subscribe((res: any) => {
      this.getAllData()
    })
    this.addForm = false
  }

  deleteRow(data) {
    console.log('ID', data)

    let dId = {
      id: data.id,
    }

    this.dataService.post(apis.issueDelete, dId).subscribe(res => {
      console.log('deleted')
      this.getAllData()
      console.log(res)
    })
  }
  myPriority = {
    H: 'High',
    L: 'low',
    M: 'Medium',
  }
  myType = {
    D: 'Defects',
    C: 'Change Request',
    E: 'Enhancement',
    S: 'Service Request',
  }
  mySeverity = {
    I: 'Minor',
    O: 'Moderate',
    A: 'Major',
    C: 'Cosmetic',
    R: 'Critical',
  }
  assignedValue: Date | null = null
  targetValue: Date | null = null
  endOpen = false

  disabledAssignedDate = (assignedValue: Date): boolean => {
    if (!assignedValue || !this.targetValue) {
      return false
    }
    return assignedValue.getTime() > this.targetValue.getTime()
  }

  disabledTargetDate = (targetValue: Date): boolean => {
    if (!targetValue || !this.assignedValue) {
      return false
    }
    return targetValue.getTime() <= this.assignedValue.getTime()
  }

  onAssignedChange(date: Date): void {
    this.assignedValue = date
  }

  onTargetChange(date: Date): void {
    this.targetValue = date
  }

  handleAssignedOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true
    }
    console.log('handleStartOpenChange', open, this.endOpen)
  }

  handleTargetOpenChange(open: boolean): void {
    console.log(open)
    this.endOpen = open
  }

  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    console.log(this.ProjectName)
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }

  startValue1: Date | null = null
  endValue1: Date | null = null
  endOpen1 = false

  disabledStartDate1 = (startValue: Date): boolean => {
    if (!startValue) {
      return false
    }
    return startValue.getTime() < this.editstartdate.getTime()
  }

  disabledEndDate1 = (endValue: Date): boolean => {
    if (!endValue || !this.startValue1) {
      return false
    }
    return endValue.getTime() <= this.startValue1.getTime()
  }

  onStartChange1(date: Date): void {
    this.startValue1 = date
    console.log('t', this.startValue1)
  }
  onEndChange1(date: Date): void {
    this.endValue1 = date
  }

  handleStartOpenChange1(open: boolean): void {
    if (!open) {
      this.endOpen1 = true
    }
    console.log('handleStartOpenChange', open, this.endOpen1)
  }

  handleEndOpenChange1(open: boolean): void {
    console.log(open)
    this.endOpen1 = open
  }
}
