import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms'
import { Router } from '@angular/router'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { NzUploadFile } from 'ng-zorro-antd/upload'
import { DatePipe } from '@angular/common'
import { HostListener } from '@angular/core'

class DataItem {
  projectId: number
  employeeId: number
  title: string
  taskDescription: string
  duration: number
  durationEnd: number
  organizer: string
  requester: string
  topicName: string
  subTask: string
  statusType: string
  activityType: string
  attachmentPath: string
  trainer: string
  topic: string
  fileName: string
  resourceType: string
  notes: string
  category: string
  createdBy: string
  modifiedBy: string
  projName: string
  date: string
  // resourceType: string,
  sTask: string

  durationStart: number
  // durationEnd: number
  // topic: [null, [Validators.required]],
  // trainer: [null, [Validators.required]],
  // organizer: string
  description: string
  attachment: string
  sDate: any
  blogType: string
  webinarType: string
  meetingType: string
  requestor: string
  // topicName: string
}
@Component({
  selector: 'app-statustracker',
  templateUrl: './statustracker.component.html',
  styleUrls: ['./statustracker.component.scss'],
  providers: [DatePipe],
})
export class StatustrackerComponent implements OnInit {
  listOfData: any = []
  myForm: FormGroup
  records: any
  addStatusForm: FormGroup
  dateForm: FormGroup
  isVisible: boolean
  activityProject: boolean = false
  activityTraining: boolean = false
  // selectedValue=false;
  activityDrop = []
  activityTypeDropDown = [
    // { label: 'Project', value: 'Project' },
    // { label: 'Support', value: 'Support' },
    // { label: 'Training', value: 'Training' },
    // { label: 'Webinar', value: 'Webinar' },
    // { label: 'Enablement', value: 'Enablement' },
    // { label: 'Blog', value: 'Blog' },
    // { label: 'Documentation', value: 'Documentation' },
    // { label: 'Meeting', value: 'Meeting' },
    // { label: 'Code Review', value: 'Code Review' }
  ]
  resourceTypeDropDown = [
    // { label: 'Internal Primary', value: 'I' },
    // { label: 'Internal Shadow', value: 'N' },
    // { label: 'External Primary', value: 'E' },
    // { label: 'External Shadow', value: 'X' },
    // { label: 'Client Primary', value: 'C' },
    // { label: 'Client Shadow', value: 'L' },
  ]
  durationDropdown = [
    // { label: '0 ', value: '0 ' },
    // { label: '1 ', value: '1 ' },
    // { label: '2 ', value: '2 ' },
    // { label: '3 ', value: '3 ' },
    // { label: '4 ', value: '4 ' },
    // { label: '5 ', value: '5 ' },
    // { label: '6 ', value: '6 ' },
    // { label: '7 ', value: '7 ' },
    // { label: '8 ', value: '8 ' },
  ]
  durationEndTym = [
    // { label: '0 ', value: '0 ' },
    // { label: '15 ', value: '15 ' },
    // { label: '30 ', value: '30 ' },
    // { label: '45 ', value: '45 ' },
    // { label: '60 ', value: '60 ' },
  ]

  pageNum: number
  pageSize: number
  noOfRecords: number
  totalPages: number
  notification: any
  newData: any
  addData: any
  delData: any

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getReport()
    }
  }

  activityEnablement: boolean
  activityWebinar: boolean
  activitymeeting: boolean
  activityBlog: boolean
  yes: boolean
  no: boolean
  yes1: boolean
  no1: boolean
  radioValue
  // validateForm: FormGroup;
  // listOfControl: any;
  activityDropData = []
  // projectId: any;
  employeeId: any
  duplicateAry: DataItem[]
  editStatusForm: FormGroup
  editVisible: boolean
  duration: number
  durationEnd: number
  id: any
  EmployeeId: any
  ProjectName: string
  activityType: any

  fileList: NzUploadFile[] = []
  activity: Object
  projectId: any

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private route: Router,
    private datePipe: DatePipe,
  ) {}
  header = 'Search'
  ngOnInit(): void {
    this.pageSize = 10
    this.pageNum = 1
    this.totalPages = 10

    this.myForm = this.fb.group({
      times: this.fb.array([this.initTimes()]),
    })
    this.dataService.get(apis.resourceDropdown).subscribe((res: any) => {
      this.resourceTypeDropDown = res
      console.log('ResourceType Dropdown', this.resourceTypeDropDown)
    })
    this.dataService.get(apis.activityDropdown).subscribe((res: any) => {
      this.activityTypeDropDown = res
      console.log('activityTypeDropDown', this.activityTypeDropDown)
    })
    this.dataService.get(apis.activityDropdown).subscribe((res: any) => {
      this.activityDrop = res
      console.log('activityTypeDropDown', this.activityDrop)
    })
    this.dataService.get(apis.durationHrsDropdown).subscribe((res: any) => {
      this.durationDropdown = res
      console.log('durationHRSDropdown', this.durationDropdown)
    })

    this.dataService.get(apis.durationMinsDropdown).subscribe((res: any) => {
      this.durationEndTym = res
      console.log('durationMinsDropdown', this.durationEndTym)
    })
    // this.activityDropdown();
    // this.getReport();

    this.duplicateAry = this.listOfData

    this.dateForm = this.fb.group({
      sDate: [null],
      eDate: [null],
      activityType: [null],
      projName: [null],
    })
    this.addStatusForm = this.fb.group({
      resourceType: [null, [Validators.required]],
      activityType: [null, [Validators.required]],
      projName: [null, [Validators.required]],
      sTask: [null, [Validators.required]],
      category: [null, [Validators.required]],
      durationStart: [null],
      durationEnd: [null],
      topic: [null, [Validators.required]],
      trainer: [null, [Validators.required]],
      organizer: [null, [Validators.required]],
      description: [null, [Validators.required]],
      attachment: [null],
      sDate: new Date(),
      blogType: [null, [Validators.required]],
      // webinarType: [null, [Validators.required]],
      // meetingType: [null, [Validators.required]],
      requestor: [null, [Validators.required]],
      topicName: [null, [Validators.required]],
      // ingredients: this.fb.array([]),
    })

    this.editStatusForm = this.fb.group({
      resourceType: [null, [Validators.required]],
      activityType: [null, [Validators.required]],
      projName: [null, [Validators.required]],
      sTask: [null, [Validators.required]],
      category: [null, [Validators.required]],
      durationStart: [null],
      durationEnd: [null],
      topic: [null, [Validators.required]],
      trainer: [null, [Validators.required]],
      organizer: [null, [Validators.required]],
      description: [null, [Validators.required]],
      blogType: [null, [Validators.required]],
      // webinarType: [null, [Validators.required]],
      attachment: [null],
      sDate: new Date(),
      // meetingType: [null, [Validators.required]],
      requestor: [null, [Validators.required]],
      topicName: [null, [Validators.required]],
    })
    // this.validateForm = this.fb.group({
    //   resourceType: [null, [Validators.required]],
    //   activityType: [null, [Validators.required]],
    //   projName: [null, [Validators.required]],
    //   sTask: [null, [Validators.required]],
    //   category: [null, [Validators.required]],
    //   durationStart: [null],
    //   durationEnd: [null],
    //   topic: [null, [Validators.required]],
    //   trainer: [null, [Validators.required]],
    //   organizer: [null, [Validators.required]],
    //   description: [null, [Validators.required]],
    //   attachment: [null],
    //   sDate: new Date(),
    //   blogType: [null, [Validators.required]],
    //   webinarType: [null, [Validators.required]],
    //   meetingType: [null, [Validators.required]],
    //   requestor: [null, [Validators.required]],
    //   topicName: [null, [Validators.required]],

    // })

    // defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
    // selectChange(select: Date): void {
    // this.isVisible = true;
    // console.log(`Select value: ${select}`);
    this.getReport()
  }

  //   activityDropdown(){
  //     this.dataService.getActivitytypeDropdown().subscribe(res=> {
  //       this.activity =res;
  // console.log('++++++++',this.activity);
  //     })
  //   }
  // initTimes() {
  //   return this.fb.group({
  //     resourceType: [null, [Validators.required]],
  //     activityType: [null, [Validators.required]],
  //     projName: [null, [Validators.required]],
  //     sTask: [null, [Validators.required]],
  //     category: [null, [Validators.required]],
  //     durationStart: [null],
  //     durationEnd: [null],
  //     topic: [null, [Validators.required]],
  //     trainer: [null, [Validators.required]],
  //     organizer: [null, [Validators.required]],
  //     description: [null, [Validators.required]],
  //     attachment: [null],
  //     sDate: new Date(),
  //     blogType: [null, [Validators.required]],
  //     webinarType: [null, [Validators.required]],
  //     meetingType: [null, [Validators.required]],
  //     requestor: [null, [Validators.required]],
  //     topicName: [null, [Validators.required]],

  //     trackingId: this.generateUnique(Id()
  //   });
  // }

  projectRelated(event) {
    if (event === 'yes') {
      this.activityBlog = true
      this.yes = true
    }
  }
  activityDropDown1(event, i) {
    this.activityDropData[i] = event
  }
  activityDropDown(event) {
    if (event === 'Project') {
      this.activityProject = true
      this.activityTraining = false
      this.activityWebinar = false
      this.activityEnablement = false
      this.activitymeeting = false
      this.activityBlog = false
    } else if (event === 'Enablement') {
      this.activityEnablement = true
      this.activityWebinar = false
      this.activityTraining = false
      this.activitymeeting = false
      this.activityProject = false
      this.activityBlog = false
    } else if (event === 'Training') {
      this.activityTraining = true
      this.activityEnablement = false
      this.activityWebinar = false
      this.activitymeeting = false
      this.activityProject = false
      this.activityBlog = false
    } else if (event === 'Support') {
      this.activityProject = true
      this.activityTraining = false
      this.activityWebinar = false
      this.activityEnablement = false
      this.activitymeeting = false
      this.activityBlog = false
    } else if (event === 'Code Review') {
      this.activityBlog = true
      this.activitymeeting = false
      this.activityEnablement = false
      this.activityTraining = false
      this.activityProject = false
      this.activityWebinar = false
    } else if (event === 'Documentation') {
      this.activityBlog = true
      this.activityTraining = false
      this.activityWebinar = false
      this.activityEnablement = false
      this.activitymeeting = false
      this.activityProject = false
    } else if (event === 'Meeting') {
      this.activitymeeting = true
      this.activityEnablement = false
      this.activityProject = false
      this.activityTraining = false
      this.activityWebinar = false
      this.activityBlog = false
    } else if (event === 'Blog') {
      this.activityBlog = true
      this.activityWebinar = false
      this.activityTraining = false
      this.activityEnablement = false
      this.activitymeeting = false
      this.activityProject = false
    } else if (event === 'Webinar') {
      this.activityBlog = false
      this.activityWebinar = true
      this.activityTraining = false
      this.activityEnablement = false
      this.activitymeeting = false
      this.activityProject = false
    }
  }
  typeSelected() {
    console.log('radio', this.radioValue)
    if (this.radioValue === 'yes') {
      this.yes = true
      this.no = false
    } else {
      this.no = true
      this.yes = false
    }
  }

  addmeetingTypeYes() {
    this.yes = true
    this.no = false
  }
  addmeetingTypeNo() {
    this.no = true
    this.yes = false
  }
  addBlogTypeYes() {
    this.yes1 = true
    this.no1 = false
  }

  addBlogTypeNo() {
    this.yes1 = false
    this.no1 = true
  }

  addRow() {
    this.isVisible = true
  }

  getReport() {
    const endDate = this.dateForm.controls.eDate.value
    const startDate = this.dateForm.controls.sDate.value
    const projName = this.dateForm.controls.projName.value
    const activityType = this.dateForm.controls.activityType.value
    const data = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      // projectId: 3,
      startDate:
        startDate === null || startDate === undefined
          ? ''
          : this.datePipe.transform(startDate, 'yyyy-dd-MM'),
      endDate:
        endDate === null || endDate === undefined
          ? ''
          : this.datePipe.transform(endDate, 'yyyy-dd-MM'),
      title: projName === null || projName === undefined ? '' : projName,
      activityType: activityType === null || activityType === undefined ? '' : activityType,
    }
    this.dataService.post(apis.statusReport, data).subscribe((res: any) => {
      this.listOfData = res[0].data
      this.records = res[0].count
      console.log('gridData', this.listOfData)
    })
    // let projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    // console.log('projectId', projectId)
  }
  listOfControl: Array<{ id: number; controlInstance: string }> = []
  Cancel() {
    this.isVisible = false
  }
  addField() {
    const control = <FormArray>this.myForm.controls['times']
    control.push(this.initTimes())
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault()
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i)
      this.listOfControl.splice(index, 1)
      console.log(this.listOfControl)
      this.myForm.removeControl(i.controlInstance)
    }
  }

  Save() {
    console.log(this.myForm.value.times)
    const formData = this.myForm.value.times
    const reqBody = []
    formData.forEach(element => {
      let data = {
        category:
          element.category === undefined || element.category === null ? '' : element.category,
        organizer:
          element.organizer === undefined || element.organizer === null ? '' : element.organizer,
        projectName:
          element.projName === undefined || element.projName === null ? '' : element.projName,
        fileName: '', // filename of a choosen file
        trainer: element.trainer === undefined || element.trainer === null ? '' : element.trainer,
        modifiedBy: '',
        requester:
          element.requestor === undefined || element.requestor === null ? '' : element.requestor,
        taskDescription:
          element.description === undefined || element.description === null
            ? ''
            : element.description,
        durationHr:
          element.durationStart === undefined || element.durationStart === null
            ? ''
            : element.durationStart,
        durationMin:
          element.durationEnd === undefined || element.durationEnd === null
            ? ''
            : element.durationEnd,
        employeeId: 3,
        // JSON.parse(sessionStorage.getItem('loginData')).Id,
        topic: element.topic === undefined || element.topic === null ? '' : element.topic,
        subTask: element.sTask === undefined || element.sTask === null ? '' : element.sTask,
        notes:
          element.description === undefined || element.description === null
            ? ''
            : element.description, // check it once regarding
        // discription & notes
        createdBy: JSON.parse(sessionStorage.getItem('loginData')).LoginId,
        projectId: 54,
        activityType:
          element.activityType === undefined || element.activityType === null
            ? ''
            : element.activityType,
        title: '',
        resourceType:
          element.resourceType === undefined || element.resourceType === null
            ? ''
            : element.resourceType,
        topicName:
          element.topicName === undefined || element.topicName === null ? '' : element.topicName,
        attachmentPath: '', // path from file api response
        statusType: '',
      }
      reqBody.push(data)
    })
    console.log('--->data to table', reqBody)
    this.dataService.postStatus(apis.statusAdd, reqBody).subscribe((res: any) => {
      console.log(res)
      this.newData = res
      this.isVisible = false

      if (this.newData['success'] === 'Record inserted successfully') {
        this.notification.create(
          'success',
          'Successfully Created',
          'Your data has been successfully Added',
        )
      }
      this.getReport()
    })
  }

  editRow(values): void {
    this.editVisible = true
    this.id = values.Id
    console.log('id =====>', this.id)
    this.ProjectName = values.DurationStart
    console.log('DurationStart =====>', this.ProjectName)
    // this.activityType = values.ActivityType
    // console.log('activityType =====>', this.activityType)
    this.editStatusForm.get('projName').patchValue(values.ProjectName)
    this.editStatusForm.get('sDate').patchValue(values.ModifiedDate)
    this.editStatusForm.get('description').patchValue(values.TaskDescription)
    this.editStatusForm.get('durationStart').patchValue(values.DurationStart)
    this.editStatusForm.get('topicName').patchValue(values.TopicName)
    this.editStatusForm.get('resourceType').patchValue(values.ResourceType)
    this.editStatusForm.get('activityType').patchValue(values.ActivityType)
    this.editStatusForm.get('durationEnd').patchValue(values.DurationEnd)
    this.editStatusForm.get('topic').patchValue(values.Title)
    this.editStatusForm.get('organizer').patchValue(values.Organizer)
    this.editStatusForm.get('requestor').patchValue(values.Requestor)
    this.editStatusForm.get('sTask').patchValue(values.SubTask)
    this.editStatusForm.get('attachment').patchValue(values.AttachmentPath)
    this.editStatusForm.get('trainer').patchValue(values.Trainer)
    this.editStatusForm.get('activityType').patchValue(values.ActivityType)
    this.editStatusForm.get('attachment').patchValue(values.FileName)
    this.editStatusForm.get('category').patchValue(values.Category)
    this.editStatusForm.get('description').patchValue(values.Notes)
    // this.editStatusForm.get('activityType').patchValue(values.ActivityType)
  }

  Update(): void {
    console.log('--->data to table update')
    console.log(this.editStatusForm.controls.description.value)
    console.log(this.editStatusForm.controls.durationStart.value)
    console.log(this.editStatusForm.get('sDate').value)
    // console.log(this.editResourceForm.controls.resourceType1.value)
    console.log(this.editStatusForm.controls.resourceType.value)
    let updated = {
      id: this.id,
      category: this.editStatusForm.controls.category.value,
      createdBy: 'Jahnavi',
      organizer: this.editStatusForm.controls.organizer.value,
      projectName: this.editStatusForm.controls.projName.value,
      fileName: this.editStatusForm.controls.attachment.value,
      projectId: 54,
      activityType: this.editStatusForm.controls.activityType.value,
      title: this.editStatusForm.controls.topic.value,
      trainer: this.editStatusForm.controls.trainer.value,
      durationHr: Number(this.editStatusForm.controls.durationStart.value),
      durationMin: Number(this.editStatusForm.controls.durationEnd.value),
      resourceType: this.editStatusForm.controls.resourceType.value,
      modifiedBy: 'Chaitanya',
      topicName: this.editStatusForm.controls.topicName.value,
      requester: this.editStatusForm.controls.requestor.value,
      taskDescription: this.editStatusForm.controls.description.value,
      attachmentPath: 'd:folder',
      statusType: 'active',
      employeeId: 3,
      topic: this.editStatusForm.controls.topic.value,
      subTask: this.editStatusForm.controls.sTask.value,
      notes: this.editStatusForm.controls.description.value,
    }
    console.log('--->data to table', updated)
    this.dataService.updateStatus(apis.statusUpdate, updated).subscribe((res: any) => {
      console.log(res)
      this.addData = res
      if (this.addData['success'] == 'updated successfully') {
        this.notification.create(
          'success',
          'Successfully Updated',
          'Your data has been successfully Updated',
        )
      }
      this.getReport()
    })

    this.editVisible = false
  }
  generateUniqueId() {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    )
  }

  addGroup() {
    // add address to the list
    const control = <FormArray>this.myForm.controls['times']
    control.push(this.initTimes())
  }

  removeGroup(i: number) {
    // remove address from the list
    const control = <FormArray>this.myForm.controls['times']
    control.removeAt(i)
  }
  trackByFn(index: number, item: any) {
    return item.trackingId
  }

  initTimes() {
    return this.fb.group({
      resourceType: this.fb.control('', Validators.required),
      activityType: this.fb.control('', Validators.required),
      projName: this.fb.control('', Validators.required),
      sTask: this.fb.control('', Validators.required),
      category: this.fb.control('', Validators.required),
      durationStart: [null],
      durationEnd: [null],
      topic: this.fb.control('', Validators.required),
      trainer: this.fb.control('', Validators.required),
      organizer: this.fb.control('', Validators.required),
      description: this.fb.control('', Validators.required),
      attachment: [null],
      sDate: new Date(),
      blogType: this.fb.control('', Validators.required),
      webinarType: this.fb.control('', Validators.required),
      meetingType: this.fb.control('', Validators.required),
      requestor: this.fb.control('', Validators.required),
      topicName: this.fb.control('', Validators.required),
      trackingId: this.generateUniqueId(),
    })
  }
  // onSubmit() {
  //   console.log('value: ', this.myForm.value);
  //   console.log('valid: ', this.myForm.valid);
  // }
  deleteRow(data) {
    this.id = data.Id
    console.log('id======>', this.id)
    const data1 = {
      id: data.Id,
    }
    console.log('data1', data1)
    this.dataService.post(apis.statusDelete, data1).subscribe((res: any) => {
      console.log(res)
      this.delData = res
      if (this.delData['Result'] == 'deleted Successfully') {
        this.notification.create(
          'success',
          'Successfully Deleted',
          'Your data has been successfully deleted',
        )
      }
      this.getReport()
    })
  }
  updateCancel(): void {
    console.log('Update Button cancel clicked!')
    this.editVisible = false
    this.editStatusForm.reset()
  }
  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }

  reset() {
    this.dateForm.reset()
    this.getReport()
  }

  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getReport()
  }

  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.pageNum = 1
    this.getReport()
  }
}
