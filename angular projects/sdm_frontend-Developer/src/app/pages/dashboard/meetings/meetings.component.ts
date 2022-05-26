import { Component, OnInit } from '@angular/core'
import { apis } from 'src/app/api'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { DataService } from 'src/app/data.service'
import { NzModalService } from 'ng-zorro-antd/modal'
import { Validators } from '@angular/forms'
import { DatePipe } from '@angular/common'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { NzNotificationService } from 'ng-zorro-antd'
import { Router } from '@angular/router'

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss'],
  providers: [DatePipe],
})
export class MeetingsComponent implements OnInit {
  searchForm: FormGroup
  addEditMeetingForm: FormGroup
  updateForwardMeetingForm: FormGroup
  status: any
  assignTo: any
  listOfOption: any = []
  conferenceType = {
    a: 'audio',
    p: 'physical',
    v: 'video',
    w: 'web'
  }
  header = 'Search '
  timeZoneList: any
  records: any
  ProjectName: any
  CustomerName: any
  tableData: any
  pageNum = 1
  pageSize = 10
  projectId: any
  totalPages: any
  addEditDialogHeader: string
  createVisible = false
  addBtn = false
  createData: any
  editBtn = false
  editDatares: any
  meetingId: any
  file: File[]
  startValue: Date
  disabledStartDate: any
  disabledEndDate: (current: Date) => boolean
  updateVisible = false
  updateBtn = false
  forwardBtn = false
  subject1: any
  updateForward: string
  attendPatch: string
  location: any
  startDate1: any
  enddate: any
  starttime: any
  endtime: any
  myTimeZone: string
  conferencetype: any
  duration: any
  forwardUpdateData: any
  cancelData: any
  cancelvisible: boolean
  canceltabledata1: any  
  constructor( private fb: FormBuilder, private dataservice: DataService,
    private modal: NzModalService, private datepipe: DatePipe,
    private notification: NzNotificationService, private route: Router, ) {
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.CustomerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    //APi for timezone
    this.dataservice.get(apis.timeZoneDropDown).subscribe(res => {
      console.log('timeZoneList', res)
      this.timeZoneList = res
    })
    //Api for status
    this.dataservice.get(apis.statusDropdown).subscribe(res => {
      console.log('status', res)
      this.status = res
    })
    //Api for duration
    this.dataservice.get(apis.durationDropDown).subscribe(res => {
      console.log('timeMiutes', res)
      this.duration = res
    })
    // Api for resources
    this.dataservice.get(apis.resourceDropDown + this.projectId).subscribe((res: any) => {
      console.log(res, 'resource')
      this.listOfOption = res
    })
    //api for assign to drop down in agenda
    this.dataservice.get(apis.assignToDropDown).subscribe((res: any) => {
      console.log(res, 'resource')
      this.assignTo = res
    })
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      subject: [null],
      startDate: [null],
      organizer: [null],
      status: [null]
    })
    this.getTableDataBySearch()
    this.addEditMeetingForm = this.fb.group({
      subject:  [
        '',
        [Validators.required, Validators.maxLength(60), Validators.pattern('^[a-zA-z ]*$')],
      ],
      timezone: ['', [Validators.required]],
      attendees: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      conferenceType: ['', [Validators.required]],
      location: [
        '',
        [Validators.required, Validators.maxLength(200)],
      ],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      quantities: this.fb.array([this.newQuantity()]),
    })
    this.disabledStartDate = (current: Date): boolean => {
      return differenceInCalendarDays(current, new Date()) < 0
    }
    this.updateForwardMeetingForm = this.fb.group({
      attendees: ['', [Validators.required]],
      attendees1: ['', [Validators.required]],
      quantities: this.fb.array([]),
      meetingminutes: this.fb.array([this.newQuantity()]),
      actionitems: this.fb.array([this.newQuantity()]),
    })
  }
  // get and search  meeting data 
  getTableDataBySearch() {
    console.log('this.searchForm', this.searchForm.value)
    const subject = this.searchForm.controls.subject.value
    const organizerid = this.searchForm.controls.organizer.value
    const startdate = this.searchForm.get('startDate').value
    const status = this.searchForm.controls.status.value
    const data1 = {
      subject: subject === null || subject === undefined ? '' : subject,
      organizerId: organizerid === null || organizerid === undefined ? '' : organizerid,
      startDate: startdate === null || startdate === undefined ? '' : new Date(startdate).toISOString().substring(0, 10),
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      projectId: this.projectId,
      status: status === null || status === undefined ? '' : status,
    }
    console.log('data1====>', data1)
    this.dataservice.post(apis.getMeeting, data1).subscribe((res: any) => {
      console.log(res)
      this.tableData = res[0].data
      this.totalPages = res[0].count
      this.records = res[0].count
    })
  }

  //Pagination
  onCurrentPageDataChange(data) {
    console.log(data)
    this.pageNum = data
    this.getTableDataBySearch()
  }
  onPageSizeChange(data) {
    console.log(data)
    this.pageSize = data
    this.getTableDataBySearch()
  }
   
  formReset() {                          // to reset search fields
    this.searchForm.reset()
    this.getTableDataBySearch()
  }
  
  gotoHome() {                          // routing back to  home
    this.route.navigate(['/dashboard/allProjects'])
  }

  details() {                          //Routing back to dashboard
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  // form array methods for create,copy & edit meeting agenda 
  quantities(): FormArray {
    return this.addEditMeetingForm.get('quantities') as FormArray
  }
  newQuantity(): FormGroup {
    return this.fb.group({
      title: [''],
      duration: [''],
      assignedTo: [''],
      description: [''],
      createdby: ['sgarbham1@miraclesoft.com'],
      modifiedBy: ['sgarbham1'],
    })
  }
  // update & forward meeting form array methods
  agendas() {
    return this.updateForwardMeetingForm.get('quantities') as FormArray
  }
  meetingMinute() {
    return this.updateForwardMeetingForm.get('meetingminutes') as FormArray
  }
  actionItem() {
    return this.updateForwardMeetingForm.get('actionitems') as FormArray
  }
  //add methods in form array
  addActionItem() {
    this.actionItem().push(this.newQuantity())
  }
    
  addMeetingMinute() {
    this.meetingMinute().push(this.newQuantity())
  }
    
  addQuantity() {
    this.quantities().push(this.newQuantity())
  }
    //remove methods in form array
  removeQuantity(i: number) {
    this.quantities().removeAt(i)
  }
  
  removeMeetingMinute(i: number) {
    this.meetingMinute().removeAt(i)
  }
 
  removeActionItem(i: number) {
    this.actionItem().removeAt(i)
  }
  //to open Add pop up method
  addMeeting() {
    this.addEditMeetingForm.reset()
    this.createVisible = true
    this.addBtn = true
    this.editBtn = false
    this.addEditDialogHeader = 'Create Meeting'   
}

// to close add pop up
  CreateCancel() {
    this.addEditMeetingForm.reset()
    this.createVisible = false
    this.quantities().controls.length = 1
  }

  //save method for create , edit and copy
  createsubmitData(type) {
    const children = []
    const ateendeeData = this.addEditMeetingForm.get('attendees').value
    console.log(ateendeeData)
    ateendeeData.forEach(element => {
      children.push(
        {
          attendeeName: element+'@miraclesoft.com',
          createdBy: JSON.parse(sessionStorage.getItem('loginData')).LoginId,
          modifiedBy: JSON.parse(sessionStorage.getItem('loginData')).LoginId,
        })
    })
    const startdte = this.addEditMeetingForm.controls.startDate.value
    const enddte = this.addEditMeetingForm.controls.endDate.value
    const starttime = this.addEditMeetingForm.controls.startTime.value
    const endtime = this.addEditMeetingForm.controls.endTime.value
    const locationType = this.addEditMeetingForm.controls.conferenceType.value
    const location = this.addEditMeetingForm.controls.location.value
    const timezone = this.addEditMeetingForm.controls.timezone.value
    const subject = this.addEditMeetingForm.controls.subject.value
    const agendas = this.addEditMeetingForm.controls.quantities.value
    const data = {
      projectId: this.projectId,
      documentIds: 's',
      prevMeetingId: this.addEditDialogHeader === 'Copy Meeting' ? this.meetingId : 0,
      startDate: startdte === null || startdte === undefined ? '' : new Date(startdte).toISOString().substring(0, 10),
      endDate: enddte === null || enddte === undefined ? '' : new Date(enddte).toISOString().substring(0, 10),
      startTime: starttime === null || starttime === undefined ? '' : this.datepipe.transform(new Date(Date.parse(starttime)), 'hh:mm:ss'),
      endTime: endtime === null || endtime === undefined ? '' : this.datepipe.transform(new Date(Date.parse(endtime)), 'hh:mm:ss'),
      locationType: locationType === null || locationType === undefined ? '' : locationType,
      timeZone: timezone === null || timezone === undefined ? '' : timezone,
      location: location === null || location === undefined ? '' : location,
      recurrence: 'y',
      organizerType: 'o',
      organizerId: 'smagisetty@miraclesoft.com', 
      subject: subject === null || subject === undefined ? '' : subject,
      createdBy: JSON.parse(sessionStorage.getItem('loginData')).LoginId,
      ModifiedBy: JSON.parse(sessionStorage.getItem('loginData')).LoginId,
      agendas: agendas === null || agendas === undefined ? '' : agendas,
      attendees: children,
    }
    const formData: FormData = new FormData()
    if (this.file === undefined) {

    } else {
      this.file.forEach(ele => {
        formData.append('files', ele)
      })
    }
    if (type === 'add') {
      console.log(data, this.file)
      formData.append('data', new Blob([JSON.stringify(data)],
        {
          type: 'application/json'
        }))
      this.dataservice.post(apis.createMeetingPost, formData).subscribe((res: any) => {
        console.log(res)
        this.createData = res
        console.log('createData data=======>', this.createData)
        if (this.createData.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Added',
            'Your data has been successfully added',
          )
        } else {
          this.notification.create('error', 'Failed to Add', 'Your data is failed to Add ')
        }
        setTimeout(() => {
          this.getTableDataBySearch()
        }) // Activate after 2 sec.
      })
    } else if (type === 'edit') {
      const data1 = { id: this.meetingId }
      const data2 = Object.assign(data, data1)
      console.log(data2)
      formData.append('data', new Blob([JSON.stringify(data2)],
        {
          type: 'application/json'
        }))
      this.dataservice.post(apis.editMeetingPost, formData).subscribe((res: any) => {
        console.log(res)
        this.editDatares = res
        console.log('createData data=======>', this.editDatares)
        if (this.editDatares.hasOwnProperty('sucess') === true) {
          this.notification.create(
            'success',
            'Successfully Updated',
            'Your data has been successfully updated',
          )
        } else {
          this.notification.create('sucess', 'Your data has been successfully updated', 'Your data is updated ')
        }
        setTimeout(() => {
          this.getTableDataBySearch()
        }) // Activate after 2 sec
      })
    }    
    this.createVisible = false
  }
  //Date validation
  onStartChange(date: Date): void {
    this.startValue = date
    this.disabledEndDate = (current: Date): boolean => {
      return differenceInCalendarDays(current, new Date(this.startValue)) < 0
    }
  }
  //open edit meeting pop-up method and patching the values
  edit(data, type) {
    if (type === 'copy') {
      this.addEditDialogHeader = 'Copy Meeting'
      this.editBtn = false
      this.addBtn = true
      this.meetingId = data.id
    } else if (type === 'edit') {
      this.addEditDialogHeader = 'Edit Meeting'
      this.editBtn = true
      this.addBtn = false
      this.meetingId = data.id
    }
    this.createVisible = true
    this.addEditMeetingForm.reset()
    this.quantities().controls.length = 0
    console.log('meeting data', this.timeZoneList)
    const attendArr = []
    this.listOfOption.forEach(element => {
      data.attendees.forEach(data => {
        if (data.attendeeName === element.resourceName) {
          attendArr.push(element.resourceName)
        }
      })
    })
    console.log('attend', attendArr)
    console.log('sweet', data)
    const day = new Date()
    day.setHours(data.startTime.split(':')[0])
    day.setMinutes(data.startTime.split(':')[1])
    console.log(day)
    const endDay = new Date()
    endDay.setHours(data.endTime.split(':')[0])
    endDay.setMinutes(data.endTime.split(':')[1])
    this.addEditMeetingForm.controls.attendees.patchValue(attendArr)
    this.addEditMeetingForm.controls.subject.patchValue(data.subject)
    this.addEditMeetingForm.controls.startDate.patchValue(data.startDate)
    this.addEditMeetingForm.controls.startTime.patchValue(day)
    this.addEditMeetingForm.get('location').patchValue(data.location)
    this.addEditMeetingForm.get('endTime').patchValue(endDay)
    this.addEditMeetingForm.get('startDate').patchValue(data.startDate)
    this.addEditMeetingForm.get('endDate').patchValue(data.endDate)
    this.addEditMeetingForm.get('timezone').patchValue(this.timeZoneList.filter(x => x.Value === data.timeZone)[0].Value)
    this.addEditMeetingForm.get('conferenceType').patchValue(data.locationType)
    data.agendas.forEach(element => {
      this.editAgenda(element, 'edit')
    })
  }
  //Patching the values for agenda
  editAgenda(data, type) {
    const fg = this.fb.group({
      title: [data.title || ''],
      duration: [this.duration.filter(x => x.Value === data.duration)[0]?.Value],
      assignedTo: [type === 'meetingMinutes' ? this.assignTo.filter(x => x.Value ===  data.speakers)[0]?.Value :
       this.assignTo.filter(x => x.Value ===  data.assignedTo)[0]?.Value],
      description: [data.description || ''],
    })
    if (type === 'edit') {
      (this.addEditMeetingForm.get('quantities') as FormArray).push(fg)
    } else if (type === 'forword') {
      (this.updateForwardMeetingForm.get('quantities') as FormArray).push(fg)
    } else if (type === 'meetingMinutes') {
      (this.updateForwardMeetingForm.get('meetingminutes') as FormArray).push(fg)
    } else if (type === 'actionitems') {
      (this.updateForwardMeetingForm.get('actionitems') as FormArray).push(fg)
    }
  }
  //upload method
  changeListener($event): void {
    console.log($event)
    if ($event.fileList.length === 0) {
      this.file = []
    } else {
      switch ($event.file.status) {
        case 'uploading':
          console.log($event)
          break
        case 'done':
          this.file = []
          console.log($event.fileList)
          $event.fileList.forEach(element => {
            this.file.push(element.originFileObj)
          })
      }
      console.log(this.file)
    }
  }
  // to open update pop-up and update the values
  update(data, name) {
    this.forwardUpdateData = data
    console.log(data, data.attendees)
    const attendArr1 = []
    const attendName = []
    data.attendees.forEach(element => {
      attendArr1.push(element.attendeeName)
      attendName.push(element.attendeeName.split('@')[0])
    })
    this.attendPatch = attendArr1.toString()
    this.subject1 = data.subject
    this.updateForwardMeetingForm.get('attendees1').patchValue(attendName)
    this.updateForwardMeetingForm.get('attendees').patchValue(attendName)
    this.location = data.location
    this.startDate1 = data.startDate
    this.enddate = data.endDate
    this.starttime = data.startTime
    this.endtime = data.endTime
    this.myTimeZone = this.timeZoneList.filter(x => x.Value === data.timeZone)[0].Label
    this.conferencetype = data.locationType
    if (data.agendas.length === 0) {
    } else {
      data.agendas.forEach(element => {
        this.agendas().controls.length = 0
        this.editAgenda(element, 'forword')
      })
    }
    if (data.meetingMinutes.length === 0) {
    } else {
      data.meetingMinutes.forEach(element => {
        this.meetingMinute().controls.length = 0
        this.editAgenda(element, 'meetingMinutes')
      })
    }
    if (data.actionItems.length === 0) {
    } else {
      data.actionItems.forEach(element => {
        this.actionItem().controls.length = 0
        this.editAgenda(element, 'actionitems')
      })
    }
    this.updateVisible = true
    if (name === 'Forward') {
      this.addEditDialogHeader = 'Forward Meeting'
      this.updateForward = 'Forward To'
      this.updateForwardMeetingForm.get('quantities').disable()
      this.updateForwardMeetingForm.get('meetingminutes').disable()
      this.updateForwardMeetingForm.get('actionitems').disable()
      this.updateBtn = false
      this.forwardBtn = true
    } else if (name === 'update') {
      this.updateForward = 'Update To'
      this.addEditDialogHeader = 'Update Meeting'
      this.updateForwardMeetingForm.get('meetingminutes').enable()
      this.updateForwardMeetingForm.get('actionitems').enable()
      this.updateBtn = true
      this.forwardBtn = false
    }
  }
  //to close update and forward pop up
  UpdateCancel() {
    this.updateVisible = false
  }
  //to update values in update and forward meeting
  updatesubmitData(type) {
    const meetingOverView = []
    const actionOverview = []
    const agenda = []
    const atendeeData = []
    const agendaData = this.updateForwardMeetingForm.get('quantities').value
    const meetingPoints = this.updateForwardMeetingForm.get('meetingminutes').value
    const actionPoints = this.updateForwardMeetingForm.get('actionitems').value
    agendaData.forEach(element => {
      agenda.push({
        'title': element.title,
        'description': element.description,
        'assignedTo': element.assignedTo,
        'duration': element.duration,
        'createdBy': JSON.parse(sessionStorage.getItem('loginData')).LoginId,
        'modifiedBy': JSON.parse(sessionStorage.getItem('loginData')).LoginId
      })
    })
    meetingPoints.forEach(element => {
      meetingOverView.push({
        'title': element.title,
        'description': element.description,
        'speakers': element.assignedTo,
        'createdBy': JSON.parse(sessionStorage.getItem('loginData')).LoginId,
        'modifiedBy': JSON.parse(sessionStorage.getItem('loginData')).LoginId
      })
    })
    actionPoints.forEach(element => {
      actionOverview.push({
        'title': element.title,
        'description': element.description,
        'assignedTo': element.assignedTo,
        'createdBy': JSON.parse(sessionStorage.getItem('loginData')).LoginId,
        'modifiedBy': JSON.parse(sessionStorage.getItem('loginData')).LoginId
      })
    })
    const atendeeEmail = []
    this.forwardUpdateData.attendees.forEach(element => {
      atendeeData.push({
        'attendeeName': element.attendeeName,
        'createdBy': JSON.parse(sessionStorage.getItem('loginData')).LoginId,
        'modifiedBy': JSON.parse(sessionStorage.getItem('loginData')).LoginId,
      })
      atendeeEmail.push(element.attendeeName)
    })
    if (type === 'update') {
      const data = {
        'id': this.forwardUpdateData.id,
        'projectId': this.forwardUpdateData.projectId,
        'documentIds': 's',
        'prevMeetingId': 0,
        'startDate': this.forwardUpdateData.startDate,
        'endDate': this.forwardUpdateData.endDate,
        'startTime': this.forwardUpdateData.startTime,
        'endTime': this.forwardUpdateData.endTime,
        'locationType': this.forwardUpdateData.locationType,
        'timeZone': this.forwardUpdateData.timeZone,
        'location': this.forwardUpdateData.location,
        'recurrence': 'y',
        'organizerType': 'o',
        'organizerId': 'smagisetty@miraclesoft.com',
        'subject': this.forwardUpdateData.subject,
        'createdBy': JSON.parse(sessionStorage.getItem('loginData')).LoginId,
        'ModifiedBy': JSON.parse(sessionStorage.getItem('loginData')).LoginId,
        'actionItems': actionOverview,
        'meetingMinutes': meetingOverView
      }
      console.log(data)
      this.dataservice.post(apis.updateMeetingPost, data).subscribe((res: any) => {
        console.log(res)
        setTimeout(() => {
          this.getTableDataBySearch()
        })
        if (res.hasOwnProperty('sucess') === true) {
          this.notification.create(
            'success',
            'Successfully Added',
            'Your data has been successfully added',
          )
        } else {
          this.notification.create('success', 'Your data has been successfully updated', 'Your data is updated ')
        }
        this.updateVisible = false
      })
    } else if (type === 'forward') {
      const data = {
        'id': this.forwardUpdateData.id,
        'projectId': this.forwardUpdateData.projectId,
        'documentIds': 's',
        'prevMeetingId': 0,
        'startDate': this.forwardUpdateData.startDate,
        'endDate': this.forwardUpdateData.endDate,
        'startTime': this.forwardUpdateData.startTime,
        'endTime': this.forwardUpdateData.endTime,
        'locationType': this.forwardUpdateData.locationType,
        'timeZone': this.forwardUpdateData.timeZone,
        'location': this.forwardUpdateData.location,
        'recurrence': 'y',
        'organizerType': 'o',
        'organizerId': 'smagisetty@miraclesoft.com',
        'subject': this.forwardUpdateData.subject,
        'createdBy': JSON.parse(sessionStorage.getItem('loginData')).LoginId,
        'ModifiedBy': JSON.parse(sessionStorage.getItem('loginData')).LoginId,
        'agendas': agenda,
        'attendees': atendeeData,
        'actionItems': actionOverview,
        'meetingMinutes': meetingOverView
      }
      this.dataservice.post(apis.forwardMeetingPost + atendeeEmail.toString(), data).subscribe((res: any) => {
        console.log(res)
        setTimeout(() => {
          this.getTableDataBySearch()
        }) // Activate after 2 sec
        if (res.hasOwnProperty('Forward') === true) {
          this.notification.create(
            'success',
            'Successfully Forward',
            'Your invite has been successfully Forwarded'
          )
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
        }
        this.updateVisible = false
      })
    }
  }

  // to display cancel meeeting pop up
  cancel(data) {
    this.modal.confirm({
      nzTitle: '<i>Do you want to cancel this meeting?</i>',
      nzContent: '',
      nzOnOk: () => this.CancelOk(),

    })
    this.canceltabledata1 = data
    console.log('cancel data============================>', this.canceltabledata1, data)
  }
  //  to close cancel meeting pop up
  Cancelcancel() {
    this.cancelvisible = false
  }
  // to cancel a meeting
  CancelOk() {
    console.log('table ===========> cancel', this.canceltabledata1)
    const locationType = this.canceltabledata1.locationType
    const location = this.canceltabledata1.location
    const timezone = this.canceltabledata1.timeZone
    const subject = this.canceltabledata1.subject
    const agendas = this.canceltabledata1.agendas
    const startdate = this.canceltabledata1.startDate
    const enddate = this.canceltabledata1.endDate
    const starttime = this.canceltabledata1.startTime
    const endtime = this.canceltabledata1.endTime
    const attendees = this.canceltabledata1.attendees
    const projectId = this.canceltabledata1.projectId
    const id = this.canceltabledata1.id
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
        this.getTableDataBySearch()
      }) // Activate after 2 sec
      console.log('createData data=======>', this.createData)
      if (this.cancelData.hasOwnProperty('cancel') === true) {
        this.notification.create(
          'success',
          'Meeting Cancelled',
          'Your Meeting has been successfully cancelled',
        )
      } else {
        this.notification.create('error', 'Failed to cancel', 'Your data is failed to cancel ')
      }
    })
    this.cancelvisible = false
  }  
}