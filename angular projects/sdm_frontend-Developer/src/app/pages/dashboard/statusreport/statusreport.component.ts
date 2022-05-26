import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { ActivatedRoute, Router } from '@angular/router'
import { DatePipe } from '@angular/common'
import { NzNotificationService } from 'ng-zorro-antd/notification'
interface ColumnItem {
  name: string
  width: string
  }
@Component({
  selector: 'app-statusreport',
  templateUrl: './statusreport.component.html',
  styleUrls: ['./statusreport.component.scss'],
  providers: [DatePipe],
})
export class StatusreportComponent implements OnInit {
  myForm: FormGroup
  pageNum: number
  pageSize: number
  totalPages: number
  listOfData = []
  Addpopup: boolean
  Editpopup: boolean
  sTime: Date | null = null;
  eTime: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  editForm: FormGroup
  starttime: any
  hours: any
  hrs = []
  activityTypeDropDown = []
  statusTypeDropDown = []
  endTime: any
  endtime: any
  editendtime: any
  time: any
  editstarttime: any
  selectedDate: string
  records: any
  data: any
  activityDropData = []
  statusDropData = []
  activity={
    Meeting:'Meeting',
    Course:'Course'
  }
  date: string
  addtime: any
  btnDisabled: boolean
  listOfColumns: ColumnItem[] = [
    { name: '#', width: '20px', },
    { name: 'Start Time', width: '60px', },
    { name: 'End Time', width: '60px', },
    { name: 'Date', width: '60px', },
    { name: 'Title', width: '100px', },
    { name: 'Activity Type',  width: '60px', }, 
    { name: 'Action', width: '60px', },
    ]
    deltId: any
  deleteResponse: Object
  starttimes: any
  timearray: any[]
  endtimes: any
  editValues: any
   constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
  ) { }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      sTime: [null],
      eTime: [null],
      title: [null, [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],],
      activityType: [null, [Validators.required]],
      sType: [null, [Validators.required]],
      description: [null, [Validators.maxLength(255)]],
      times: this.fb.array([this.initTimes()]),
    })
    console.log(this.myForm.value);
    this.editForm = this.fb.group({
      sTime: [null],
      eTime: [null],
      title: [null, [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],],
      activityType: [null, [Validators.required]],
      sType: [null, [Validators.required]],
      description: [null, [Validators.maxLength(255)]],
    })
    this.pageNum = 1
    this.pageSize = 10
    this.totalPages = 20
    // <------Activity type drop down service------->
    this.dataService.get(apis.activityDropdown).subscribe((res: any) => {
      this.activityTypeDropDown = res
      this.activityTypeDropDown.forEach(x=>{
        this.activity[x.Value]=x.Label
        })     
    console.log('statusTypeDropDown', this.activityTypeDropDown, this.activity)
      console.log('activityTypeDropDown', this.activityTypeDropDown)
    })
        // <------Status type drop down service------->
    this.dataService.get(apis.statusTypeDropdown).subscribe((res: any) => {
      this.statusTypeDropDown = res
      console.log('statusTypeDropDown', this.statusTypeDropDown)
    })
 this.date=JSON.parse(sessionStorage.getItem('statusReportDate'))
 console.log("date12", this.date)
 this.deltId=JSON.parse(sessionStorage.getItem('id'))
 console.log("idddddddd", this.deltId)
    this.getAllData();
  }
  activityDropDown1(event, i) {
    this.activityDropData[i] = event
  }
  statusDropDown1(event, i) {
    this.statusDropData[i] = event
  }
  day: Date = new Date();
    // <------Table Get Data------->
  getAllData() {
    const data = {
      loginId: JSON.parse(sessionStorage.getItem('loginData')).Email1,
      searchDate:this.date,
      statusRepId:this.deltId,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
    console.log('-----------', data)
    this.dataService.post(apis.statustracker, data).subscribe((res: any) => {
      console.log('-----------', res)
      this.listOfData = res[0].data
      this.timearray= this.listOfData
      console.log('timearray', this.timearray)
      this.records = res[0].count
      this.totalPages = res[0].count
    })
  }
    // <------Pagination------->
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.pageNum = 1
    this.getAllData()
  }
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllData()
  }
  // <------All projects routing------->
  dashboard() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  statustracker(){
    this.router.navigate(['/dashboard/statustracker'])
  }
   // <------Delete Table data------->
   deleteRow(Id: number): void {
    const body = {
       id: Id,
    }
    console.log('delete body', Id, body)
    this.dataService.post(apis.statusreportDelete, body).subscribe(res => {
      console.log('delete statu tracker', res)
      this.deleteResponse = res
      if (this.deleteResponse.hasOwnProperty('Result') === true) {
        this.notification.create(
          'success',
          'Successfully Deleted',
          'Your data has been successfully deleted',
        )
      } else {
        this.notification.create('error', 'Failed to delete', 'Data is not deleted ')
      }
      this.getAllData()
    })
    this.listOfData = this.listOfData.filter(d => d.id !== Id)
  } // <------Add Popup method------->
  addRow(): void {
    this.Addpopup = true
   }
  Save() {
    console.log('Button ok clicked!');
    this.btnDisabled = true;
    if (this.myForm.untouched) {
      this.Addpopup = true
    }
    const formData = this.myForm.value.times
    console.log("foerms data with paths", formData)
    const reqBody = []
    formData.forEach((element) => {
    console.log("foerms data with paths", element.sTime)
    console.log("foerms data with paths", element.eTime)
    const starttime = element.sTime
    const endtime = element.eTime
    let data = {
        emailId: JSON.parse(sessionStorage.getItem('loginData')).Email1,
        createdDate: this.day,
        createdBy: JSON.parse(sessionStorage.getItem('loginData')).LoginId,
        activityType:
          element.activityType === undefined || element.activityType === null
            ? ''
            : element.activityType,
        title: element.title === undefined || element.title === null
          ? ''
          : element.title,
          startDate:this.date,
          endDate:this.date,
        description:
          element.description === undefined || element.description === null
            ? ''
            : element.description,
        statusType:
          element.sType === undefined || element.sType === null ? '' : element.sType,
          statusRepId:this.deltId,
        startTime: element.sTime === undefined || element.sTime === null ? ''
          : this.datePipe.transform(new Date(Date.parse(starttime)), 'HH:mm:00'),
         endTime: element.eTime === undefined || element.eTime === null ? ''
          : this.datePipe.transform(new Date(Date.parse(endtime)), 'HH:mm:00'),
        loginId: JSON.parse(sessionStorage.getItem('loginData')).LoginId
      }
      reqBody.push(data)
    })
    console.log('--->data to table', reqBody)
    this.dataService.postStatus(apis.statusAdd, reqBody).subscribe((res: any) => {
    setTimeout(() => {
    this.btnDisabled = false
    },5000);
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
      } else {
        this.notification.create('error', 'Failed to insert', 'Your data is failed to add')
      }
      this.Addpopup = false
      this.getAllData()
    })
}
   // <------Add Popup cancel method------->
  Cancel() {
    this.Addpopup = false
    this.myForm.reset();
let formArray = this.myForm.get("times") as FormArray
console.log("add form array length",formArray.length)
for( let i= formArray.length ; i>0;i--)
{
  console.log("add form array length",formArray.controls)
  formArray.removeAt(i)
}
  }
  // <------Add multiple Task method------->
  addGroup() {
    console.log("add form array")
    const control = <FormArray>this.myForm.controls['times']
    control.push(this.initTimes())
    this.addtime = this.myForm.controls.times.value;
     }
   // <------Remove Multiple task method ------->
  removeGroup(i: number) {
    console.log("remove form array")
    const control = <FormArray>this.myForm.controls['times']
    control.removeAt(i)
  }
   // <------Form Array------->
  trackByFn(index: number, item: any) {
    return item.trackingId
  }
  initTimes() {
    return this.fb.group({
      sTime: [null],
      eTime: [null],
      title: [null, [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z ]*$')],],
      activityType: [null, [Validators.required]],
      sType:[null, [Validators.required]],
      description: [null, [Validators.maxLength(255)]],
    })
  }
   // <------Edit cancel------->
  Editcancel() {
    console.log('Button cancel clicked!')
    this.Editpopup = false;
    this.editForm.reset()
  }
     // <------Edit patch------->
  Editreport(values): void {
    this.Editpopup = true;
    console.log('editttt',values)
    this.editValues = values
    console.log('editttt', values.startTime)
    console.log('end time', values.endTime)
    console.log('editttt', values.endTime.split(':')[0])
    console.log('editttt',values.endTime.split(':')[1])
    let min = values.endTime.split(':')[1];
    console.log(min.split(' ')[0]);
    console.log('editttt', values.startTime.split(':')[0])
    console.log('editttt',values.startTime.split(':')[1])
    let mins = values.startTime.split(':')[1];
    console.log(mins.split(' ')[0]);
    const datee = new Date()
    datee.setHours(values.startTime.split(':')[0]);
    datee.setMinutes(mins.split(' ')[0]);
    console.log(datee);
    const enddatee = new Date()
    enddatee.setHours(values.endTime.split(':')[0]);
    enddatee.setMinutes(min.split(' ')[0]);
    console.log(enddatee);
    this.editForm.get('sTime').patchValue(datee)
    this.editForm.get('eTime').patchValue(enddatee)
    this.editForm.get('title').patchValue(values.Title)
    this.editForm.get('activityType').patchValue(values.ActivityType)
    this.editForm.get('sType').patchValue(values.StatusType)
    this.editForm.get('description').patchValue(values.description)
   }
      // <------Edit save method------->
  EditSave(): void {
    const editstarttime = this.editForm.controls.sTime.value
    const editendtime = this.editForm.controls.eTime.value
    this.Editpopup = true
    const starttime = this.datePipe.transform(new Date(Date.parse(editstarttime)), 'HH:mm:00')
    const endtime = this.datePipe.transform(new Date(Date.parse(editendtime)), 'HH:mm:00')
    let updated = {
      searchDate:this.date,
      title: this.editForm.value.title,
      description: this.editForm.value.description,
      statusType: this.editForm.value.sType,
      startTime: starttime,
      endTime: endtime,
      modifiedBy: JSON.parse(sessionStorage.getItem('loginData')).LoginId,
      activityType: this.editForm.value.activityType,
      id: this.editValues.Id,
    }
    console.log('--->data to table', updated)
    this.dataService.updateStatus(apis.statusEdit, updated).subscribe((res: any) => {
      this.data = res
      console.log('Successfully Updated', this.data)
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update')
      }
    })  
    this.getAllData()
    this.Editpopup = false
  }
   // <------Time validation------->
   count = 0
  onSelectTime(date,index): void {
    this.count = this.count +1 
    console.log("----------------------------------------------",this.count)
    console.log("date", date)
    const time: any[][] = this.myForm.controls.times.value;
    console.log("time", time,this.myForm.controls.times.value)
    const dataa=this.myForm.controls.times.value
    console.log("times array --------",dataa)
    let currentData = {}
   if(dataa.length>=1){
    dataa.forEach((x,i)=>{
      if(i == index){
      currentData = x
      console.log("currenst",currentData,dataa[1],i,x[i],index)
      }
    })
    this.starttimes =currentData['sTime']  
    this.endtimes = currentData['eTime']
    console.log("start and end time",this.starttimes,this.endtimes)
    let starthrs
    let endhrs
    let startmins
    let endmins
    if(this.starttimes!=null){
      starthrs = this.starttimes.getHours()
      startmins =this.starttimes.getMinutes()
    }
    if(this.endtimes!=null){
      endhrs = this.endtimes.getHours()
      endmins = this.endtimes.getMinutes()
    }
     if( this.count ==3 ){
    this.listOfData.forEach(x=>{
      const st = x.startTime.split(':')
      const et = x.endTime.split(':')
      if(parseInt(st[0])==starthrs && (parseInt(st[1])>=0 && parseInt(st[1])<=startmins) 
      || parseInt(et[0])==endhrs && (parseInt(et[1])>=0 && parseInt(et[1])<=endmins)){
        this.notification.create('error', 'A report already exists for this time', 'Cannot add report')
        }
      this.count=0
  })
}
  }
}
}