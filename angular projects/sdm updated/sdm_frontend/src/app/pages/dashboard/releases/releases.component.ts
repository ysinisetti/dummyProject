import { DataService } from './../../../data.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Tasks } from '../tasks/tasks.component'
import { Router } from '@angular/router'
import { apis } from 'src/app/api'
import { HostListener } from '@angular/core'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { DatePipe } from '@angular/common'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss'],
  providers: [DatePipe],
})
export class ReleasesComponent implements OnInit {
  allResoursesDetails: any
  selectedProjectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
  visible = false
  inputValue?: string
  isVisible = false
  isVisible1 = false
  searchTask: any
  header = 'Search'
  addReleaseForm: FormGroup
  editReleaseForm: FormGroup
  searchForm: FormGroup
  inputValue1?: string
  noteForm: FormGroup
  id: any
  projectId: any
  endTaskId: any
  releaseTag: any
  description1: any
  createdBy: any
  seqNo: any
  modifiedBy: any
  allRealeses: any
  pageNum: number
  pageSize: number
  noOfRecords: number
  totalPages: number
  // pageSize = 2
  pageIndex = 1
  idToBeEdited: any
  startDate = '2020-05-04'
  status: any
  SeqNo: any
  Description: any
  ProjectId: any
  CreateBy: any
  ModifiedDate: any
  ModifiedBy: any
  StartTaskId: any
  Version: any
  ReleaseEndDate: any
  ReleaseTag: any
  CreatedDate: any
  Id: any
  ReleaseStart: any
  EndTaskId: any
  searchTerm: string
  sVersion: any
  sStatus: any
  sDate: string
  records: any
  ProjectName: string
  today = new Date()
  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, this.today) < 0
  }
  disabledDate1 = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, this.today) < 0
  }
  sEDate: string
  customerName: any
  open(): void {
    this.visible = true
  }

  close(): void {
    this.visible = false
  }

  getAllRelease() {
    const version = this.searchForm.controls.sVersion.value
    const status = this.searchForm.controls.sStatus.value
    const releaseStartDate = this.datePipe.transform(
      this.searchForm.get('sDate').value,
      'yyyy-MM-dd',
    )
    const releaseEndDate = this.datePipe.transform(
      this.searchForm.get('sEDate').value,
      'yyyy-MM-dd',
    )
    let reqBody = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      releaseStartDate:
        releaseStartDate === null || releaseStartDate === undefined ? '' : releaseStartDate,
      releaseEndDate: releaseEndDate === null || releaseEndDate === undefined ? '' : releaseEndDate,
      version: version === null || version === undefined ? '' : version,
      status: status === null || status === undefined ? '' : status,
    }
    this.dataService.post(apis.getAllReleases, reqBody).subscribe(res => {
      this.records = res[0].count
      this.allResoursesDetails = res[0].data
    })
  }
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllRelease()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.pageNum = 1
    this.getAllRelease()
  }
  reset1() {
    this.searchForm.reset()
    // if(this.searchForm.get('sDate').value)
    // {
    // this.searchForm.get('sDate').value.reset

    // }
    // if(this.searchForm.get('sDate').value)
    // {
    // this.searchForm.get('sEDate').value.reset

    // }
    this.getAllRelease()
  }

  getColor(status) {
    switch (status) {
      case 'IN PROGRESS':
        return '#00aae7'
      case 'UNRELEASED':
        return '#f58142'
      case 'RELEASED':
        return '#00ff2f'
    }
  }
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getAllRelease()
    }
  }

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private route: Router,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    console.log(this.selectedProjectId)
    this.editReleaseForm = this.fb.group({
      version: [
        '',
        [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]{1,10}$')],
      ],
      startDate: ['', Validators.required],
      releaseDate: ['', Validators.required],
      status: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
    })
    this.addReleaseForm = this.fb.group({
      version: [
        '',
        [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]{1,10}$')],
      ],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
    })
    this.searchForm = this.fb.group({
      sVersion: [null],
      sDate: [null],
      sEDate: [null],
      sStatus: [null],
    })
    this.pageSize = 10
    this.pageNum = 1
    this.totalPages = 10

    this.getAllRelease()
  }

  ///////////////////////Delete Releases//////////////////////////
  deleteRow(id): void {
    let dId = {
      id: id,
    }
    this.dataService.post(apis.deleteReleases, dId).subscribe(res => {
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
      this.getAllRelease()
    })
    this.getAllRelease()
  }

  ////////////////////////////////Insert New Release///////////////////
  addRow(): void {
    this.isVisible = true
  }

  handleSubmit1() {
    this.SeqNo = 7
    this.CreateBy = 'jdasari'
    this.ModifiedBy = 'arelli'
    this.StartTaskId = 7
    this.Version = 1
    this.ReleaseTag = 'done'
    this.Id = 1
    this.EndTaskId = 8
    let postReleases = {
      status: this.addReleaseForm.controls.status.value,
      seqNo: this.SeqNo,
      description: this.addReleaseForm.controls.description.value,
      projectId: this.selectedProjectId,
      createdBy: this.CreateBy,
      modifiedBy: this.ModifiedBy,
      startTaskId: this.StartTaskId,
      version: this.addReleaseForm.controls.version.value,
      releaseEndDate: this.addReleaseForm.controls.endDate.value,
      releaseTag: this.ReleaseTag,
      releaseStartDate: this.addReleaseForm.controls.startDate.value,
      endTaskId: this.EndTaskId,
    }
    this.dataService.post(apis.postReleases, postReleases).subscribe(res => {
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to insert', 'Your data is failed to add')
      }
      this.getAllRelease()
    })
    this.isVisible = false
    this.addReleaseForm.reset()
    this.getAllRelease()
  }

  ////////////////////////////////Update New Release///////////////////

  editRow(values): void {
    this.idToBeEdited = values.Id
    this.isVisible1 = true
    this.editReleaseForm.get('version').patchValue(values.Version)
    this.editReleaseForm.get('startDate').patchValue(values.ReleaseStartDate)
    this.editReleaseForm.get('releaseDate').patchValue(values.ReleaseEndDate)
    this.editReleaseForm.get('status').patchValue(values.Status)
    this.editReleaseForm.get('description').patchValue(values.Description)
  }

  updateRelease() {
    this.SeqNo = 7
    this.ProjectId = 45
    this.CreateBy = 'jdasari'
    this.ModifiedBy = 'arelli'
    this.StartTaskId = 7
    this.Version = 1
    this.ReleaseTag = 'done'
    this.EndTaskId = 8
    let updated = {
      id: this.idToBeEdited,
      status: this.editReleaseForm.controls.status.value,
      seqNo: this.SeqNo,
      description: this.editReleaseForm.controls.description.value,
      projectId: this.selectedProjectId,
      createdBy: this.CreateBy,
      modifiedBy: this.ModifiedBy,
      startTaskId: this.StartTaskId,
      version: this.editReleaseForm.controls.version.value,
      releaseEndDate: this.editReleaseForm.controls.releaseDate.value,
      releaseTag: this.ReleaseTag,
      endTaskId: this.EndTaskId,
    }
    this.dataService.post(apis.updateReleases, updated).subscribe(res => {
      console.log('updating Releases', res)
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
      this.getAllRelease()
    })
    this.isVisible1 = false
    this.getAllRelease()
  }

  handleCancel(): void {
    this.isVisible = false
    this.isVisible1 = false
    this.addReleaseForm.reset()
  }

  onSearch(event) {}

  save(): void {
    this.isVisible = true
    this.isVisible1 = true
  }

  reset(): void {
    this.searchTask = ''
    this.onSearch(this.searchTask)
  }

  dashboard() {
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }

  submitForm() {
    console.log('submittred 123 edit166', this.addReleaseForm)
  }

  submitForm1(x) {
    console.log('submittred 123 edit', this.editReleaseForm, x)
  }
  startValue: Date | null = null
  endValue: Date | null = null
  endOpen = false
  endValue1: Date | null = null
  endOpen1 = false

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false
    }
    return startValue.getTime() > this.endValue.getTime()
  }
  disabledStartDate1 = (startValue: Date): boolean => {
    if (!startValue || !this.endValue1) {
      return false
    }
    return startValue.getTime() > this.endValue1.getTime()
  }

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false
    }
    return endValue.getTime() <= this.startValue.getTime()
  }
  disabledEndDate1 = (endValue1: Date): boolean => {
    if (!endValue1 || !this.startValue) {
      return false
    }
    return endValue1.getTime() <= this.startValue.getTime()
  }

  onStartChange(date: Date): void {
    this.startValue = date
  }
  onStartChange1(date: Date): void {
    this.startValue = date
  }

  onEndChange(date: Date): void {
    this.endValue = date
  }
  onEndChange1(date: Date): void {
    this.endValue1 = date
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true
    }
    console.log('handleStartOpenChange', open, this.endOpen)
  }
  handleStartOpenChange1(open: boolean): void {
    if (!open) {
      this.endOpen1 = true
    }
    console.log('handleStartOpenChange', open, this.endOpen1)
  }

  handleEndOpenChange(open: boolean): void {
    console.log(open)
    this.endOpen = open
  }
  handleEndOpenChange1(open: boolean): void {
    console.log(open)
    this.endOpen1 = open
  }
  /////////////BreadCrumb////////////////

  gotoHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }

  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
