import { DataService } from 'src/app/data.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { apis } from 'src/app/api'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import { HostListener } from '@angular/core'
import { DatePipe } from '@angular/common'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
@Component({
 selector: 'app-tasks',
 templateUrl: './tasks.component.html',
 styleUrls: ['./tasks.component.scss'],
 providers: [DatePipe],
})
export class TasksComponent implements OnInit {
  customColors: string[] = [ 'The predecessor is the first task; it controls the start or end date for all related successor tasks'];
 openAddTodoForm = false
 isVisible1 = false
 openEditTodoForm = false
 searchTask: any
 header = 'Search'
 addTodoForm: FormGroup
 editMyTaskForm: FormGroup
 editTodoForm: FormGroup
 addMytaskForm: FormGroup
 searchForm: FormGroup
 searchForm1: FormGroup
 taskDetails: any
 visible = false
 id: any
 createdBy: any
 size: NzSelectSizeType = 'default'
 Date: any
 assignedTo: any
 type: any
 createdDate: any
 predecessors: any
 storyId: any
 status: any
 sStatus: any
 sName: any
 sAssigned: any
 sDate: any
 priority: any
 ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
 customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
 selectedProjectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
 userName = JSON.parse(sessionStorage.getItem('loginData')).FName
 loginId = JSON.parse(sessionStorage.getItem('loginData')).LoginId
 records: any
 pId: any
 name: any
 todoDetails: any
 openAddTaskForm: boolean
 openEditTaskForm: boolean
 todos: any
 tasks: any
 pageNum=1
 pageSize=5
 totalPages: number
 listOfResources: any
 startDate: string
 sEDate: any
 todoRecords: any
  data: any
  modifyingData: any
 @HostListener('window:keydown', ['$event'])
 keyboardInput(event: any) {
 if (event.key === 'Enter') {
 this.getAllTasks()
 }
 }
 @HostListener('window:keydown', ['$event'])
 keyboardInput1(event: any) {
 if (event.key === 'Enter') {
 this.getAllTodos()
 }
 }
 constructor(
 private fb: FormBuilder,
 private router: Router,
 private notification: NzNotificationService,
 private datePipe: DatePipe,
 private dataService: DataService,
 ) {}
 ngOnInit(): void {
   //Status dropDown
   this.dataService.get(apis.taskstatus).subscribe((res)=>{
    this.status=res;
    })
  ////////////Priority dropDown
  this.dataService.get(apis.priority).subscribe((res)=>{
    this.priority=res;
    })
 this.editMyTaskForm = this.fb.group({
 priority: [null],
 startDate: [null],
 endDate: [null],
 name: [null,[Validators.required, Validators.maxLength(50)],],
 description: [null,[Validators.maxLength(255)]],
 status: [null],
 seqNo: [null, [Validators.maxLength(11), Validators.pattern('^[0-9]*$')]],
 predecessors: [
 null,
 [ Validators.maxLength(51), Validators.pattern('^[a-zA-Z ,]*$')],
 ],
 })
 this.addTodoForm = this.fb.group({
 startDate: new Date(),
 endDate: [null],
 status: [null],
 priority: [null],
 description: [null,[Validators.maxLength(255)]],
 name: [null,[Validators.required, Validators.maxLength(50)]],
 })
 this.editTodoForm = this.fb.group({
 name: [null, [Validators.required, Validators.maxLength(50)]],
 startDate: [null],
 endDate: [null],
 status: [null],
 priority: [null],
 description: [null,[Validators.maxLength(255)]],
 })
 this.searchForm = this.fb.group({
 sName: [null],
 sStatus: [null],
 sDate: [null],
 sEDate: [null],
 })
 this.searchForm1 = this.fb.group({
 sName: [null],
 sStatus: [null],
 sDate: [null],
 sEDate: [null],
 sAssigned: [null],
 })
 this.getAllTasks()
 this.getAllTodos()
 this.getContacts()
 }

 //////////////////////////////////////Get All Todos/////////////////////////////////////////

 getAllTodos() {
 const status = this.searchForm1.controls.sStatus.value
 const todoName = this.searchForm1.controls.sName.value
 const sDate = this.datePipe.transform(this.searchForm1.get('sDate').value, 'yyyy-MM-dd')
 const sEDate = this.datePipe.transform(this.searchForm1.get('sEDate').value, 'yyyy-MM-dd')
 let reqBody = {
 pageNum: this.pageNum,
 pageSize: this.pageSize,
 endDate: sEDate === null || sEDate === undefined ? '' : sEDate,
 startDate: sDate === null || sDate === undefined ? '' : sDate,
 projectId: this.selectedProjectId,
 status: status === null || status === undefined ? '' : status,
 todoName: todoName === null || todoName === undefined ? '' : todoName,
 }
 this.dataService.post(apis.getTodo, reqBody).subscribe(res => {
 this.todoDetails = res[0].data
 this.todoRecords = res[0].count
 })
 }
 getContacts() {
  const children: Array<{ label: string; value: string }> = []
  this.dataService.getIssuesById(apis.allResources, this.selectedProjectId).subscribe((res: any) => {
    this.listOfResources = res
    this.listOfResources.forEach(x => {
      children.push({ label: x.resourceName, value: x.UserName })
    })
    this.listOfResources = children
  })
}

 //////////////////////////////////ADDING NEW TODO RECORD///////////////////////////////////////
 addTodo(): void {
 this.openAddTodoForm = true
 }
 submitAdd(){
  for (const i in this.addTodoForm.controls) {
        this.addTodoForm.controls[i].markAsTouched()
        this.addTodoForm.controls[i].updateValueAndValidity()
      }
 }
 addingTodo() {
  if (this.addTodoForm.untouched) {
    this.openAddTodoForm=true
    this.submitAdd()
  }
  if(this.addTodoForm.valid){
 let addTodo = {
 todoName: this.addTodoForm.controls.name.value,
 userId: this.loginId,
 userName: this.userName,
 startDate: this.addTodoForm.controls.startDate.value,
 endDate: this.addTodoForm.controls.endDate.value,
 status: this.addTodoForm.controls.status.value,
 priority: this.addTodoForm.controls.priority.value,
 description: this.addTodoForm.controls.description.value,
 }
 this.dataService.post(apis.newTodo, addTodo).subscribe(res => {
   this.getAllTodos()

 if (res.hasOwnProperty('success') === true) {
 this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
 } else {
 this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
 }
 })
 this.openAddTodoForm = false
 this.addTodoForm.reset()
 this.getAllTodos()
 }
}
 ////////////////////////////////////Edit TODO/////////////////////////

 editTodo(data) {
 this.openEditTodoForm = true
 this.id = data.Id
 this.editTodoForm
 .get('status')
 .patchValue(data.Status === null || data.Status === "" || data.Status === undefined ? null : this.status.filter(x => x.Value === data.Status)[0].Value)
 this.editTodoForm.get('description').patchValue(data.Description)
 this.editTodoForm.get('priority').patchValue(data.Priority === null || data.Priority === "" || data.Priority === undefined ? null : this.priority.filter(x => x.Value === data.Priority)[0].Value)
 this.editTodoForm.get('endDate').patchValue(data.EndDate)
 this.editTodoForm.get('name').patchValue(data.TodoName)
 this.editTodoForm.get('startDate').patchValue(data.StartDate)
 }
 updatingTodo() {
 let modifyTodo = {
 id: this.id,
 todoName: this.editTodoForm.controls.name.value,
 userId: this.loginId,
 userName: this.userName,
 startDate: this.datePipe.transform(this.editTodoForm.get('startDate').value, 'yyyy-MM-dd'),
 endDate: this.datePipe.transform(this.editTodoForm.get('endDate').value, 'yyyy-MM-dd'),
 status: this.editTodoForm.controls.status.value,
 priority: this.editTodoForm.controls.priority.value,
 description: this.editTodoForm.controls.description.value,
 }
 this.dataService.post(apis.updateTodo, modifyTodo).subscribe(res => {
  this.getAllTodos()
 if (res.hasOwnProperty('success') === true) {
 this.notification.create('success', 'Successfully updated', 'Record updated successfully')
 } else {
 this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
 }
 })

 this.openEditTodoForm = false
 this.getAllTodos()
 }

 ////////////////////////////Delete TODO//////////////////////////////
 deleteTodo(id) {
 let dId = {
 id: id,
 }
 this.dataService.post(apis.deleteTodo, dId).subscribe(res => {
  this.getAllTodos()
  this.todoDetails.length === 1 ? this.pageNum = this.pageNum -1 : this.pageNum
 if (res.hasOwnProperty('success') === true) {
 this.notification.create('error', 'Not Deleted', 'Your data is not Deleted')
 } else {
 this.notification.create('success', 'Deleted', 'Your data is deleted Successfully')
 }
 })
 this.getAllTodos()
 }
 getAllTasks() {
 const status = this.searchForm.controls.sStatus.value
 const name = this.searchForm.controls.sName.value
 const sDate = this.datePipe.transform(this.searchForm.get('sDate').value, 'yyyy-MM-dd')
 const sEDate = this.datePipe.transform(this.searchForm.get('sEDate').value, 'yyyy-MM-dd')

 let reqBody = {
 pageNum: this.pageNum,
 pageSize: this.pageSize,
 endDate: sEDate === null || sEDate === undefined ? '' : sEDate,
 startDate: sDate === null || sDate === undefined ? '' : sDate,
 assignedTo: this.loginId,
 projectId: this.selectedProjectId,
 status: status === null || status === undefined ? '' : status,
 name: name === null || name === undefined ? '' : name,
 }
 this.dataService.post(apis.getMytasks, reqBody).subscribe(res => {
 this.taskDetails = res[0].data
 this.records = res[0].count
 })
 }
 ///////////Pagination
 onCurrentPageDataChange(data) {
  this.pageNum = data
  this.getAllTodos()
  }
  onPageSizeChange(data) {
  this.pageSize = data
  this.getAllTodos()
  }
 onCurrentPageDataChange1(data) {
 this.pageNum = data
 this.getAllTasks()
 }
 onPageSizeChange1(data) {
 this.pageSize = data
 this.getAllTasks()
 }

 dashboard() {
 this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
 }
 ////////////////////////////////////////////Updating A Task//////////////////////////////////
 editRow(data): void {
   this.editMyTaskForm.get('startDate').disable();
   this.editMyTaskForm.get('priority').disable();
 this.modifyingData=data
 this.openEditTaskForm = true
 this.pId = data.ParentId
 this.createdBy = data.CreatedBy
 this.assignedTo = data.AssignedTo
 this.id = data.Id
 this.createdDate = data.CreatedDate
 this.storyId = data.StoryId
 this.editMyTaskForm
 .get('status')
 .patchValue(data.Status === null || data.Status === "" || data.Status === undefined ? null : this.status.filter(x => x.Value === data.Status)[0].Value)
 this.editMyTaskForm.get('description').patchValue(data.Description)
 this.editMyTaskForm.get('priority').patchValue(data.Priority === null || data.Priority === "" || data.Priority === undefined ? null : this.priority.filter(x => x.Value === data.Priority)[0].Value)
 this.editMyTaskForm.get('endDate').patchValue(data.EndDate)
 this.editMyTaskForm.get('name').patchValue(data.Name)
 this.editMyTaskForm.get('startDate').patchValue(data.StartDate)
 this.editMyTaskForm.get('predecessors').patchValue(data.Predecessors)
 this.editMyTaskForm.get('seqNo').patchValue(data.SeqNo)
 }
 editMyTask() {
 let update = {
 parentId: this.pId,
 status: this.editMyTaskForm.controls.status.value,
 seqNo: this.editMyTaskForm.controls.seqNo.value,
 description: this.editMyTaskForm.controls.description.value,
 createdBy: this.createdBy,
 priority: this.editMyTaskForm.controls.priority.value,
 projectId: this.selectedProjectId,
 endDate:   this.datePipe.transform(this.editMyTaskForm.get('endDate').value, 'yyyy-MM-dd'),
 name: this.editMyTaskForm.controls.name.value,
 startDate:  this.datePipe.transform(this.editMyTaskForm.get('startDate').value, 'yyyy-MM-dd'),
 createdDate: this.datePipe.transform(this.createdDate, 'yyyy-MM-dd'),
 assignedTo: this.assignedTo,
 type: 'T',
 uploadfile: null,
 predecessors: this.editMyTaskForm.controls.predecessors.value,
 storyId: this.modifyingData.StoryId,
 id: this.modifyingData.Id,
 releaseId:this.modifyingData.ReleaseId,
 modifiedBy: this.userName,
 ParentTaskName:null,
 dependencies:"dependencies"
 }
 this.dataService.post(apis.updateMyTask, update).subscribe(res => {
 if (res.hasOwnProperty('success') === true) {
 this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
 } else {
 this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
 }
 this.getAllTasks()
 })
 this.openEditTaskForm = false

 this.getAllTasks()
 }
 deleteRow(id): void {
 let del = {
 id: id,
 }
 this.dataService.post(apis.deleteMyTask, del).subscribe(res => {
  this.taskDetails.length === 1 ? this.pageNum = this.pageNum -1 : this.pageNum
  this.getAllTasks()
 if (res.hasOwnProperty('success') === true) {
 this.notification.create('error', 'Not Deleted', 'Your data is not Deleted')
 } else {
 this.notification.create('success', 'Deleted', 'Record Deleted successfully')
 }
 })
 this.getAllTasks()
 }

 cancel(): void {
  this.searchForm1.reset()
  this.getAllTodos()
  this.searchForm.reset()
  this.getAllTasks()
 this.openAddTodoForm = false
 this.openEditTodoForm = false
 this.openAddTaskForm = false
 this.openEditTaskForm = false
 this.addTodoForm.reset()
 }

 //////////////////////////////Start date and End Date validations/////////////////////////////////////

 //add mytask
 startValue: Date | null = null
 endValue: Date | null = null
 endOpen = false
 endValue1: Date | null = null
 endOpen1 = false
 endValue3: Date | null = null
 endOpen3 = false

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

 onEndChange1(date: Date): void {
 this.endValue1 = date
 }
 handleStartOpenChange(open: boolean): void {
 if (!open) {
 this.endOpen = true
 }
 }
 handleEndOpenChange(open: boolean): void {
 this.endOpen = open
 }

 //edit mytask

 endValue2: Date | null = null
 endOpen2 = false

 disabledStartDate2 = (startValue: Date): boolean => {
 if (!startValue || !this.endValue2) {
 return false
 }
 return startValue.getTime() > this.endValue2.getTime()
 }

 disabledEndDate2 = (endValue2: Date): boolean => {
 if (!endValue2 || !this.startValue) {
 return false
 }
 return endValue2.getTime() <= this.startValue.getTime()
 }

 onStartChange2(date: Date): void {
 this.startValue = date
 }

 onEndChange2(date: Date): void {
 this.endValue = date
 }

 handleStartOpenChange2(open: boolean): void {
 if (!open) {
 this.endOpen2 = true
 }
 }

 handleEndOpenChange2(open: boolean): void {
 this.endOpen2 = open
 }

 //add todo

 endValue5: Date | null = null
 endOpen5 = false

 disabledStartDate5 = (startValue: Date): boolean => {
 if (!startValue || !this.endValue2) {
 return false
 }
 return startValue.getTime() > this.endValue2.getTime()
 }

 disabledEndDate5 = (endValue5: Date): boolean => {
 if (!endValue5 || !this.startValue) {
 return false
 }
 return endValue5.getTime() <= this.startValue.getTime()
 }

 onStartChange5(date: Date): void {
 this.startValue = date
 }

 onEndChange5(date: Date): void {
 this.endValue5 = date
 }

 handleStartOpenChange5(open: boolean): void {
 if (!open) {
 this.endOpen5 = true
 }
 }
 handleEndOpenChange5(open: boolean): void {
 this.endOpen5 = open
 }

 //////////////BreadCrumb
 gotoHome() {
 this.router.navigate(['/dashboard/allProjects'])
 }

 details() {
 this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
 }
}



