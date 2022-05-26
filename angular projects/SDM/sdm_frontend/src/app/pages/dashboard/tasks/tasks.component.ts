import { DataService } from 'src/app/data.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { apis } from 'src/app/api'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
export interface Tasks {
  key: string
  taskName: string
  level?: number
  expand?: boolean
  children?: Tasks[]
  parent?: Tasks
  duration: number
  startDate?: string
  endDate?: string
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  inputValue?: string
  openAddTodoForm = false
  isVisible1 = false
  openEditTodoForm = false
  isVisible3 = false
  searchTask: any
  addTodoForm: FormGroup
  editMyTaskForm: FormGroup
  editTodoForm: FormGroup
  addMytaskForm: FormGroup
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
  Date: any
  assignedTo: any
  type: any
  createdDate: any
  predecessors: any
  storyId: any
  status: any
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
  ProjectName: string
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private route: Router,
  ) {}
  ngOnInit(): void {
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
      seqNo: [''],
      predecessors: [''],
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
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      description: ['', Validators.required],
      seqNo: ['', Validators.required],
      createdBy: ['', Validators.required],
      assignedTo: ['', Validators.required],
      predecessors: ['', Validators.required],
    })
    this.editTodoForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      description: ['', Validators.required],
    })
    this.getAllTasks()
    this.getAllTodos()
    this.ProjectName = sessionStorage.getItem('pName')
  }
  //////////////////////////////////////Get All Todos/////////////////////////////////////////
  getAllTodos() {
    this.dataService.get(apis.getTodo).subscribe(res => {
      this.todoDetails = res
      //console.log(res);
    })
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
      console.log(res)
      this.getAllTodos()
    })
    this.openAddTodoForm = false
  }
  ////////////////////////////////////Edit TODO/////////////////////////
  editTodo(data) {
    console.log(data.Id)
    this.openEditTodoForm = true
    this.id = data.Id
    this.editTodoForm.get('status').patchValue(data.Status)
    this.editTodoForm.get('description').patchValue(data.Description)
    this.editTodoForm.get('priority').patchValue(data.Priority)
    this.editTodoForm.get('endDate').patchValue(data.Enddate)
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
      console.log(res)
      this.getAllTodos()
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
      console.log(res)
      this.getAllTodos()
    })
  }
  /////////////////Get All Tasks based on Project Id and login Id////////////////////////////
  getAllTasks() {
    this.dataService
      .getMyTasks(apis.getMytasks, this.loginId, this.selectedProjectId)
      .subscribe(res => {
        this.taskDetails = res
        console.log(res)
      })
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
      assignedTo: this.addMytaskForm.controls.assignedTo.value,
      type: 'T',
      uploadfile: '',
      predecessors: this.addMytaskForm.controls.predecessors.value,
      storyId: 0,
    }
    console.log(newTaskDetails)
    this.dataService.post(apis.newTask, newTaskDetails).subscribe(res => {
      console.log(res)
      this.getAllTasks()
    })
    this.getAllTasks()
    this.openAddTaskForm = true
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
      console.log(res)
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
      console.log(res)
      this.getAllTasks()
    })
  }
  open(): void {
    this.visible = true
  }
  cancel(): void {
    this.openAddTodoForm = false
    this.openEditTodoForm = false
    this.openAddTaskForm = false
    this.openEditTaskForm = false
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
  onCurrentPageDataChange(data) {
    console.log(data)
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
    console.log(this.ProjectName)
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
