import { Component, OnInit } from '@angular/core'
import { apis } from 'src/app/api'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { DataService } from 'src/app/data.service'
import { NzModalService } from 'ng-zorro-antd/modal'
import { Validators } from '@angular/forms'
import { DatePipe } from '@angular/common'
import { HostListener } from '@angular/core'
import { NzNotificationService } from 'ng-zorro-antd'
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table'
import { Router } from '@angular/router'
interface DataItem {
  subject: string
  date: string
  starttime: string
  duration: string
  organizer: string
  status: string
  action: string
}

interface ColumnItem {
  title: string
  sortOrder?: NzTableSortOrder
  sortFn?: NzTableSortFn
  listOfFilter?: NzTableFilterList
  filterFn?: NzTableFilterFn
  filterMultiple?: boolean
  sortDirections?: NzTableSortOrder[]
}
@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss'],
  providers: [DatePipe],
})
export class MeetingsComponent implements OnInit {
  searchform: FormGroup
  startDate: string
  perdata: any
  projectId: any
  cName: any
  cancelData: any
  canceltabledata: any
  records: any
  CustomerName: string
  tableData: any
  tableData1: any
  editDatares: any

  // @HostListener('window:keydown', ['$event'])
  // keyboardInput(event: any) { if (event.key === 'Enter') { this.getTableDataBySearch(); } }

  createvisible = false
  recurvisible = false
  status = [{ type: 'success', content: 'Completed' }]
  optionList = [
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' },
    { label: 'Completed', value: 'Completed' },
  ]
  timeMiutes = [{ m: '0 minute' }, { m: '15 minutes' }, { m: '30 minutes' }, { m: '45 minutes' }]
  assignto = [
    { a: 'Ramya Sree Kilani', v: 'rkilani@miraclesoft.com' },
    { a: 'Mounica Rompalli', v: 'mrompalli@miraclesoft.com' },
    { a: 'Sai Praneeth Garbham', v: 'sgarbham1@miraclesoft.com' },
    { a: 'Supraja Magisetty', v: 'smagisetty@miraclesoft.com' },
  ]
  pageNum: number
  pageSize: number
  noOfRecords: number
  totalPages: number

  header = 'Search '
  //sorting
  listOfColumn: ColumnItem[] = [
    {
      title: 'SUBJECT',
      sortOrder: 'ascend',
      sortFn: (a: DataItem, b: DataItem) => a.subject.localeCompare(b.subject),
      filterMultiple: true,

      filterFn: (list: string[], item: DataItem) =>
        list.some(subject => item.subject.indexOf(subject) !== -1),
    },
    {
      title: 'DATE',

      sortOrder: 'ascend',
      sortFn: (a: DataItem, b: DataItem) => a.subject.localeCompare(b.subject),
      filterMultiple: true,

      filterFn: (list: string[], item: DataItem) =>
        list.some(subject => item.subject.indexOf(subject) !== -1),
    },
    {
      title: 'START TIME',
      sortOrder: 'ascend',
      sortFn: (a: DataItem, b: DataItem) => a.subject.localeCompare(b.subject),
      filterMultiple: true,

      filterFn: (list: string[], item: DataItem) =>
        list.some(subject => item.subject.indexOf(subject) !== -1),
    },
    {
      title: 'DURATION',
      sortOrder: 'ascend',
      sortFn: (a: DataItem, b: DataItem) => a.subject.localeCompare(b.subject),
      filterMultiple: true,

      filterFn: (list: string[], item: DataItem) =>
        list.some(subject => item.subject.indexOf(subject) !== -1),
    },
    {
      title: 'ORGANIZER',

      sortOrder: 'ascend',
      sortFn: (a: DataItem, b: DataItem) => a.subject.localeCompare(b.subject),
      filterMultiple: true,

      filterFn: (list: string[], item: DataItem) =>
        list.some(subject => item.subject.indexOf(subject) !== -1),
    },
    {
      title: 'STATUS',

      sortOrder: 'ascend',
      sortFn: (a: DataItem, b: DataItem) => a.subject.localeCompare(b.subject),
      filterMultiple: true,

      filterFn: (list: string[], item: DataItem) =>
        list.some(subject => item.subject.indexOf(subject) !== -1),
    },
    {
      title: 'ACTION',
    },
  ]
  attendees = [
    { a: 'poonam gupta', v: 'pgupta@miraclesoft.com' },
    { a: 'Ramya sree kilani', v: 'rkilani@miraclesoft.com' },
    { a: 'Sameer kencham', v: 'skencham@miraclesoft.com' },
    { a: 'sai praneeth', v: 'sgarbham1@miraclesoft.com' },
  ]

  optionList5 = [
    { label: 'Atlantic Time (AT)', value: 'AT' },
    { label: 'Alaska Standard Time(AST)', value: 'AST' },
    { label: 'Brazil Eastern Time (BET)', value: 'BET' },
    { label: 'Pacific Standard Time (PST)', value: 'PST' },
    { label: 'Eastern Standard Time (EST)', value: 'EST' },
    { label: 'Eastern European Time (EET)', value: 'EET' },
    { label: 'European Central Time (ECT)', value: 'ECT' },
    { label: 'India Standard Time (IST)', value: 'IST' },
    { label: 'Newzealand Standard Time (NST)', value: 'NST' },
    { label: 'Central Standard Time (CST)', value: 'CST' },
    { label: 'Mountain Standard Time (MST)', value: 'MST' },
  ]
  All
  allday
  createData: any
  lookupform: FormGroup
  editvisible = false
  copyvisible = false
  cancelvisible = false
  updatevisible = false
  forwardvisible = false
  listOfOption: Array<{ label: string; value: string }> = []
  tagValue = []
  createMeetingForm: FormGroup
  editMeetingForm: FormGroup
  startDate1: string
  endDate: string
  startTime: string
  endTime: string
  repeatevery: boolean
  weekly: boolean
  end: boolean
  repeaton: boolean
  recurform: FormGroup
  forwardMeetingForm: FormGroup
  pName: any
  ProjectName: string
  dummyArray: { attendeeName: string; addedDate: string; createdBy: string; modifiedBy: any }[]
  perdata1: any
  subject1: any
  enddate: any
  starttime: any
  location: any
  endtime: any
  conferencetype: any
  timezone: any
  document: any
  projectid: any
  pevmeetingid: any
  organizerid: any
  createdby: any
  locationtype: any
  organizertype: any
  modifiedby: any
  id: any
  forwardData: any
  constructor(
    private fb: FormBuilder,
    private dataservice: DataService,
    private modal: NzModalService,
    private datepipe: DatePipe,
    private notification: NzNotificationService,
    private route: Router,
  ) {}

  ngOnInit(): void {
    this.lookupform = this.fb.group({
      organizer: [null],
      date: [null],
      subject: [null],
      status: [null],
    })

    this.createMeetingForm = this.fb.group({
      subject: [null, [Validators.required]],
      address: [null, [Validators.required]],
      selectedTimeZone: [null, [Validators.required]],
      attendees: [null, [Validators.required]],
      startDate: [null, [Validators.required]],

      endDate: [null, [Validators.required]],

      conferenceType: [null, [Validators.required]],
      location: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      quantities: this.fb.array([this.newQuantity()]),
    })
    this.editMeetingForm = this.fb.group({
      subject: [null, [Validators.required]],
      address: [null, [Validators.required]],
      selectedTimeZone: [null, [Validators.required]],
      attendees: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],

      conferenceType: [null, [Validators.required]],
      location: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      timezone: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      quantities: this.fb.array([]),
    })

    this.forwardMeetingForm = this.fb.group({
      attendees: [''],
      forwardquantities: this.fb.array([]),
      actionitems: this.fb.array([]),
      meetingminutes: this.fb.array([]),
    })

    this.searchform = this.fb.group({
      subject: [null],
      startDate: [null],
      organizer: [null],
      status: [null],
    })

    // console.log("table data init========>",this.getTableDataBySearch)
    this.pageSize = 10
    this.pageNum = 1
    this.totalPages = 10

    const children: Array<{ label: string; value: string }> = [
      { label: 'Sai Praneeth Garbham', value: 'sgarbham1' },
      { label: 'Ramya Sree Kilani', value: 'rkilani' },
      { label: 'Supraja Magisetty', value: 'smagisetty' },
      { label: 'Mounica Rompally', value: 'mrompalli' },
      { label: 'Prasad Lokam', value: 'plokam' },
      { label: 'Ravi Nallani', value: 'rnallani' },
    ]

    this.listOfOption = children
    this.pName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.CustomerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.ProjectName = sessionStorage.getItem('pName')
    // this.getTableDataBySearch();
    this.getTable()
  }

  //pagenation methods
  //    onCurrentPageDataChange(data) {
  //   this.pageNum=data;
  //   this.getTableDataBySearch();

  // }
  // onPageSizeChange(data){
  //   console.log("page size change",data)
  //   this.pageSize=data;
  //   this.getTableDataBySearch();

  // }

  // onChange():void
  // {
  //  this.getTableDataBySearch();
  // }

  // resetSearchFields(){
  // this.searchform.reset()
  // this.getTableDataBySearch();
  // }

  //create meeting form arrays
  quantities(): FormArray {
    return this.createMeetingForm.get('quantities') as FormArray
  }
  newQuantity(): FormGroup {
    return this.fb.group({
      title: [''],
      duration: [''],
      assignedto: [''],
      description: [''],
      createdby: ['sgarbham1@miraclesoft.com'],
      modifiedBy: ['smagisetty'],
    })
  }
  addQuantity() {
    this.quantities().push(this.newQuantity())
  }
  removeQuantity(i: number) {
    this.quantities().removeAt(i)
  }

  //edit meeting form arrays
  //edit formarray
  editquantities(): FormArray {
    return this.editMeetingForm.get('quantities') as FormArray
  }

  //forward agenda formarray
  forwardactionquantities(): FormArray {
    return this.forwardMeetingForm.get('actionitems') as FormArray
  }
  forwardagendaquantities(): FormArray {
    return this.forwardMeetingForm.get('forwardquantities') as FormArray
  }
  forwardmeetingquantities(): FormArray {
    return this.forwardMeetingForm.get('meetingminutes') as FormArray
  }
  // addQuantity1() {
  //   this.editquantities().push(this.newQuantity())
  // }
  // removeQuantity1(i: number) {
  //   this.editquantities().removeAt(i)
  // }

  //action items in forward
  actionItems(): FormArray {
    return this.forwardMeetingForm.get('actionitems') as FormArray
  }
  newActionItem(): FormGroup {
    return this.fb.group({
      title: [''],
      duration: [''],
      assignedto: [''],
      description: [''],
      createdby: ['sgarbham1@miraclesoft.com'],
      modifiedBy: ['smagisetty'],
    })
  }
  addActionItem() {
    this.actionItems().push(this.newActionItem())
  }
  removeActionItem(i: number) {
    this.actionItems().removeAt(i)
  }

  //meeting minutes in forward
  meetingMinutes(): FormArray {
    return this.forwardMeetingForm.get('meetingminutes') as FormArray
  }
  newMeetingMinute(): FormGroup {
    return this.fb.group({
      title: [''],
      assignedto: [''],
      description: [''],
      createdby: ['sgarbham1@miraclesoft.com'],
      modifiedBy: ['smagisetty'],
    })
  }
  addMeetingMinute() {
    this.meetingMinutes().push(this.newMeetingMinute())
  }
  removeMeetingMinute(i: number) {
    this.meetingMinutes().removeAt(i)
  }

  //create cancel button
  CreateCancel() {
    this.createvisible = false
    this.createMeetingForm.reset()
  }

  //get table method
  getTable() {
    this.dataservice.get(apis.getMeeting1).subscribe((res: any) => {
      console.log('getapi=========>', res)
      this.tableData1 = res
      this.records = this.tableData1.length
      console.log('table data=======>', this.tableData1)
    })
  }

  //get table method for search api
  // getTableDataBySearch() {

  //   console.log("this.searchform",this.searchform.value);
  //   if(this.searchform.controls.startDate.value)
  //   {
  //     this.startDate = new Date(this.searchform.get('startDate').value).toISOString().substring(0,10)

  //   }
  // organizerId:organizerid === null || organizerid === undefined ? '':organizerid,
  // startDate:startdate === null || startdate === undefined ? '':startdate,
  //   const subject = this.searchform.controls.subject.value
  //   const organizerid = this.searchform.controls.organizer.value
  //   const startdate  = this.startDate
  //   const projectid = this.projectId
  //   const pagenum = this.pageNum
  //   const pagesize = this.pageSize
  //   const status = this.searchform.controls.status.value
  //   const data1 = {
  //     subject:subject === null || subject === undefined ? '':subject,

  //     pageNum: pagenum === null || pagenum === undefined ? '':pagenum,
  //     pageSize: pagesize === null || pagesize === undefined ? '':pagesize,
  //     projectId:projectid === null || projectid === undefined ? '':projectid,
  //     status:status === null || status === undefined ? '':status,
  //   }
  //   console.log("data1====>",data1)
  //   this.dataservice.post(apis.getMeeting,data1).subscribe((res: any) => {
  //     console.log(res)
  //     this.tableData = res[0].data
  //     this.records = this.tableData.length
  //     console.log('table data=======>', this.tableData)
  //   })
  // }

  //disable start and end date functionality
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

  //dialogue boxes methods
  addMeeting() {
    this.createvisible = true
  }
  addRow() {
    console.log('add clicked')
  }
  deleteRow() {
    console.log('add clicked')
  }

  //edit patching
  edit(data) {
    this.editvisible = true
    console.log('meeting data', data)
    this.editMeetingForm.reset()

    this.perdata = data
    const attendArr = []
    this.listOfOption.forEach(element => {
      data.attendees.forEach(data => {
        if (data.attendeeName === element.value + '@miraclesoft.com') {
          attendArr.push(element.value)
        }
      })
    })
    console.log('attend', attendArr)
    console.log('sweet', this.perdata)
    console.log('edit clicked', data.startTime.split(':')[0])

    const day = new Date()
    day.setHours(data.startTime.split(':')[0])
    day.setMinutes(data.startTime.split(':')[1])
    console.log(day)
    const endDay = new Date()
    endDay.setHours(data.endTime.split(':')[0])
    endDay.setMinutes(data.endTime.split(':')[1])
    this.editMeetingForm.controls.attendees.patchValue(attendArr)
    this.editMeetingForm.controls.subject.patchValue(data.subject)
    this.editMeetingForm.controls.startDate.patchValue(data.startDate)
    this.editMeetingForm.controls.startTime.patchValue(day)

    this.editMeetingForm.get('location').patchValue(data.location)
    this.editMeetingForm.get('endTime').patchValue(endDay)
    this.editMeetingForm.get('startDate').patchValue(data.startDate)
    this.editMeetingForm.get('endDate').patchValue(data.endDate)
    this.editMeetingForm
      .get('timezone')
      .patchValue(this.optionList5.filter(x => x.value === data.timeZone)[0].value)
    this.editMeetingForm.get('conferenceType').patchValue(data.locationType)
    this.editMeetingForm.get('quantities').patchValue(data.agendas)
    const control = <FormArray>this.editMeetingForm.controls['quantities']
    for (let i = control.length - 1; i >= 0; i) {
      control.removeAt(i)
    }
    data.agendas.forEach(element => {
      this.editAgenda(element)
    })
  }
  editAgenda(data?: any) {
    let fg = this.fb.group({
      title: [data.title || ''],
      duration: [this.timeMiutes.filter(x => x.m === data.duration)[0].m],
      assignedto: [data.assignedTo === null || data.assignedTo === undefined || data.assignedTo === '' ? null :
         this.attendees.filter(x => x.v === data.assignedTo)[0].v],
      description: [data.description || ''],
    })
    ;(this.editMeetingForm.get('quantities') as FormArray).push(fg)
  }

  //edit integration
  editData() {
    if (this.editMeetingForm.controls.startTime.value) {
      const starttime = this.editMeetingForm.controls.startDate.value
      const availablti = new Date(Date.parse(starttime))
      this.startTime = this.datepipe.transform(availablti, 'hh:mm:ss')
    }
    if (this.editMeetingForm.controls.endTime.value) {
      const starttime = this.editMeetingForm.controls.startDate.value
      const availablti = new Date(Date.parse(starttime))
      this.endTime = this.datepipe.transform(availablti, 'hh:mm:ss')
    }

    console.log('tagvalue', this.tagValue[0], this.tagValue.length)
    const children: Array<{
      attendeeName: string
      addedDate: string
      createdBy: string
      modifiedBy: string
    }> = []
    for (let i = 0; i < this.tagValue.length; i++) {
      console.log('in for loop', this.tagValue[i])
      children.push({
        attendeeName: this.tagValue[i] + '@miraclesoft.com',
        addedDate: '2020-02-02',
        createdBy: 'sprathi@miraclesoft.com',
        modifiedBy: 'smagisetty',
      })

      this.dummyArray = children
    }
    console.log('dummy array =========>', this.dummyArray)

    console.log('gfjhgdshdygkjysiuy', this.perdata)
    const data = {
      id: this.perdata.id,
      projectId: this.perdata.projectId,
      documentIds: this.perdata.documentIds,
      prevMeetingId: this.perdata.prevMeetingId,
      startDate: this.editMeetingForm.get('startDate').value,
      endDate: this.editMeetingForm.get('endDate').value,
      startTime: this.startTime,
      endTime: this.endTime,
      locationType: this.perdata.locationType,
      //timeZone : this.editMeetingForm.get('timezone').value.value,

      timeZone: this.editMeetingForm.controls.timezone.value,

      location: this.editMeetingForm.get('location').value,
      recurrence: this.perdata.recurrence,
      organizerType: this.perdata.organizerType,
      organizerId: this.perdata.organizerId,
      subject: this.editMeetingForm.get('subject').value,
      createdBy: this.perdata.createdBy,
      ModifiedBy: 'smagisetty',

      agendas: this.editMeetingForm.controls.quantities.value,

      attendees: this.dummyArray,
    }
    console.log('time', this.editMeetingForm.get('timezone').value)
    console.log('edit body request==============>', data)

    this.dataservice.post(apis.editMeetingPost, data).subscribe((res: any) => {
      console.log(res)
      this.editDatares = res
      setTimeout(() => {
        this.getTable()
      }, 2000)
      // Activate after 2 sec.
      console.log('createData data=======>', this.editDatares)
      if (this.editDatares.hasOwnProperty('sucess') === true) {
        this.notification.create(
          'success',
          'Successfully Updated',
          'Your data has been successfully updated',
        )
      } else {
        this.notification.create(
          'sucess',
          'Your data has been successfully updated',
          'Your data is updated ',
        )
      }
    })
    this.editvisible = false
  }

  submitData() {
    // if (this.createMeetingForm.untouched || this.createMeetingForm.invalid) {
    //   this.submitForm()
    // } else {
    //   console.log('FormData========>', this.createMeetingForm.value)
    //   console.log('date, time', this.date, this.time)
    //   this.createvisible = false
    // }

    console.log('tagvalue', this.tagValue[0], this.tagValue.length)
    const children: Array<{
      attendeeName: string
      addedDate: string
      createdBy: string
      modifiedBy: string
    }> = []
    for (let i = 0; i < this.tagValue.length; i++) {
      console.log('in for loop', this.tagValue[i])
      children.push({
        attendeeName: this.tagValue[i] + '@miraclesoft.com',
        addedDate: '2020-02-02',
        createdBy: 'sprathi@miraclesoft.com',
        modifiedBy: 'smagisetty',
      })

      this.dummyArray = children
    }
    console.log('dummy array =========>', this.dummyArray)
    if (this.createMeetingForm.controls.startDate.value) {
      const startdte = this.createMeetingForm.controls.startDate.value
      const availablDt = new Date(Date.parse(startdte))
      this.startDate1 = this.datepipe.transform(availablDt, 'yyyy-MM-dd')
    }
    console.log('startdate1=============>', this.startDate1)
    if (this.createMeetingForm.controls.endDate.value) {
      const enddte = this.createMeetingForm.controls.endDate.value
      const endDt = new Date(Date.parse(enddte))
      this.endDate = this.datepipe.transform(endDt, 'yyyy-MM-dd')
    }
    if (this.createMeetingForm.controls.startTime.value) {
      const starttime = this.createMeetingForm.controls.startTime.value
      const availablti = new Date(Date.parse(starttime))
      this.startTime = this.datepipe.transform(availablti, 'hh:mm:ss')
    }
    if (this.createMeetingForm.controls.endTime.value) {
      const endtime = this.createMeetingForm.controls.endTime.value
      const availablti = new Date(Date.parse(endtime))
      this.endTime = this.datepipe.transform(availablti, 'hh:mm:ss')
    }
    const locationType = this.createMeetingForm.controls.conferenceType.value
    const location = this.createMeetingForm.controls.location.value
    const timezone = this.createMeetingForm.controls.selectedTimeZone.value
    const subject = this.createMeetingForm.controls.subject.value
    const agendas = this.createMeetingForm.controls.quantities.value
    const startdate = this.startDate1
    const enddate = this.endDate
    const starttime = this.startTime
    const endtime = this.endTime
    const attendees = this.dummyArray
    const data = {
      projectId: this.projectId,
      documentIds: 's',
      prevMeetingId: 1,
      startDate: startdate === null || startdate === undefined ? '' : startdate,
      endDate: enddate === null || enddate === undefined ? '' : enddate,
      startTime: starttime === null || starttime === undefined ? '' : starttime,
      endTime: endtime === null || endtime === undefined ? '' : endtime,
      locationType: locationType === null || locationType === undefined ? '' : locationType,
      timeZone: timezone === null || timezone === undefined ? '' : timezone,
      location: location === null || location === undefined ? '' : location,
      recurrence: 'y',
      organizerType: 'o',
      organizerId: 'smagisetty@miraclesoft.com',
      subject: subject === null || subject === undefined ? '' : subject,
      createdBy: 'smagisetty',
      ModifiedBy: 'smagisetty',
      agendas: agendas === null || agendas === undefined ? '' : agendas,
      attendees: attendees === null || attendees === undefined ? '' : attendees,
    }
    console.log('--->data to table', data)
    this.dataservice.post(apis.createMeetingPost, data).subscribe((res: any) => {
      console.log(res)
      this.createData = res
      setTimeout(() => {
        // this.getTableDataBySearch();
      }, 2000) // Activate after 2 sec.
      // Activate after 2 sec.
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
    this.createvisible = false
  }
  Recurring() {
    this.recurvisible = true
    this.createvisible = false
  }
  EditCancel() {
    this.editvisible = false
  }

  copy(data) {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to copy this meeting?</i>',
      nzContent: '',
      nzOnOk: () => this.CopyOk(),
    })
  }
  CopyCancel() {
    this.copyvisible = false
  }
  CopyOk() {
    this.copyvisible = false
  }

  //forward patching
  forward(data) {
    this.forwardvisible = true
    console.log('fodata', data)

    this.forwardMeetingForm.reset()
    this.perdata1 = data
    this.forwardvisible = true
    this.subject1 = data.subject
    this.startDate1 = data.startDate
    this.enddate = data.endDate
    this.starttime = data.startTime
    this.location = data.location
    this.endtime = data.endTime
    this.conferencetype = data.locationType
    this.timezone = data.timeZone

    const attendArr1 = []
    this.listOfOption.forEach(element => {
      data.attendees.forEach(data => {
        if (data.attendeeName === element.value + '@miraclesoft.com') {
          attendArr1.push(element.value)
        }
      })
    })
    console.log('forward attendees', attendArr1)
    console.log('forward table get', this.perdata1)

    this.forwardMeetingForm.controls.attendees.patchValue(attendArr1)
    // this.editMeetingForm.get('quantities').patchValue(this.fb.array([]));
    // const control = <FormArray>this.forwardMeetingForm.controls['forwardquantities']
    //    for(let i = control.length -1 ; i >= 0; i){
    //      control.removeAt(i)
    //    }
    //    const control1 = <FormArray>this.forwardMeetingForm.controls['meetingminutes']
    //    for(let i = control1.length -1 ; i >= 0; i){
    //      control.removeAt(i)
    //    }
    data.actionItems.forEach(element => {
      this.forwardActionItem(element)
    })
    data.meetingMinutes.forEach(element => {
      this.forwardMeetingMinute(element)
    })
    data.agendas.forEach(element => {
      this.forwardAgenda(element)
    })
  }
  forwardActionItem(data?: any) {
    let fg = this.fb.group({
      title: [data.title || ''],

      assignedto: [this.attendees.filter(x => x.a === data.assignedTo)[0]],
      description: [data.description || ''],
    })
    ;(this.forwardMeetingForm.get('actionitems') as FormArray).push(fg)
  }
  forwardMeetingMinute(data?: any) {
    let fg = this.fb.group({
      title: [data.title || ''],

      speakers: [this.attendees.filter(x => x.a === data.assignedTo)[0]],
      description: [data.description || ''],
    })
    ;(this.forwardMeetingForm.get('meetingminutes') as FormArray).push(fg)
  }
  forwardAgenda(data?: any) {
    let fg = this.fb.group({
      title: [data.title || ''],
      duration: [this.timeMiutes.filter(x => x.m === data.duration)[0].m],
      assignedto: [this.attendees.filter(x => x.a === data.assignedTo)[0]],
      description: [data.description || ''],
    })
    ;(this.forwardMeetingForm.get('forwardquantities') as FormArray).push(fg)
  }
  ForwardCancel() {
    this.forwardvisible = false
  }

  //forward integration
  ForwardOk() {
    this.forwardvisible = false
    console.log(this.forwardMeetingForm.get('attendees').value)
    const attendeeData = this.forwardMeetingForm.get('attendees').value
    const attendArray = []
    const attendMailArray = []
    attendeeData.forEach(element => {
      let data = {
        attendeeName: element + '@miraclesoft.com',
        addedDate: '2020-02-02',
        createdBy: 'sprathi',
        modifiedBy: 'smagisetty',
      }
      attendArray.push(data)
      attendMailArray.push(element + '@miraclesoft.com')
    })
    console.log(attendMailArray.toString(), attendArray)

    this.forwardvisible = false
    console.log('mouni', this.perdata1)
    const subject1 = this.perdata1.subject
    const startDate1 = this.perdata1.startDate
    const enddate = this.perdata1.endDate
    const starttime = this.perdata1.startTime
    const location = this.perdata1.location
    const endtime = this.perdata1.endTime
    const document = this.perdata1.documentIds
    const projectid = this.perdata1.projectId
    const pevmeetingid = this.perdata1.prevMeetingId
    const organizerid = this.perdata1.organizerId
    const createdby = this.perdata1.createdBy
    const locationtype = this.perdata1.locationType
    const timezone = this.perdata1.timeZone
    const modifiedby = this.perdata1.modifiedBy
    const organizertype = this.perdata1.organizerType
    const id = this.perdata1.id

    const data1 = {
      id: id,
      subject: subject1,
      projectId: projectid,
      documentIds: document,
      prevMeetingId: pevmeetingid,
      startDate: startDate1,
      endDate: enddate,
      startTime: starttime,
      endTime: endtime,
      organizerId: organizerid,
      location: location,
      created: createdby,
      locationtype: locationtype,
      timezone: timezone,
      modifiedby: modifiedby,
      oganizertype: organizertype,
      // recurrence: 'y',
      // organizerType: 'o',

      //locationType:data.locationType,
      // timeZone: data.timeZone,
      agendas: this.forwardMeetingForm.controls.forwardquantities.value,
      attendees: attendArray,
      meetingminutes: this.forwardMeetingForm.controls.meetingminutes.value,
      actionitems: this.forwardMeetingForm.controls.actionitems.value,
    }
    console.log('--->data to tableforward', data1)
    this.dataservice
      .post(apis.forwardMeetingPost + attendMailArray.toString(), data1)
      .subscribe((res: any) => {
        console.log(res)
        this.forwardData = res

        // Activate after 2 sec.
        console.log('forwardData data=======>', this.forwardData)
        if (this.forwardData.hasOwnProperty('Forward') === true) {
          this.notification.create(
            'success',
            'Successfully Forward',
            'Your invite has been successfully Forwarded',
          )
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
        }
      })
  }
  update(data) {
    this.updatevisible = true
  }
  UpdateCancel() {
    this.updatevisible = false
  }
  UpdateOk() {
    this.updatevisible = false
  }
  cancel(data) {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to cancel this meeting?</i>',
      nzContent: '',
      nzOnOk: () => this.CancelOk(),
    })
    this.canceltabledata = data
    console.log('cancel data============================>', this.canceltabledata, data)
  }
  Cancelcancel() {
    this.cancelvisible = false
  }
  CancelOk() {
    console.log('table ===========> cancel', this.canceltabledata)
    const locationType = this.canceltabledata.locationType
    const location = this.canceltabledata.location
    const timezone = this.canceltabledata.timeZone
    const subject = this.canceltabledata.subject
    const agendas = this.canceltabledata.agendas
    const startdate = this.canceltabledata.startDate
    const enddate = this.canceltabledata.endDate
    const starttime = this.canceltabledata.startTime
    const endtime = this.canceltabledata.endTime
    const attendees = this.canceltabledata.attendees
    const projectId = this.canceltabledata.projectId
    const id = this.canceltabledata.id
    const data = {
      id: id === null || id === undefined ? '' : id,
      projectId: projectId === null || projectId === undefined ? '' : projectId,
      documentIds: 's',
      prevMeetingId: 1,
      startDate: startdate === null || startdate === undefined ? '' : startdate,
      endDate: enddate === null || enddate === undefined ? '' : enddate,
      startTime: starttime === null || starttime === undefined ? '' : starttime,
      endTime: endtime === null || endtime === undefined ? '' : endtime,
      locationType: locationType === null || locationType === undefined ? '' : locationType,
      timeZone: timezone === null || timezone === undefined ? '' : timezone,
      location: location === null || location === undefined ? '' : location,
      recurrence: 'y',
      organizerType: 'o',
      organizerId: 'smagisetty@miraclesoft.com',
      subject: subject === null || subject === undefined ? '' : subject,
      createdBy: 'smagisetty',
      ModifiedBy: 'smagisetty',
    }
    console.log('--->data to table1cancel alesdjknwnedcowaln edwlakj endlwkjads cwc dj', data)
    this.dataservice.post(apis.cancelMeeting, data).subscribe((res: any) => {
      console.log(res)
      this.cancelData = res
      setTimeout(() => {
        this.getTable()
      }, 2000) // Activate after 2 sec.
      // Activate after 2 sec.
      console.log('createData data=======>', this.createData)
      if (this.cancelData.hasOwnProperty('cancel') === true) {
        this.notification.create(
          'success',
          'Meeting Cancelled',
          'Your Meeting has been successfully cancelled',
        )
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
      }
    })
    this.cancelvisible = false
  }
  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.pName])
  }
  gotoHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }
}
