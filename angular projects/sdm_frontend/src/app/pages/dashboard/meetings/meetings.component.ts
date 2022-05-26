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

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss'],
  providers: [DatePipe],
})
export class MeetingsComponent implements OnInit {
  // @HostListener('window:keydown', ['$event'])
  // keyboardInput(event: any) { if (event.key === 'Enter') { this.getTableDataBySearch(); } }
  searchform: FormGroup
  addEditMeetingForm: FormGroup
  status : any
  timeMiutes = [{ m: '0 minute' }, { m: '15 minutes' }, { m: '30 minutes' }, { m: '45 minutes' }]
  assignto =
  [
    { a: 'Ramya Sree Kilani', v: 'rkilani@miraclesoft.com' },
    { a: 'Mounica Rompalli', v: 'mrompalli@miraclesoft.com' },
    { a: 'Sai Praneeth Garbham', v: 'sgarbham1@miraclesoft.com' },
    { a: 'Supraja Magisetty', v: 'smagisetty@miraclesoft.com' },
  ]
  listOfOption = [
    { label: 'Sai Praneeth Garbham', value: 'sgarbham1' },
    { label: 'Ramya Sree Kilani', value: 'rkilani' },
    { label: 'Supraja Magisetty', value: 'smagisetty' },
    { label: 'Mounica Rompally', value: 'mrompalli' },
    { label: 'Prasad Lokam', value: 'plokam' },
    { label: 'Chinnari Pyla', value: 'cpyla' },
    { label: 'Sarath Setty', value: 'ssetty' },
    { label: 'Ravali Reddy', value: 'rsankaramaddi' },
    { label: 'Sameer Kenchem', value: 'akenchem' },
    { label: 'Jahnavi Chukkala', value: 'jchukkala' },
    { label: 'Chaitanya Kantu', value: 'ckantu' },
    { label: 'Poonam Gupta' , value: 'pgupta'}
  ]
  header = 'Search '
  attendees = [
    { a: 'poonam gupta', v: 'pgupta@miraclesoft.com' },
    { a: 'Ramya sree kilani', v: 'rkilani@miraclesoft.com' },
    { a: 'Sameer kencham', v: 'skencham@miraclesoft.com' },
    { a: 'sai praneeth', v: 'sgarbham1@miraclesoft.com' },
  ]

  timeZoneList = [
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
  records: any

  pName: any
  CustomerName: any
  tableData1: any
  pageNum = 1
  pageSize = 10
  projectId: any
  totalPages: any
  addEditdailogheader: string
  createvisible = false
  addBtn = false
  createData: any
  editBtn = false
  editDatares: any
  meetingId: any
  updatevisible = false
  updatebtn = false
  forwardbtn = false
  updateMeetingForm: FormGroup
  meetingId1: any
  updateDatares: any
  forwardData: any
  subject1: any
  startDate1: any
  enddate: any
  location: any
  starttime: any
  endtime: any
  conferencetype: any
  timezone: any
  constructor(
    private fb: FormBuilder,
    private dataservice: DataService,
    private modal: NzModalService,
    private datepipe: DatePipe,
    private notification: NzNotificationService,
    private route: Router,
  ) {
    this.pName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.CustomerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    // this.dataservice.get(apis.timeZoneDropDown).subscribe(res => {
    //   console.log('dropdown', res)
    //   this.timeZoneList = res
    // })
    this.dataservice.get(apis.statusDropDown).subscribe(res => {
      console.log('dropdown', res)
      this.status = res
    })
    // this.dataservice.get(apis.durationDropDown).subscribe(res => {
    //   console.log('dropdown', res)
    //   this.timeMiutes = res
    // })
  }

  ngOnInit(): void {
    this.searchform = this.fb.group({
      subject: [null],
      startDate: [null],
      organizer: [null],
      status: [null]
    })
    this.getTableDataBySearch()
    this.addEditMeetingForm = this.fb.group({
      subject: [null, [Validators.required]],
      address: [null, [Validators.required]],
      timezone: [null, [Validators.required]],
      attendees: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      conferenceType: [null, [Validators.required]],
      location: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      quantities: this.fb.array([this.newQuantity()]),
    })
    this.updateMeetingForm = this.fb.group({
      subject: [null, [Validators.required]],
      address: [null, [Validators.required]],
      timezone: [null, [Validators.required]],
      attendees: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      conferenceType: [null, [Validators.required]],
      location: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      quantities: this.fb.array([this.newQuantity()]),
      meetingminutes: this.fb.array([this.newQuantity()]),
      actionitems: this.fb.array([this.newQuantity()]),
    })
    // this.getAllResources()
  }
  //resource call 
  // getAllResources() {
  //   let reqBody = {
  //     pageNum: 1,
  //     pageSize: 10,
  //     projectId: this.projectId,
  //     resourceName:  '',
  //     resourceTitle: '',
  //     startDate: '',
  //     endDate: '',
  //     resourceType: '',
  //   }
  //   this.dataservice.post(apis.resource, reqBody).subscribe(res => {
  //     console.log(res)
  //     this.attendees = res[0].data
  //     this.records = res[0].count
  //     console.log('gridData', this.attendees)
  //   })
  // }
  //get table method
  getTableDataBySearch() {
    console.log('this.searchform', this.searchform.value)
    const subject = this.searchform.controls.subject.value
    const organizerid = this.searchform.controls.organizer.value
    const startdate = this.searchform.get('startDate').value
    const status = this.searchform.controls.status.value
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
      this.tableData1 = res[0].data
      this.totalPages = res[0].count
      this.records = res[0].count
      // console.log('table data=======>', this.tableData)
    })
  }
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
  formReset() {
    this.searchform.reset()
    this.getTableDataBySearch()
  }
  gotoHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }
  details() {
    this.route.navigate(['/dashboard/projectDetails', this.pName])
  }
  //create meeting form arrays
  quantities(): FormArray {
    return this.addEditMeetingForm.get('quantities') as FormArray
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
  addMeeting() {
    this.createvisible = true
    this.addBtn = true
    this.editBtn = false
    this.addEditdailogheader = 'Create meeting'
  }
 
  UpdateCancel() {
    this.updatevisible = false
  }
  CreateCancel() {
    this.createvisible = false
  }
  
  submitData(type) {
    const children = []
    const ateendeeData = this.addEditMeetingForm.get('attendees').value
    console.log(ateendeeData)
    ateendeeData.forEach(element => {
      children.push(
        {
          attendeeName: element + '@miraclesoft.com',
          addedDate: new Date().toISOString().substring(0, 10),
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
      prevMeetingId: 1,
      startDate: startdte === null || startdte === undefined ? '' : new Date(startdte).toISOString().substring(0, 10),
      endDate: enddte === null || enddte === undefined ? '' : new Date(enddte).toISOString().substring(0, 10),
      startTime: starttime === null || starttime === undefined ? '' : this.datepipe.transform(new Date(Date.parse(starttime)), 'hh:mm:ss'),
      endTime: endtime === null || endtime === undefined ? '' : this.datepipe.transform(new Date(Date.parse(starttime)), 'hh:mm:ss'),
      locationType: locationType === null || locationType === undefined ? '' : locationType,
      timeZone: timezone === null || timezone === undefined ? '' : timezone,
      location: location === null || location === undefined ? '' : location,
      recurrence: 'y',
      organizerType: 'o',
      organizerId: 'smagisetty@miraclesoft.com', // JSON.parse(sessionStorage.getItem('loginData')).Email1
      subject: subject === null || subject === undefined ? '' : subject,
      createdBy: JSON.parse(sessionStorage.getItem('loginData')).LoginId,
      ModifiedBy: JSON.parse(sessionStorage.getItem('loginData')).LoginId,
      agendas: agendas === null || agendas === undefined ? '' : agendas,
      attendees: children,
    }
    console.log(data)
    if(type === 'add') {
      this.dataservice.post(apis.createMeetingPost, data).subscribe((res: any) => {
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
      const data1 = {id : this.meetingId}
      const data2 = Object.assign(data, data1)
      console.log(data2)
      this.dataservice.post(apis.editMeetingPost, data2).subscribe((res: any) => {
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
    
    this.createvisible = false
  }
  edit(data, type) {
    if (type === 'copy') {
      this.addEditdailogheader = 'Copy meeting'
      this.editBtn = false
    this.addBtn = true
    } else if (type === 'edit') {
      this.addEditdailogheader = 'Edit meeting'
      this.editBtn = true
    this.addBtn = false
    this.meetingId = data.id
    }
    this.createvisible = true
    this.addEditMeetingForm.reset()
    this.quantities().controls.length = 0
    console.log('meeting data', this.timeZoneList)
    const attendArr = []
    this.listOfOption.forEach(element => {
      data.attendees.forEach(data => {
        if (data.attendeeName === element.value + '@miraclesoft.com') {
          attendArr.push(element.value)
        }
      })
    })
    console.log('attend', attendArr)
    console.log('sweet', data)
    //     console.log('edit clicked', data.startTime.split(':')[0])
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
    this.addEditMeetingForm.get('timezone').patchValue(this.timeZoneList.filter(x => x.value === data.timeZone)[0].value)
    this.addEditMeetingForm.get('conferenceType').patchValue(data.locationType)
    data.agendas.forEach(element => {
      this.editAgenda(element)
    })
  }
  editAgenda(data?: any) {
    let fg = this.fb.group({
      title: [data.title || ''],
      duration: [this.timeMiutes.filter(x => x.m === data.duration)[0]?.m],
      assignedto: [this.assignto.filter(x => x.v === data.assignedTo)[0]?.v],
      description: [data.description || ''],
    });
    (this.addEditMeetingForm.get('quantities') as FormArray).push(fg)
  }
  // edit update
  agendas(): FormArray {
    return this.updateMeetingForm.get('quantities') as FormArray
  }
  meetingMinute(): FormArray {
    return this.updateMeetingForm.get('meetingminutes') as FormArray
  }
  actionItem(): FormArray {
    return this.updateMeetingForm.get('actionitems') as FormArray
  }
  newAgenda(): FormGroup {
    return this.fb.group({
      title: [''],
      duration: [''],
      assignedto: [''],
      description: [''],
      createdby: ['sgarbham1@miraclesoft.com'],
      modifiedBy: ['smagisetty'],
    })
  }
  newMeetingMinute(): FormGroup {
    return this.fb.group({
      title: [''],
      
      speakers: [''],
      description: [''],
      createdby: ['sgarbham1@miraclesoft.com'],
      modifiedBy: ['smagisetty'],
    })
  }
  newActionItem(): FormGroup {
    return this.fb.group({
      title: [''],
      
      assignedto: [''],
      description: [''],
      createdby: ['sgarbham1@miraclesoft.com'],
      modifiedBy: ['smagisetty'],
    })
  }
  addAgenda() {
    this.agendas().push(this.newAgenda())
  }
  addMeetingMinute() {
    this.meetingMinute().push(this.newMeetingMinute())
  }
  addActionItem() {
    this.actionItem().push(this.newActionItem())
  }
  removeAgenda(i: number) {
    this.agendas().removeAt(i)
  }
  removeMeetingMinute(i: number) {
    this.meetingMinute().removeAt(i)
  }
  removeActionItem(i: number) {
    this.actionItem().removeAt(i)
  }



  update(data, type) {
    if (type === 'update') {
      this.addEditdailogheader = 'Update meeting'
      this.forwardbtn = false
      this.updatebtn = true
    this.addBtn = true
    } else if (type === 'forward') {
      this.addEditdailogheader = 'Forward meeting'
      this.updatebtn = true
      this.forwardbtn = false
    this.meetingId1 = data.id
    }
    this.updatevisible = true
    this.updateMeetingForm.reset()
    this.quantities().controls.length = 0
    console.log('meeting data', this.timeZoneList)
    const attendArr = []
    this.listOfOption.forEach(element => {
      data.attendees.forEach(data => {
        if (data.attendeeName === element.value + '@miraclesoft.com') {
          attendArr.push(element.value)
        }
      })
    })
    console.log('attend', attendArr)
    console.log('sweet', data)
    
    console.log('fodata', data)
    this.agendas().controls.length = 0
    this.meetingMinute().controls.length = 0
    this.actionItem().controls.length = 0
    this.updateMeetingForm.reset()
    
    
    this.subject1 = data.subject
    this.startDate1 = data.startDate
    this.enddate = data.endDate
    this.starttime = data.startTime
    this.location = data.location
    this.endtime = data.endTime
    this.conferencetype = data.locationType
    this.timezone = data.timeZone
    data.agendas.forEach(element => {
      this.updateAgenda(element)
    })
  }
  updateAgenda(data?: any) {
    let fg = this.fb.group({
      title: [data.title || ''],
      duration: [this.timeMiutes.filter(x => x.m === data.duration)[0]?.m],
      assignedto: [this.assignto.filter(x => x.v === data.assignedTo)[0]?.v],
      description: [data.description || ''],
    });
    (this.addEditMeetingForm.get('quantities') as FormArray).push(fg)
  }




  submitData1(data,type) {
    this.updateMeetingForm.reset()
    this.updatevisible = false
    console.log(this.updateMeetingForm.get('attendees').value)
    const attendeeData = this.updateMeetingForm.get('attendees').value
    const attendArray = []
    const attendMailArray = []
    attendeeData.forEach(element => {
      let data = {
        'attendeeName': element + '@miraclesoft.com',
        'addedDate': '2020-02-02',
        'createdBy': 'sprathi',
        'modifiedBy': 'smagisetty'
      }
      attendArray.push(data)
      attendMailArray.push(element + '@miraclesoft.com')
    })
    console.log(attendMailArray.toString(), attendArray)

   
    console.log('mouni', data)
    const subject1 = data.subject
    const startDate1 = data.startDate
    const enddate = data.endDate
    const starttime = data.startTime
    const location = data.location
    const endtime = data.endTime
    const document = data.documentIds
    const projectid = data.projectId
    const pevmeetingid = data.prevMeetingId
    const organizerid = data.organizerId
    const createdby = data.createdBy
    const locationtype = data.locationType
    const timezone = data.timeZone
    const modifiedby = data.modifiedBy
    const organizertype = data.organizerType
    const id = data.id

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
      recurrence: 'y',
      organizerType: 'o',

      locationType:data.locationType,
      timeZone: data.timeZone,
      agendas: this.updateMeetingForm.controls.quantities.value,
      attendees: attendArray,
      meetingminutes: this.updateMeetingForm.controls.meetingMinutes.value,
      actionitems: this.updateMeetingForm.controls.actionItems.value,


    }
    console.log('--->data to tableforward', data1)
    if(type === 'update') {
      this.dataservice.post(apis.updateMeetingPost, data1).subscribe((res: any) => {
        console.log(res)
        this.updateDatares = res
        setTimeout(() => {
          this.getTableDataBySearch()
        })
        // Activate after 2 sec.
        console.log('createData data=======>', this.updateDatares)
        if (this.updateDatares.hasOwnProperty('sucess') === true) {
          this.notification.create(
            'success',
            'Successfully Added',
            'Your data has been successfully added',
          )
        } else {
          this.notification.create('success', 'Your data has been successfully updated', 'Your data is updated ')
        }
      })
    } else if (type === 'forward') {
      this.dataservice.post(apis.forwardMeetingPost + attendMailArray.toString(), data1).subscribe((res: any) => {
        console.log(res)
        this.forwardData = res
        setTimeout(() => {
          this.getTableDataBySearch()
        }) // Activate after 2 sec
        // Activate after 2 sec.
        console.log('forwardData data=======>', this.forwardData)
        if (this.forwardData.hasOwnProperty('Forward') === true) {
          this.notification.create(
            'success',
            'Successfully Forward',
            'Your invite has been successfully Forwarded'
          )
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
        }
      })
    }
    
    this.updatevisible = false
  }


  
}

