import { DataService } from 'src/app/data.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { apis } from 'src/app/api'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import { HostListener } from '@angular/core'
import { DatePipe } from '@angular/common'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
export interface Tasks {
  key: string
  taskName: string
  level?: number
  expand?: boolean
  //children?: Tasks[]
  parent?: Tasks
  duration: number
  startDate?: string
  endDate?: string
}
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  providers: [DatePipe],
})
export class TasksComponent implements OnInit {
  inputValue?: string
  openAddTodoForm = false
  isVisible1 = false
  openEditTodoForm = false
  isVisible3 = false
  searchTask: any
  header = 'Search'
  header1 = 'Search'
  addTodoForm: FormGroup
  editMyTaskForm: FormGroup
  editTodoForm: FormGroup
  addMytaskForm: FormGroup
  searchForm: FormGroup
  searchForm1: FormGroup
  taskDetails: any
  visible = false
  vTodoTable = false
  vTaskTable = false
  id: any
  parentId: any
  seqNo: any
  description: any
  createdBy: any
  projectId: any
  modifiedDate: any
  modifiedBy: any
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
  pageNum: number
  pageSize: number
  noOfRecords: number
  totalPages: number
  remainingText: number
  listOfResources: any
  listOfResource: any
  ProjectName: string
  sAssignedTo: any
  startDate: string
  sEDate: any
  customerName: any
  todoRecords: any
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
    private message: NzMessageService,
    private datePipe: DatePipe,
    private dataService: DataService,
  ) {}
  ngOnInit(): void {
    this.pageSize = 5
    this.pageNum = 1
    this.totalPages = 10
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.editMyTaskForm = this.fb.group({
      priority: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      name: [
        null,
        [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      description: [
        '',
        [Validators.required, Validators.maxLength(225), Validators.pattern('^[a-zA-Z0-9 .]*$')],
      ],
      status: ['', Validators.required],
      seqNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      predecessors: [
        '',
        [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ,]*$')],
      ],
    })
    this.addTodoForm = this.fb.group({
      todoName: [
        '',
        [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      description: [
        '',
        [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9 .]*$')],
      ],
      name: [
        '',
        [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z ]*$')],
      ],
    })
    this.addMytaskForm = this.fb.group({
      name: [
        null,
        [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      status: [null, Validators.required],
      priority: [null, Validators.required],
      description: [
        null,
        [Validators.required, Validators.maxLength(225), Validators.pattern('^[a-zA-Z0-9 .]*$')],
      ],
      seqNo: [
        null,
        [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
      createdBy: [
        null,
        [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      assignedTo: [null, Validators.required],
      predecessors: [
        null,
        [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ,]*$')],
      ],
    })
    this.editTodoForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength, Validators.pattern('^[a-zA-Z ]*$')]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      description: [
        '',
        [Validators.required, Validators.maxLength, Validators.pattern('^[a-zA-Z0-9 .]*$')],
      ],
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
      console.log(res)
      this.todoDetails = res[0].data
      this.todoRecords = res[0].count
    })
  }

  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllTodos()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.getAllTodos()
  }
  ////////////////////////////////////////Get All Contacts////////////////////////////////////
  getContacts() {
    const children: Array<{ label: string; value: string }> = []

    let reqBody = {
      pageNum: 1,
      pageSize: 10,
      projectId: JSON.parse(sessionStorage.getItem('projectDetails')).Id,
      resourceName: '',
      resourceTitle: '',
      startDate: '',
      endDate: '',
      resourceType: '',
    }
    console.log(reqBody)
    this.dataService.post(apis.resource, reqBody).subscribe((res: any) => {
      console.log(res)

      this.listOfResources = res[0].data
      console.log(this.listOfResources)
      this.listOfResources.forEach(x => {
        children.push({ label: x.resourceName, value: x.resourceName })
      })
      this.listOfResources = children
      console.log('list of resources', this.listOfResources)
    })
  }

  reset2() {
    this.searchForm1.reset()
    this.getAllTodos()
  }
  //////////////////////////////////ADDING NEW TODO RECORD///////////////////////////////////////
  addTodo(): void {
    this.openAddTodoForm = true
  }
  addingTodo() {
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
    console.log(addTodo)
    this.dataService.post(apis.newTodo, addTodo).subscribe(res => {
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
    })
    this.openAddTodoForm = false
    this.addTodoForm.reset()
    this.getAllTodos()
  }
  ////////////////////////////////////Edit TODO/////////////////////////
  editTodo(data) {
    console.log(data.Id)
    this.openEditTodoForm = true
    this.id = data.Id
    this.editTodoForm.get('status').patchValue(data.Status)
    this.editTodoForm.get('description').patchValue(data.Description)
    this.editTodoForm.get('priority').patchValue(data.Priority)
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
      startDate: this.editTodoForm.controls.startDate.value,
      endDate: this.editTodoForm.controls.endDate.value,
      status: this.editTodoForm.controls.status.value,
      priority: this.editTodoForm.controls.priority.value,
      description: this.editTodoForm.controls.description.value,
    }
    this.dataService.post(apis.updateTodo, modifyTodo).subscribe(res => {
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully updated', 'Record updated successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
    })
    this.getAllTodos()
    this.openEditTodoForm = false
    this.getAllTodos()
  }
  ////////////////////////////Delete TODO//////////////////////////////
  deleteTodo(id) {
    let dId = {
      id: id,
    }
    this.dataService.post(apis.deleteTodo, dId).subscribe(res => {
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('error', 'Not  Deleted', 'Your data is not Deleted')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('success', 'Deleted', 'Your data is deleted Successfully')
      }
    })
    this.getAllTodos()
  }
  /////////////////Get All Tasks based on Project Id and login Id////////////////////////////

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
      assignedTo: '',
      projectId: this.selectedProjectId,
      status: status === null || status === undefined ? '' : status,
      name: name === null || name === undefined ? '' : name,
    }
    console.log(reqBody)
    this.dataService.post(apis.getMytasks, reqBody).subscribe(res => {
      this.taskDetails = res[0].data
      this.records = res[0].count
      console.log(this.taskDetails)
      console.log(this.records)
      console.log(res)
    })
  }
  onCurrentPageDataChange1(data) {
    this.pageNum = data
    this.getAllTasks()
  }
  onPageSizeChange1(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.getAllTasks()
  }
  reset1() {
    this.searchForm.reset()
    this.getAllTasks()
  }
  dashboard() {
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  //////////////////////////////////////////Adding a new Task/////////////////////////////////
  addTask() {
    this.openAddTaskForm = true
  }
  AddingTask() {
    let newTaskDetails = {
      parentId: null,
      status: this.addMytaskForm.controls.status.value,
      seqNo: this.addMytaskForm.controls.seqNo.value,
      description: this.addMytaskForm.controls.description.value,
      createdBy: this.addMytaskForm.controls.createdBy.value,
      priority: this.addMytaskForm.controls.priority.value,
      projectId: this.selectedProjectId,
      endDate: this.addMytaskForm.controls.endDate.value,
      name: this.addMytaskForm.controls.name.value,
      startDate: this.addMytaskForm.controls.startDate.value,
      assignedTo: this.addMytaskForm.controls.assignedTo.value.join(),
      type: 'T',
      uploadfile: '',
      predecessors: this.addMytaskForm.controls.predecessors.value,
      storyId: 0,
    }
    console.log(newTaskDetails)
    this.dataService.post(apis.newTask, newTaskDetails).subscribe(res => {
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
      this.getAllTasks()
    })

    this.openAddTaskForm = false
    this.addMytaskForm.reset()
    this.getAllTasks()
  }
  ////////////////////////////////////////////Updating A Task//////////////////////////////////
  editRow(data): void {
    console.log(data)
    this.openEditTaskForm = true
    this.pId = data.ParentId
    this.createdBy = data.CreatedBy
    this.assignedTo = data.AssignedTo
    this.id = data.Id
    this.createdDate = data.CreatedDate
    this.storyId = data.StoryId
    this.editMyTaskForm.get('status').patchValue(data.Status)
    this.editMyTaskForm.get('description').patchValue(data.Description)
    this.editMyTaskForm.get('priority').patchValue(data.Priority)
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
      endDate: this.editMyTaskForm.controls.endDate.value,
      name: this.editMyTaskForm.controls.name.value,
      startDate: this.editMyTaskForm.controls.startDate.value,
      createdDate: this.createdDate,
      assignedTo: this.assignedTo,
      type: 'T',
      uploadfile: null,
      predecessors: this.editMyTaskForm.controls.predecessors.value,
      storyId: this.storyId,
      id: this.id,
      modifiedBy: this.userName,
    }
    console.log(update)
    this.dataService.post(apis.updateMyTask, update).subscribe(res => {
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
      this.getAllTasks()
    })
    this.openEditTaskForm = false
    //this.editMyTaskForm.reset()
    this.getAllTasks()
  }
  deleteRow(id): void {
    let del = {
      id: id,
    }
    this.dataService.post(apis.deleteMyTask, del).subscribe(res => {
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('error', 'Not Deleted', 'Your data is not Deleted')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('success', 'Deleted', 'Record Deleted successfully')
      }
    })
    this.getAllTasks()
  }
  /////////////////Show complete Description/////////////////////////////////
  open(): void {
    this.visible = true
  }
  cancel(): void {
    this.openAddTodoForm = false
    this.openEditTodoForm = false
    this.openAddTaskForm = false
    this.openEditTaskForm = false
    this.addMytaskForm.reset()
    this.addTodoForm.reset()
  }
  onSearch(event) {}
  save(): void {
    this.openAddTodoForm = true
    this.isVisible1 = true
  }
  reset(): void {
    this.searchTask = ''
    this.onSearch(this.searchTask)
  }
  drop(event: CdkDragDrop<string[]>): void {
    // moveItemInArray(this.listOfMapData, event.previousIndex, event.currentIndex)
  }
  submitForm() {
    // console.log('submittred 123 edit166', this.addResourceForm)
  }
  submitForm1(x) {
    console.log('submittred 123 edit', this.editMyTaskForm, x)
  }
  resetSearchFields() {}
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
    console.log('handleStartOpenChange', open, this.endOpen)
  }

  handleEndOpenChange(open: boolean): void {
    console.log(open)
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
    console.log('handleStartOpenChange', open, this.endOpen)
  }

  handleEndOpenChange2(open: boolean): void {
    console.log(open)
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
    console.log('handleStartOpenChange', open, this.endOpen)
  }

  handleEndOpenChange5(open: boolean): void {
    console.log(open)
    this.endOpen5 = open
  }
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }

  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
