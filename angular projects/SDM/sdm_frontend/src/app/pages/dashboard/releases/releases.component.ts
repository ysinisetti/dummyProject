import { DataService } from './../../../data.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Tasks } from '../tasks/tasks.component'
import { Router } from '@angular/router'
import { apis } from 'src/app/api'

@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss'],
})
export class ReleasesComponent implements OnInit {
  allResoursesDetails: any
  selectedProjectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
  visible = false
  inputValue?: string
  isVisible = false
  isVisible1 = false
  searchTask: any
  addResourceForm: FormGroup
  editResourceForm: FormGroup
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
  pageSize = 2
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

  records: any
  ProjectName: string
  open(): void {
    this.visible = true
  }

  close(): void {
    this.visible = false
  }

  getAllRelease() {
    this.dataService.get(apis.getAllReleases).subscribe(res => {
      console.log('All Releases', res)
      ;(this.records = res.length), console.log(this.records)
      this.allResoursesDetails = res
      // this.startDate11=this.allResoursesDetails.ReleaseStartDate,
      // console.log(this.startDate);
    })
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

  addRow(): void {
    this.isVisible = true
  }
  ngOnInit(): void {
    // this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
    console.log(this.selectedProjectId)

    this.editResourceForm = this.fb.group({
      version: [
        '',
        [Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]{1,2}$')],
      ],
      startDate: ['', Validators.required],
      releaseDate: ['', Validators.required],
      status: ['', Validators.required],
      description: [
        '',
        [Validators.required, Validators.maxLength(255), Validators.pattern('^[a-zA-Z .]*$')],
      ],
    })
    // (([1-9]+\d*\.)+[1-9]+\d*)|[1-9]+\d*
    // +.[0-9]{1}+.[0-9]{1}
    this.addResourceForm = this.fb.group({
      version: [
        '',
        [Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]{1,2}$')],
      ],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
      description: [
        '',
        [Validators.required, Validators.maxLength(255), Validators.pattern('^[a-zA-Z .]*$')],
      ],
    })
    // this.noteForm = this.fb.group({
    //   notes : ['',[Validators.required, Validators.maxLength(250),Validators.pattern('^[a-zA-z]*$')]]
    // })
    this.ProjectName = sessionStorage.getItem('pName')
    this.getAllRelease()
  }

  editRow(values): void {
    ;(this.idToBeEdited = values.Id),
      //console.log("idToBeEdited",this.idToBeEdited);

      console.log(
        'edit row',
        values,
        this.editResourceForm.get('version').patchValue(values.Version),
      )
    this.isVisible1 = true
    this.editResourceForm.get('version').patchValue(values.Version)
    this.editResourceForm.get('startDate').patchValue(values.ReleaseStartDate)
    this.editResourceForm.get('releaseDate').patchValue(values.ReleaseEndDate)
    this.editResourceForm.get('status').patchValue(values.Status)
    this.editResourceForm.get('description').patchValue(values.Description)
  }

  deleteRow(id): void {
    let dId = {
      id: id,
    }
    // this.allResoursesDetails = this.allResoursesDetails.filter(d => d.taskName !== id);
    this.dataService.post(apis.deleteReleases, dId).subscribe(res => {
      console.log('deleted')
      console.log(res)
      this.getAllRelease()
    })
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
      status: this.addResourceForm.controls.status.value,
      seqNo: this.SeqNo,
      description: this.addResourceForm.controls.description.value,
      projectId: this.selectedProjectId,
      createdBy: this.CreateBy,
      modifiedBy: this.ModifiedBy,
      startTaskId: this.StartTaskId,
      version: this.addResourceForm.controls.version.value,
      releaseEndDate: this.addResourceForm.controls.endDate.value,
      releaseTag: this.ReleaseTag,
      releaseStartDate: this.addResourceForm.controls.startDate.value,
      endTaskId: this.EndTaskId,
    }
    this.dataService.post(apis.postReleases, postReleases).subscribe(res => {})
    this.isVisible = false
    this.getAllRelease()
  }

  updateTask() {
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
      status: this.editResourceForm.controls.status.value,
      seqNo: this.SeqNo,
      description: this.editResourceForm.controls.description.value,
      projectId: this.selectedProjectId,
      createdBy: this.CreateBy,
      modifiedBy: this.ModifiedBy,
      startTaskId: this.StartTaskId,
      version: this.editResourceForm.controls.version.value,
      releaseEndDate: this.editResourceForm.controls.releaseDate.value,
      releaseTag: this.ReleaseTag,
      // "releaseStartDate" :this.editResourceForm.controls.startDate.value,
      endTaskId: this.EndTaskId,
    }
    this.dataService.post(apis.updateReleases, updated).subscribe(res => {
      console.log('updating Releases', res)
      this.getAllRelease()
    })
    console.log('--->data to table', updated)

    this.isVisible1 = false
    this.getAllRelease()
  }

  handleCancel(): void {
    this.isVisible = false
    this.isVisible1 = false
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private route: Router,
  ) {}

  onCurrentPageDataChange(data) {
    console.log(data)
  }

  submitForm() {
    console.log('submittred 123 edit166', this.addResourceForm)
  }

  submitForm1(x) {
    console.log('submittred 123 edit', this.editResourceForm, x)
  }
  startValue: Date | null = null
  endValue: Date | null = null
  endOpen = false

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false
    }
    return startValue.getTime() > this.endValue.getTime()
  }

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false
    }
    return endValue.getTime() <= this.startValue.getTime()
  }

  onStartChange(date: Date): void {
    this.startValue = date
  }

  onEndChange(date: Date): void {
    this.endValue = date
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true
    }
    console.log('handleStartOpenChange', open, this.endOpen)
  }

  handleEndOpenChange(open: boolean): void {
    console.log(open)
    this.endOpen = open
  }
  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}

//(ProjectId,StartTaskId,EndTaskId,ReleaseStartDate,ReleaseEndDate,ReleaseTag,SeqNo,Description,CreatedBy,ModifiedBy)
