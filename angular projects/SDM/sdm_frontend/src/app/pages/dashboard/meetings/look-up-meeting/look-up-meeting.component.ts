import { Component, OnInit } from '@angular/core'
import { apis } from 'src/app/api'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { DataService } from 'src/app/data.service'
import { NzModalService } from 'ng-zorro-antd/modal'
import { Validators } from '@angular/forms'
import { DatePipe } from '@angular/common'
import { HostListener } from '@angular/core'
import { NzNotificationService } from 'ng-zorro-antd'
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
interface DataItem {
  subject: string;
  date: string;
  starttime: string;
  duration: string;
  organizer:string;
  status:string;
  action:string;
}

interface ColumnItem {
  title: string;
  sortOrder?: NzTableSortOrder;
  sortFn?: NzTableSortFn;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn;
  filterMultiple?: boolean;
  sortDirections?: NzTableSortOrder[];
}
@Component({
  selector: 'app-look-up-meeting',
  templateUrl: './look-up-meeting.component.html',
  styleUrls: ['./look-up-meeting.component.scss'],
  providers: [DatePipe],
})

export class LookUpMeetingComponent implements OnInit {
  searchform: FormGroup
  startDate: string
  perdata: any
  projectId: any

  
@HostListener('window:keydown', ['$event'])
keyboardInput(event: any) { if (event.key === 'Enter') { this.getTableData(); } }



  tableData = [
    { subject: '2020PDM', date: '08-22-2020', time: '2hr', duration: '2hr', organizer: 'plokam' },
  ]
  tableData1 = [{ pName: 'Scoop Text', cName: 'Internal', pDuration: '60 Days', status: 'Active' }]
  optionList1 = [
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Completed' },
    { label: 'InActive', value: 'InActive' },
  ]
  createvisible = false
  recurvisible = false
  status = [{ type: 'success', content: 'Completed' }]
  optionList = [
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' },
    { label: 'Completed', value: 'Completed' },
  ]
  timeMiutes = [{ m: '0 minute' }, { m: '15 minutes' }, { m: '30 minutes' }, { m: '45 minutes' }]
  attendees = [
    { a: 'ramya',v:'rkilani@miraclesoft.com' },
    { a: 'mounica',v:'mrompalli@miraclesoft.com'  },
    { a: 'praneeth',v:'sgarbham1@miraclesoft.com' },
    { a: 'supraja',v:'smagisetty@miraclesoft.com'  },
    
  ]
  pageNum:number
 pageSize:number
 noOfRecords:number
 totalPages:number

  header = 'My Meetings'
  listOfColumn:  ColumnItem[]= [
    {
      title: 'SUBJECT',
      sortOrder: 'ascend',
      sortFn: (a: DataItem, b: DataItem) => a.subject.localeCompare(b.subject),
      filterMultiple: true,
    
      filterFn: (list: string[], item: DataItem) => list.some(subject => item.subject.indexOf(subject) !== -1)
      
    },
    {
      title: 'DATE',
      
      sortOrder: 'ascend',
      sortFn: (a: DataItem, b: DataItem) => a.subject.localeCompare(b.subject),
      filterMultiple: true,
    
      filterFn: (list: string[], item: DataItem) => list.some(subject => item.subject.indexOf(subject) !== -1)
      
      
    },
    {
      title: 'START TIME',
      sortOrder: 'ascend',
      sortFn: (a: DataItem, b: DataItem) => a.subject.localeCompare(b.subject),
      filterMultiple: true,
     
      filterFn: (list: string[], item: DataItem) => list.some(subject => item.subject.indexOf(subject) !== -1)
      
      
    },
    {
      title: 'DURATION',
      sortOrder: 'ascend',
      sortFn: (a: DataItem, b: DataItem) => a.subject.localeCompare(b.subject),
      filterMultiple: true,
      
      filterFn: (list: string[], item: DataItem) => list.some(subject => item.subject.indexOf(subject) !== -1)
      
    },
    {
      title: 'ORGANIZER',
      
      sortOrder: 'ascend',
      sortFn: (a: DataItem, b: DataItem) => a.subject.localeCompare(b.subject),
      filterMultiple: true,
    
      filterFn: (list: string[], item: DataItem) => list.some(subject => item.subject.indexOf(subject) !== -1)
      
    },
    {
      title: 'STATUS',
      
      sortOrder: 'ascend',
      sortFn: (a: DataItem, b: DataItem) => a.subject.localeCompare(b.subject),
      filterMultiple: true,
    
      filterFn: (list: string[], item: DataItem) => list.some(subject => item.subject.indexOf(subject) !== -1)
      
      
    },
    {
      title: 'ACTION',
      
    }
  ];
  
  repeat = [
    { label: 'Never', value: 'Never' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' },
  ]

  optionList5 = [
    { label: 'Atlantic Time (AT)', value: 'AT' },
    { label: 'Alaska Standard Time(AST)', value: 'AST' },
    { label: 'Brazil Eastern Time (BET)', value: 'BET' },
    { label: 'Pacific Standard Time (PST)', value: 'PST' },
    { label: 'Eastern Standard Time (EST)', value: 'EST' },
    { label: 'Eastern European Time (EET)' , value: 'EET'},
    { label: 'European Central Time (ECT)' , value: 'ECT'},
     { label: 'India Standard Time (IST)' , value: 'IST'},
    { label: 'Newzealand Standard Time (NST)' , value: 'NST'},
    { label: 'Central Standard Time (CST)' , value: 'CST'},
    { label: 'Mountain Standard Time (MST)' , value: 'MST'}

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
  constructor(
    private fb: FormBuilder,
    private dataservice: DataService,
    private modal: NzModalService,
    private datepipe: DatePipe,
    private notification: NzNotificationService,
  ) {}

  ngOnInit(): void {
    this.lookupform = this.fb.group({
      organizer: [null],
      date: [null],
      subject: [null],
      status: [null],
    })
    this.recurform = this.fb.group({
      startDate: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      repeat: [null, [Validators.required]],
      week: [null],
      checkmonday: [null],
      repeatevery: [null],
      repeaton: [null],
      date: [null],
      end: [null],
    })
    this.createMeetingForm = this.fb.group({
      subject: [null, [Validators.required]],
      address: [null, [Validators.required]],
      selectedTimeZone: [null, [Validators.required]],
      attendees: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      startDate1: new Date(),
      endDate: [null, [Validators.required]],
      endDate1: new Date(),
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
      startDate1: new Date(),
      endDate: [null, [Validators.required]],
      endDate1: new Date(),
      conferenceType: [null, [Validators.required]],
      location: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      timezone :[null,[Validators.required]],
      endTime: [null, [Validators.required]],
      quantities: this.fb.array([this.newQuantity()]),
    })

    this.forwardMeetingForm = this.fb.group({
      subject: [null, [Validators.required]],
      location: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      attendees: [null, [Validators.required]],
      organizer: [null, [Validators.required]],
      prevMeeting: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      timezone: [null, [Validators.required]],
      quantities: this.fb.array([this.newQuantity()]),
      actionitems: this.fb.array([this.newActionItem()]),
      meetingminutes: this.fb.array([this.newMeetingMinute()]),
    })
    
this.searchform = this.fb.group({
  subject:[null],
  startDate:[null],
  organizer:[null],
  status:[null],
  

})

this.pageSize=5;
    this.pageNum=1;
    this.totalPages=10;

    this.getTableData();

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
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.ProjectName = sessionStorage.getItem('pName')
  }
  //pagenation methods
   onCurrentPageDataChange(data) {
  this.pageNum=data;
  this.getTableData();
  
}
onPageSizeChange(data){
  console.log("page size change",data)
  this.pageSize=data;
  this.getTableData();
  
}

onChange():void
{
 this.getTableData();
}



resetSearchFields(){
this.searchform.reset()
this.getTableData();
}

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

  meetingMinutes(): FormArray {
    return this.forwardMeetingForm.get('meetingminutes') as FormArray
  }
  newMeetingMinute(): FormGroup {
    return this.fb.group({
      title: [''],
      assignedto:[''],
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
  CreateCancel() {
    this.createvisible = false
    this.createMeetingForm.reset()
  }
  getTableData() {
    
    console.log("this.searchform",this.searchform.value)
    if(this.searchform.controls.startDate.value)
    {
      this.startDate = new Date(this.searchform.get('startDate').value).toISOString().substring(0,10)
      
    }
   
 
    const data1 = {
      subject:this.searchform.controls.subject.value,
      organizerId:this.searchform.controls.subject.value,
      startDate:this.startDate,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      projectId:this.projectId 
    }
    console.log()
    this.dataservice.post(apis.getMeeting,data1).subscribe((res: any) => {
      console.log(res)
      this.tableData = res[0].data

      console.log('table data=======>', this.tableData)
    })
  }


  addMeeting() {
    this.createvisible = true
  }
  addRow() {
    console.log('add clicked')
  }
  deleteRow() {
    console.log('add clicked')
  }
  edit(data) {
    this.perdata= data;
    console.log("sweet",this.perdata)
    console.log('edit clicked')
    this.editvisible = true
    this.editMeetingForm.controls.subject.patchValue(data.subject)
    this.editMeetingForm.controls.startDate.patchValue(data.startDate)
    this.editMeetingForm.controls.startTime.patchValue(data.startTime)

    this.editMeetingForm.get('location').patchValue(data.location)
    //this.editMeetingForm.get('endTime').patchValue(data.endTime)
    // this.endTime = data.endTime.toISOString();
    console.log('ENDTIME', data.endTime)
    this.editMeetingForm.get('startDate').patchValue(data.startDate)
    this.editMeetingForm.get('endDate').patchValue(data.endDate)
   
    this.editMeetingForm.get('timezone').patchValue(this.optionList5.filter( x => x.value === data.timeZone)[0])
    this.editMeetingForm.get('conferenceType').patchValue(data.conferenceType)
  }
  editData()
{
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

  console.log("tagvalue",this.tagValue[0],this.tagValue.length)
    const children: Array<{ attendeeName: string; addedDate: string, createdBy: string, modifiedBy: string }> = [];
    for(let i=0;i<this.tagValue.length;i++)
    {
      console.log("in for loop", this.tagValue[i]);
      children.push(
        {
          attendeeName: this.tagValue[i]+'@miraclesoft.com',
          addedDate: '2020-02-02',
          createdBy: 'sprathi@miraclesoft.com',
          modifiedBy: 'smagisetty',
        });
    
      this.dummyArray = children

    }
    console.log('dummy array =========>',this.dummyArray)


 console.log("gfjhgdshdygkjysiuy",this.perdata);  
 const data = {
       id : this.perdata.id,
      projectId : this.perdata.projectId,
      documentIds : this.perdata.documentIds ,
      prevMeetingId:this.perdata.prevMeetingId,
      startDate : this.editMeetingForm.get('startDate').value,
      endDate : this.editMeetingForm.get('endDate').value,
      startTime : this.startTime,
      endTime : this.endTime,
      locationType : this.perdata.locationType,
      //timeZone : this.editMeetingForm.get('timezone').value.value,

      timeZone : this.editMeetingForm.controls.timezone.value,
      
      location : this.editMeetingForm.get('location').value,
      recurrence : this.perdata.recurrence,
      organizerType : this.perdata.organizerType,
      organizerId:this.perdata.organizerId,
      subject : this.editMeetingForm.get('subject').value,
      createdBy : this.perdata.createdBy,
      ModifiedBy : 'smagisetty',
           
       agendas : this.editMeetingForm.controls.quantities.value,

       
    
      attendees : 
      this.dummyArray

      }
      console.log("time", this.editMeetingForm.get('timezone').value.value);
      console.log("jhjghfghfghfgh",data);

      this.dataservice.post(apis.updateMeetingPost, data).subscribe((res: any) => {
        console.log(res)
        this.createData = res
        setTimeout(() => {
          this.getTableData();
        },)
        // Activate after 2 sec.
        console.log('createData data=======>', this.createData)
        if (this.createData.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Added',
            'Your data has been successfully added',
          )
        } else {
          this.notification.create('success', 'Your data has been successfully updated', 'Your data is updated ')
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
    
    console.log("tagvalue",this.tagValue[0],this.tagValue.length)
    const children: Array<{ attendeeName: string; addedDate: string, createdBy: string, modifiedBy: string }> = [];
    for(let i=0;i<this.tagValue.length;i++)
    {
      console.log("in for loop", this.tagValue[i]);
      children.push(
        {
          attendeeName: this.tagValue[i]+'@miraclesoft.com',
          addedDate: '2020-02-02',
          createdBy: 'sprathi@miraclesoft.com',
          modifiedBy: 'smagisetty',
        });
    
      this.dummyArray = children

    }
    console.log('dummy array =========>',this.dummyArray)
    if (this.createMeetingForm.controls.startDate.value) {
      const startdte = this.createMeetingForm.controls.startDate.value
      const availablDt = new Date(Date.parse(startdte))
      this.startDate1 = this.datepipe.transform(availablDt, 'yyyy-MM-dd')
    }
    if (this.createMeetingForm.controls.endDate.value) {
      const enddte = this.createMeetingForm.controls.endDate.value
      const endDt = new Date(Date.parse(enddte))
      this.endDate = this.datepipe.transform(endDt, 'yyyy-MM-dd')
    }
    if (this.createMeetingForm.controls.startTime.value) {
      const starttime = this.createMeetingForm.controls.startDate.value
      const availablti = new Date(Date.parse(starttime))
      this.startTime = this.datepipe.transform(availablti, 'hh:mm:ss')
    }
    if (this.createMeetingForm.controls.endTime.value) {
      const starttime = this.createMeetingForm.controls.startDate.value
      const availablti = new Date(Date.parse(starttime))
      this.endTime = this.datepipe.transform(availablti, 'hh:mm:ss')
    }
    const data = {
      projectId: 1,
      documentIds: 's',
      prevMeetingId: 1,
      startDate: this.startDate1,
      endDate: this.endDate,
      startTime: this.startTime,
      endTime: this.endTime,
      locationType: this.createMeetingForm.controls.conferenceType.value,
      timeZone: this.createMeetingForm.controls.selectedTimeZone.value,
      location: this.createMeetingForm.controls.location.value,
      recurrence: 'y',
      organizerType: 'o',
      organizerId: 'smagisetty@miraclesoft.com',
      subject: this.createMeetingForm.controls.subject.value,
      createdBy: 'smagisetty',
      ModifiedBy: 'smagisetty',
      agendas: this.createMeetingForm.controls.quantities.value,
      attendees: this.dummyArray,
    }
    console.log('--->data to table', data)
    this.dataservice.post(apis.createMeetingPost, data).subscribe((res: any) => {
      console.log(res)
      this.createData = res
      setTimeout(() => {
        this.getTableData();
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
  EditOk() {
    this.editvisible = false
  }
  copy(data) {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to copy this meeting?</i>',
      nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => this.CopyOk(),
    })
  }
  CopyCancel() {
    this.copyvisible = false
  }
  CopyOk() {
    this.copyvisible = false
  }
  forward(data) {
    this.forwardvisible = true
    console.log('data', data)
    this.forwardMeetingForm.get('subject').patchValue(data.subject)
    this.forwardMeetingForm.get('organizer').patchValue(data.organizerId)
    this.forwardMeetingForm.get('location').patchValue(data.location)
    this.forwardMeetingForm.get('startTime').patchValue(data.startTime)
    this.forwardMeetingForm.get(' startDate').patchValue(data.startDate)
    this.forwardMeetingForm.get('prevMeeting').patchValue(data.prevMeetingId)
    this.forwardMeetingForm.get('endTime').patchValue(data.prevMeetingId)
    this.forwardMeetingForm.get('endDate').patchValue(data.prevMeetingId)
  }
  ForwardCancel() {
    this.forwardvisible = false
  }
  ForwardOk() {
    this.forwardvisible = false
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
      nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => this.CancelOk(),
    })
  }
  Cancelcancel() {
    this.cancelvisible = false
  }
  CancelOk() {
    this.cancelvisible = false
  }
  RecurOk() {
    this.recurvisible = false
    this.createvisible = true
  }
  RecurCancel() {
    this.recurvisible = false
    this.createvisible = true
  }
  Allday() {
    console.log('allday entered')
    if (this.All === true) {
      this.allday = true
    } else {
      this.allday = false
    }
  }
  repeatDropDown($event) {
    if ($event === 'Never') {
      this.repeatevery = false
      this.repeaton = false
      this.end = false
    } else if ($event === 'Daily') {
      this.repeatevery = true
    } else if ($event === 'Weekly') {
      this.repeatevery = false
      this.weekly = true
    } else if ($event === 'Monthly') {
    }
  }
}
