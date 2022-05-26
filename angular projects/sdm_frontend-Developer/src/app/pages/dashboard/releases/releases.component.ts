import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'    
import { Router } from '@angular/router'
import { apis } from 'src/app/api'
import { DataService } from './../../../data.service'
import { HostListener } from '@angular/core'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { DatePipe } from '@angular/common'
import { NzNotificationService } from 'ng-zorro-antd/notification'
interface ColumnItem {
  name: string
  width: string
}
@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss'],
  providers: [DatePipe],
})
export class ReleasesComponent implements OnInit {
  allResoursesDetails: any
 addVisible = false
 editVisible = false
 header = 'Search'
 addReleaseForm: FormGroup
 editReleaseForm: FormGroup
 searchForm: FormGroup
 tasksListVisible:boolean
 pageNum: number
 pageSize: number
 totalPages: number
 idToBeEdited: number
 status: any
 CreateBy: any
 ModifiedDate: any
 ModifiedBy: any
 StartTaskId: any
 Version: any
 ReleaseTag: any
 Id: any
 ReleaseStart: any
 EndTaskId: any
 sVersion: any
 sStatus: any
 sDate: string
 records: any
 ProjectName: string
 SeqNo: any
 size = 'default'
 selectedProjectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
 projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
 userName = JSON.parse(sessionStorage.getItem('loginData')).FName
 loginId = JSON.parse(sessionStorage.getItem('loginData')).LoginId

disabledStartDate: (current: Date) => boolean
startValue: Date
disabledEndDate: (current: Date) => boolean
disabledStartDateedit: (current: Date) => boolean
disabledEndDateedit: (current: Date) => boolean
newstartdate: Date
 customerName: any
 listOfTasks :any
  rstartdate: string
  rEndDate: string
  releaseTasks: any
  pendcount: any
  Totlcount: any
  completeCount: any
  releaseTaskId: number
  listOfResources: any=[]
  editAssignedTasks=[]
  releaseStartDate: string
  releaseEndDate: string

 getColor(status) {  // applied colors for status dropdown
 switch (status) {
 case 'InProgress':
 return '#00aae7'
 case 'Unreleased':
 return '#f58142'
 case 'Released':
 return '#00ff2f'
 }
 }
 @HostListener('window:keydown', ['$event'])
 keyboardInput(event: any) {
 if (event.key === 'Enter') {
 this.getAllRelease()
 }
 }
 listOfColumns: ColumnItem[] = [           
  {
    name: '#',
    width: '25px',
  },
  {
    name: 'Version',
    width: '65px',
  },
  {
    name: 'Description',
    width: '120px',
  },
  {
    name: 'Status',
    width: '82px',
  },
  {
    name: 'Release Start Date',
    width: '120px',
  },
  {
    name: 'Release End Date',
    width: '110px',
  },
  {
    name: 'Actual Release Date',
    width: '120px',
  },
  {
    name: 'No.Of Tasks',
    width: '90px',
  },
  {
    name: 'Action',
    width: '60px',
  },
]

 constructor(
 private fb: FormBuilder,
 private datePipe: DatePipe,
 private notification: NzNotificationService,
 private route: Router,
 private dataService: DataService,
 ) {}

 ngOnInit(): void {
  this.disabledStartDate = (current: Date): boolean => {      // to disable previous values in start date
    return differenceInCalendarDays(current, new Date()) < 0
  }
  this.disabledStartDateedit = (current: Date): boolean => {    // to disable end date based on start date
    return differenceInCalendarDays(current, this.newstartdate) < 0
  }

 this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
 this.customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName

 this.editReleaseForm = this.fb.group({
 version: [
 null,
 [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]{1,10}$')],
 ],
 startDate: [''],
 releaseDate: [''],
 status: ['', Validators.maxLength(36)],
 description: ['', Validators.maxLength(255)],
 taskName: [],
 })
 this.addReleaseForm = this.fb.group({
 version: [
 '',
 [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]{1,10}$')],
 ],
 startDate: [''],
 endDate: [''],
 status: ['',[, Validators.maxLength(36)]],
 taskName: [],
 description: ['',[, Validators.maxLength(255)]],
 })
 this.searchForm = this.fb.group({
 sVersion: [null],
 sDate: [null],
 sEDate: [null],
 sStatus: [null],
 })
 this.pageSize = 5
 this.pageNum = 1
this. getAllTasks()
 this.getAllRelease()
 this.statusDropDown()
 }

 getAllTasks() {          // asssigned tasks drop down
  const children: Array<{ label: string; value: string }> = []
  this.dataService.getIssuesById(apis.getListOfTasks,this.projectId).subscribe((res: any) => {
    this.listOfResources = res
    console.log("assigned tasks dropdown values",  this.listOfResources)  
  })
  }
 statusDropDown(){             // status drop down
 this.dataService.get(apis.status1).subscribe((res)=>{
 this.status=res;
 console.log("status drop down", this.status)
 })
 }
 resetSearch() {              // to reset search fields
  this.searchForm.reset() 
  this.getAllRelease()
  }

  onStartChange(date: Date): void {  // date validation
    this.startValue = date
    this.disabledEndDate = (current: Date): boolean => {
      return differenceInCalendarDays(current, new Date(this.startValue)) < 0
    }
  }

 ////   search and get table data ////
 getAllRelease() {
  if (this.searchForm.get('sDate').value) {
    this.releaseStartDate = new Date(this.searchForm.get('sDate').value)
      .toISOString()
      .substring(0, 10)
  }
  if (this.searchForm.get('sEDate').value) {
    this.releaseEndDate = new Date(this.searchForm.get('sEDate').value)
      .toISOString()
      .substring(0, 10)
  }
  const version = this.searchForm.controls.sVersion.value
  const status = this.searchForm.controls.sStatus.value

  let reqBody = {
  pageNum: this.pageNum,
  pageSize: this.pageSize,
  releaseStartDate:
  this.releaseStartDate === null || this.releaseStartDate === undefined ? '' : this.releaseStartDate,
  releaseEndDate: this.releaseEndDate === null || this.releaseEndDate === undefined ? '' : this.releaseEndDate,
  version: version === null || version === undefined ? '' : version,
  status: status === null || status === undefined ? '' : status,
  projectId : this.selectedProjectId
  }
  this.dataService.post(apis.getAllReleases, reqBody).subscribe(res => {
  console.log(res)
  this.allResoursesDetails = res[0].data
  this.records = res[0].count
  this.totalPages=this.records
  console.log('gridData', this.allResoursesDetails)
  })
  }
  
  onCurrentPageDataChange(data) {      //pagination
  this.pageNum = data
  this.getAllRelease()
  }
  onPageSizeChange(data) {
  this.pageSize = data
  this.getAllRelease()
  }
  
 deleteRow(id): void {                  // to delete releases
 let dId = { 
 id: id,
 }
 this.dataService.post(apis.deleteReleases, dId).subscribe(res => {
  this.allResoursesDetails.length === 1 ? this.pageNum = this.pageNum -1 : this.pageNum
  this.getAllRelease()
 if (res.hasOwnProperty('success') === true) {
 this.notification.create('error', 'Not Deleted', 'Record deleted')
 } else {
 this.notification.create('success','Successfully Deleted','Your data is Deleted Successfully',
 )
 }
 this.getAllRelease()
 })
 }
 addRow(): void {           //  to open add pop up
 this.addVisible = true
 this.addReleaseForm.reset()
 this.addReleaseForm.get('startDate').patchValue(new Date())
 }

 saveRelease() {              // add releases to table
 this.rstartdate = this.datePipe.transform(this.addReleaseForm.get('startDate').value,'yyyy-MM-dd')
 this.rEndDate = this.datePipe.transform(this.addReleaseForm.get('endDate').value,'yyyy-MM-dd')
if (this.addReleaseForm.untouched) {
    this.addVisible=true
    this.submitAdd()
  }
  if(this.addReleaseForm.valid){
 this.SeqNo = 7
 this.StartTaskId = 7
 this.Version = 1
 this.ReleaseTag = 'done'
 this.Id = 1
 this.EndTaskId = 8
 const assignTask = this.addReleaseForm.controls.taskName.value
 console.log("assign task",assignTask)
 let postReleases = {
 status: this.addReleaseForm.controls.status.value,
 seqNo: this.SeqNo,
 description: this.addReleaseForm.controls.description.value,
 projectId: this.selectedProjectId,
 createdBy: this.userName,
 modifiedBy: '',
 associatedTask: assignTask === null ? '': this.addReleaseForm.controls.taskName.value.join(),
 startTaskId: this.StartTaskId,
 version: this.addReleaseForm.controls.version.value,
 releaseEndDate:  this.rEndDate,
 releaseTag: this.ReleaseTag,
 releaseStartDate: this.rstartdate,
 endTaskId: this.EndTaskId,
 }
 console.log(postReleases);
 this.dataService.post(apis.postReleases, postReleases).subscribe(res => {
   console.log("add response", res);
   if (res.hasOwnProperty('success') === true) {
    this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
  } else {
    this.notification.create('error', 'Failed to add ', 'Your data is failed to add')
  }
 this.getAllRelease()
 })
 this.addVisible = false
 this.addReleaseForm.reset()
 this.getAllRelease()
 }
 }
 submitAdd(){                // to  restrict form based on validation
  for (const i in this.addReleaseForm.controls) {
        this.addReleaseForm.controls[i].markAsTouched()
        this.addReleaseForm.controls[i].updateValueAndValidity()
      }
 }
 editRow(values): void {   
  this.newstartdate = new Date(values.ReleaseStartDate)   // patching values in edit pop up
   console.log(values);
   this.CreateBy=values.CreatedBy
   this.idToBeEdited = values.Id
   console.log(this.idToBeEdited,"id value edit popup");
    this.editVisible = true
   this.editAssignedTasks = [];
   if (values['AssociatedTask'] != null) {
   const assignto = values['AssociatedTask'].split(',')
   console.log("assigned tasks values", assignto)
   console.log("editAssignedTasks",this.listOfResources); 
   for (let i = 0; i < this.listOfResources.length; i++) {
   for (let j = 0; j < assignto.length; j++) {
   if (this.listOfResources[i].Id === Number(assignto[j])) {
   this.editAssignedTasks.push(this.listOfResources[i].Id);
   }
   }
   }
   console.log(this.editAssignedTasks)
  }
   else {
   this.editAssignedTasks = [ ]
   }
   console.log("editAssignedTasks value", this.editAssignedTasks)  
 this.editReleaseForm.get('version').patchValue(values.Version)
 this.editReleaseForm.get('startDate').patchValue(values.ReleaseStartDate)
 this.editReleaseForm.get('releaseDate').patchValue(values.ReleaseEndDate)
 this.editReleaseForm .get('status').patchValue(values.Status === null ||
   values.Status === "" || values.Status === undefined ? null : 
   this.status.filter(x => x.Value === values.Status)[0].Value)
 this.editReleaseForm.get('description').patchValue(values.Description)
if(this.editAssignedTasks.length === 0 ){
}
else{
  this.editReleaseForm.get('taskName').patchValue(this.editAssignedTasks)
}
}
 updateRelease() {           // to update a release
 this.SeqNo = 7
 this.StartTaskId = 7
 this.Version = 1
 this.ReleaseTag = 'done'
 this.EndTaskId = 8
 const assignTaskUpdate = this.editReleaseForm.controls.taskName.value
 console.log("assign task",assignTaskUpdate)
 console.log("open edit method",this.editReleaseForm.value)
 const updated = {
 releaseStartDate:this.editReleaseForm.controls.startDate.value,
 actualReleaseDate: "",
 id: this.idToBeEdited,
 status: this.editReleaseForm.controls.status.value,
 seqNo: this.SeqNo,
 description: this.editReleaseForm.controls.description.value,
 projectId: this.projectId,
 associatedTask:assignTaskUpdate === null ? '' : this.editReleaseForm.controls.taskName.value.toString(),
 createdBy: this.CreateBy,
 modifiedBy: this.userName,
 startTaskId: this.StartTaskId,
 version: this.editReleaseForm.controls.version.value,
 releaseEndDate: this.editReleaseForm.controls.releaseDate.value,
 releaseTag: this.ReleaseTag,
 endTaskId: this.EndTaskId,
 }
 console.log("updated values", updated)
 this.dataService.post(apis.updateReleases, updated).subscribe(res => {
   console.log("update response", res)
 if (res.hasOwnProperty('success') === true) {
 this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
 } else {
 this.notification.create('error', 'Failed to Update', 'Your data is failed to update')
 }
 this.getAllRelease()
 })
 this.editVisible = false
 this.editReleaseForm.get('taskName').reset()
 }

 cancelAddorEdit(): void {       // cancel add or edit pop up
 this.addVisible = false
 this.editVisible = false
 this.addReleaseForm.reset()
 this.editAssignedTasks=[];
 this.editReleaseForm.reset()
 }

 gotoHome() {            // breadcrumb routing to home
 this.route.navigate(['/dashboard/allProjects'])
 }
 details() {           // routing to dashboard
 this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
 }

 showTasks(id){            // open pop up tasks based on project  id or release id
this.tasksListVisible =true;
this.releaseTaskId= id
console.log(this.releaseTaskId)
this.getTasksList()
 }
 getTasksList(){    // to get list of tasks based on release id
  const reqBody= {  
    "releaseId": this.releaseTaskId
}
console.log("taskid", reqBody)
this.dataService.post(apis.displayTasks, reqBody).subscribe(result => {
  console.log(result)
 this.releaseTasks = result[0].data
 console.log("release tasks list ",this.releaseTasks);
 this.pendcount = result[0].pendingCount
 this.Totlcount = result[0].Totalcount
 this.completeCount = result[0].completedCount
 
})
}
taskCancel(){            // cancel tasks list pop up
  this.tasksListVisible =false;
}

}
