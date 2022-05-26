import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { DataService } from 'src/app/data.service'
import { Router } from '@angular/router'
import { apis } from 'src/app/api'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import { HostListener } from '@angular/core'
import { DatePipe } from '@angular/common'
// import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
export interface TreeNodeInterface {
  parent: any
  level: any
  child: any
  createdDate: string
  seqNo: number
  // createdBy: string;
  modifiedDate: string
  description: string
  modifiedBy: string
  id: number
  title: string
  projectId: number
  taskId: number
  tags: number
  storyPoints: number
  createDdate: string
  type: string
  epicId: number
  documentId: number
  artifactId: number
  expand?: boolean
}
@Component({
  selector: 'app-scope',
  templateUrl: './scope.component.html',
  styleUrls: ['./scope.component.scss'],
  providers: [DatePipe],
})
export class ScopeComponent implements OnInit {
  openEpicAddForm: boolean
  modifyEpicForm: boolean
  openStoryForm: boolean
  modifyStoryForm: boolean
  openTaskaddForm: boolean
  modifyTaskForm: boolean
  addEpicForm: FormGroup
  prjForm: FormGroup
  editEpicForm: FormGroup
  addStoryForm: FormGroup
  editStoryForm: FormGroup
  addTaskForm: FormGroup
  editTaskForm: FormGroup
  searchForm: FormGroup
  searchTerm: any
  userName = JSON.parse(sessionStorage.getItem('loginData')).FName
  loginId = JSON.parse(sessionStorage.getItem('loginData')).LoginId
  newStoryDetails: any
  selectedProjectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
  listOfMapData: TreeNodeInterface[]
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {}
  document: any
  arr = []
  size: NzSelectSizeType = 'default'
  newtaskDetails: { ProjectId: any }
  storyId: any
  newTask: {
    ProjectId: any
    Type: string
    SeqNo: number
    Name: any
    Description: any
    EndDate: any
    Predecessors: string
    AssignedTo: any
    CreatedBy: any
    StoryId: any
    Status: any
    Priority: any
    StartDate: any
  }
  epicId: any
  uEpicId: any
  createdDate: any
  ucreatedBy: any
  pageNum: number
  pageSize: number
  noOfRecords: number
  totalPages: number
  sTitle: any
  sCreated: any
  sSeq: any
  sType: any
  Category = [
    { label: 'Functional', value: 'Functional' },
    { label: 'Non-Functional', value: 'Non-Functional' },
  ]
  Type = {
    E: 'Epic',
    S: 'Story',
    T: 'Task',
  }
  StoryType = [
    { label: 'UX Requirements', value: 'U' },
    { label: 'Data Requirements', value: 'D' },
    { label: 'Interface', value: 'I' },
    { label: 'Others', value: 'O' },
  ]
  header = 'Search'
  parentId: any
  assignedTo: any
  getOnlyTask: any
  uId: any
  addIcon: boolean
  records: any
  listOfResources: any
  ProjectName: string
  sProjectId: any
  searchDate: any
  searchValue: any
  customerName: any
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getTableData()
    }
  }
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach(d => {
          const target = array.find(a => a.id === d.id)!
          target.expand = false
          this.collapse(array, target, false)
        })
      } else {
        return
      }
    }
  }
  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = []
    const array: TreeNodeInterface[] = []
    const hashMap = {}
    stack.push({ ...root, level: 0, expand: false })

    while (stack.length !== 0) {
      const node = stack.pop()!
      this.visitNode(node, hashMap, array)
      if (node.child) {
        for (let i = node.child.length - 1; i >= 0; i--) {
          stack.push({ ...node.child[i], level: node.level! + 1, expand: false, parent: node })
        }
      }
    }
    return array
  }
  visitNode(
    node: TreeNodeInterface,
    hashMap: { [id: string]: boolean },
    array: TreeNodeInterface[],
  ): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true
      array.push(node)
    }
  }
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private msg: NzMessageService,
    private dataService: DataService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.pageSize = 10
    this.pageNum = 1
    this.totalPages = 10
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.prjForm = this.fb.group({
      pScope: [null],
    })
    this.addEpicForm = this.fb.group({
      taskId: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      seqNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      tags: [
        '',
        [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-z0-9 ]*$')],
      ],
      title: [
        '',
        [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-z ]*$')],
      ],
      description: [
        '',
        [Validators.required, Validators.maxLength(1000), Validators.pattern('^[a-zA-z0-9 .]*$')],
      ],
      createdBy: [
        '',
        [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-z ]*$')],
      ],
    })
    this.editEpicForm = this.fb.group({
      taskId: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      seqNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      tags: [
        '',
        [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-z0-9 ]*$')],
      ],
      title: [
        '',
        [Validators.required, Validators.maxLength(500), Validators.pattern('^[a-zA-z ]*$')],
      ],
      description: [
        '',
        [Validators.required, Validators.maxLength(500), Validators.pattern('^[a-zA-z0-9 .]*$')],
      ],
    })
    this.addStoryForm = this.fb.group({
      storyPoints: [
        null,
        [Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]*$')],
      ],
      storyType: ['', [Validators.required]],
      tags: [
        '',
        [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-z0-9 ]*$')],
      ],
      title: [
        '',
        [Validators.required, Validators.maxLength(70), Validators.pattern('^[a-zA-z ]*$')],
      ],
      description: [
        '',
        [Validators.required, Validators.maxLength(500), Validators.pattern('^[a-zA-z0-9 .]*$')],
      ],
      documentId: [
        '',
        [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
      artifactId: [
        '',
        [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
      createdBy: [
        '',
        [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-z ]*$')],
      ],
      seqNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
    })
    this.editStoryForm = this.fb.group({
      storyPoints: [
        null,
        [Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]*$')],
      ],
      storyType: [null, [Validators.required]],
      seqNo: [
        null,
        [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
      tags: [
        null,
        [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-z0-9 ]*$')],
      ],
      title: [
        null,
        [Validators.required, Validators.maxLength(70), Validators.pattern('^[a-zA-z ]*$')],
      ],
      description: [
        null,
        [Validators.required, Validators.maxLength(500), Validators.pattern('^[a-zA-z0-9 .]*$')],
      ],
      documentId: [
        null,
        [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
      artifactId: [
        null,
        [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
    })
    this.addTaskForm = this.fb.group({
      name: [
        null,
        [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-z ]*$')],
      ],
      description: [
        null,
        [Validators.required, Validators.maxLength(225), Validators.pattern('^[a-zA-z0-9 .]*$')],
      ],
      endDate: [null, [Validators.required]],
      assignedTo: [null],
      status: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      predecessors: [
        null,
        [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ,.]*$')],
      ],
      seqNo: [
        null,
        [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
    })
    this.editTaskForm = this.fb.group({
      status: [null, [Validators.required]],
      seqNo: [
        null,
        [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
      description: [
        null,
        [Validators.required, Validators.maxLength(225), Validators.pattern('^[a-zA-Z0-9 .,]*$')],
      ],
      priority: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      name: [
        null,
        [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      startDate: [null, [Validators.required]],
      predecessors: [
        null,
        [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ,.]*$')],
      ],
      assignedTo: [null, [Validators.required]],
    })

    this.searchForm = this.fb.group({
      searchValue: [null],
      searchDate: [null],
    })
    this.getTableData()
    this.getContacts()
  }
  ////////////////////////////////Get Hirearchy//////////////////////////////////////////
  getTableData() {
    const title = this.searchForm.controls.searchValue.value
    const createdDate = this.datePipe.transform(
      this.searchForm.get('searchDate').value,
      'yyyy-MM-dd',
    )
    let reqBody = {
      createdDate: createdDate === null || createdDate === undefined ? '' : createdDate,
      title: title === null || title === undefined ? '' : title,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      projectId: this.selectedProjectId,
    }
    this.dataService.post(apis.scope, reqBody).subscribe((res: any) => {
      this.listOfMapData = res[0].data
      this.records = res[0].count
      this.listOfMapData.forEach(item => {
        this.mapOfExpandedData[item.id] = this.convertTreeToList(item)
      })
    })
  }

  // reset(){
  // this.sTitle=null;
  // this.sSeq=null;
  // this.sType=null;
  // this.sCreated=null;
  // this.getTableData()
  // }

  ///////////////////////////Get All Contacts//////////////////////////////////////////////
  getContacts() {
    const children: Array<{ label: string; value: string }> = []
    this.dataService.get(apis.resource).subscribe((res: any) => {
      this.listOfResources = res
      this.listOfResources.forEach(x => {
        children.push({ label: x.resourceName, value: x.resourceName })
      })
      this.listOfResources = children
    })
  }
  ////////////////////////////////To add a new Epic ////////////////////////////////////////
  openAdd() {
    this.openEpicAddForm = true
    console.log(this.openEpicAddForm)
  }
  newEpic() {
    let newEpicDetails = {
      projectId: this.selectedProjectId,
      taskId: this.addEpicForm.controls.taskId.value,
      seqNo: this.addEpicForm.controls.seqNo.value,
      tags: this.addEpicForm.controls.tags.value,
      title: this.addEpicForm.controls.title.value,
      type: 'E',
      description: this.addEpicForm.controls.description.value,
      createdBy: this.addEpicForm.controls.createdBy.value,
    }
    this.dataService.post(apis.newEpic, newEpicDetails).subscribe(res => {
      this.getTableData()
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
    })
    this.openEpicAddForm = false
    this.addEpicForm.reset()
    this.getTableData()
  }
  //////////////////////////To add a new Story or new Task//////////////////////////////////
  addchildRow(data) {
    if (data.type == 'E') {
      this.openStoryForm = true
      this.epicId = data.id
    } else {
      this.openTaskaddForm = true
      this.storyId = data.id
      this.epicId = data.epicId
    }
  }
  addingTask() {
    let newtaskDetails = {
      projectId: this.selectedProjectId,
      type: 'T',
      seqNo: this.addTaskForm.controls.seqNo.value,
      name: this.addTaskForm.controls.name.value,
      description: this.addTaskForm.controls.description.value,
      endDate: this.addTaskForm.controls.endDate.value,
      predecessors: this.addTaskForm.controls.predecessors.value,
      assignedTo: this.addTaskForm.controls.assignedTo.value.join(),
      createdBy: this.userName,
      storyId: this.storyId,
      status: this.addTaskForm.controls.status.value,
      priority: this.addTaskForm.controls.priority.value,
      startDate: this.addTaskForm.controls.startDate.value,
    }
    console.log(newtaskDetails)
    this.dataService.post(apis.newTask, newtaskDetails).subscribe(res => {
      this.getTableData()
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
    })
    this.openTaskaddForm = false
    this.addTaskForm.reset()
    this.getTableData()
  }
  addingStory() {
    let newStoryDetails = {
      epicId: this.epicId,
      projectId: this.selectedProjectId,
      storyPoints: this.addStoryForm.controls.storyPoints.value,
      type: 'S',
      seqNo: this.addStoryForm.controls.seqNo.value,
      tags: this.addStoryForm.controls.tags.value,
      title: this.addStoryForm.controls.title.value,
      description: this.addStoryForm.controls.description.value,
      documentId: this.addStoryForm.controls.documentId.value,
      artifactId: this.addStoryForm.controls.artifactId.value,
      createdBy: this.userName,
      storyType: this.addStoryForm.controls.storyType.value,
    }
    console.log(newStoryDetails)
    this.dataService.post(apis.newStory, newStoryDetails).subscribe(res => {
      this.getTableData()
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
    })

    this.openStoryForm = false
    this.addStoryForm.reset()
    this.getTableData()
  }
  /////////////////////////To patch a Epic or Story or Task//////////////////////////////////
  editRow(data) {
    if (data.type == 'E') {
      this.modifyEpicForm = true
      this.uEpicId = data.id
      this.ucreatedBy = data.createdBy
      this.modifyEpicForm = true
      this.editEpicForm.get('taskId').patchValue(data.taskId),
        this.editEpicForm.get('seqNo').patchValue(data.seqNo),
        this.editEpicForm.get('tags').patchValue(data.tags),
        this.editEpicForm.get('title').patchValue(data.title),
        this.editEpicForm.get('description').patchValue(data.description)
    } else if (data.type == 'S') {
      console.log(data)
      this.storyId = data.id
      this.ucreatedBy = data.createdBy
      this.uEpicId = data.epicId
      this.modifyStoryForm = true
      this.editStoryForm.get('storyPoints').patchValue(data.storyPoints.toString()),
        this.editStoryForm.get('seqNo').patchValue(data.seqNo),
        this.editStoryForm.get('tags').patchValue(data.tags),
        this.editStoryForm.get('title').patchValue(data.title),
        this.editStoryForm.get('description').patchValue(data.description),
        this.editStoryForm.get('documentId').patchValue(data.documentId),
        this.editStoryForm.get('artifactId').patchValue(data.artifactId),
        this.editStoryForm.get('storyType').patchValue(data.Storytype)
    } else {
      this.modifyTaskForm = true
      this.modifyTaskForm = true
      this.parentId = data.ParentId
      this.storyId = data.StoryId
      this.uId = data.Id
      this.createdDate = data.createdDate
      this.assignedTo = data.AssignedTo.split(',')
      this.editTaskForm.get('status').patchValue(data.Status),
        this.editTaskForm.get('seqNo').patchValue(data.seqNo),
        this.editTaskForm.get('description').patchValue(data.description),
        this.editTaskForm.get('priority').patchValue(data.Priority),
        this.editTaskForm.get('endDate').patchValue(data.EndDate),
        this.editTaskForm.get('name').patchValue(data.title),
        this.editTaskForm.get('startDate').patchValue(data.StartDate),
        this.editTaskForm.get('predecessors').patchValue(data.Predecessors)
    }
  }
  updatingEpic() {
    let modifingEpic = {
      seqNo: this.editEpicForm.controls.seqNo.value,
      createdBy: this.ucreatedBy,
      description: this.editEpicForm.controls.description.value,
      modifiedBy: this.userName,
      id: this.uEpicId,
      title: this.editEpicForm.controls.title.value,
      type: 'E',
      projectId: this.selectedProjectId,
      taskId: this.editEpicForm.controls.taskId.value,
      tags: this.editEpicForm.controls.tags.value,
    }
    this.dataService.post(apis.updateEpic, modifingEpic).subscribe(res => {
      this.getTableData()
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
    })
    this.modifyEpicForm = false
    this.getTableData()
  }
  updatingStory() {
    let modifyStory = {
      epicId: this.uEpicId,
      projectId: this.selectedProjectId,
      storyPoints: parseInt(this.editStoryForm.controls.storyPoints.value),
      storyType: this.editStoryForm.controls.storyType.value,
      type: 'S',
      seqNo: this.editStoryForm.controls.seqNo.value,
      tags: this.editStoryForm.controls.tags.value,
      title: this.editStoryForm.controls.title.value,
      description: this.editStoryForm.controls.description.value,
      documentId: this.editStoryForm.controls.documentId.value,
      artifactId: this.editStoryForm.controls.artifactId.value,
      createdBy: this.ucreatedBy,
      modifiedBy: this.userName,
      id: this.storyId,
    }
    this.dataService.post(apis.updateStory, modifyStory).subscribe(res => {
      this.getTableData()
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
    })

    this.modifyStoryForm = false
    this.getTableData()
  }
  updatingtask() {
    let modifyTask = {
      status: this.editTaskForm.controls.status.value,
      seqNo: this.editTaskForm.controls.seqNo.value,
      description: this.editTaskForm.controls.description.value,
      createdBy: this.ucreatedBy,
      priority: this.editTaskForm.controls.priority.value,
      projectId: this.selectedProjectId,
      endDate: this.editTaskForm.controls.endDate.value,
      name: this.editTaskForm.controls.name.value,
      startDate: this.editTaskForm.controls.startDate.value,
      createdDate: this.createdDate,
      assignedTo: this.editTaskForm.controls.assignedTo.value.join(),
      type: 'T',
      uploadfile: '',
      predecessors: this.editTaskForm.controls.predecessors.value,
      storyId: this.storyId,
      id: this.uId,
      modifiedBy: this.userName,
    }
    this.dataService.post(apis.updateMyTask, modifyTask).subscribe(res => {
      this.getTableData()
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
        // this.message.success(`${res.success}`); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
    })

    this.modifyTaskForm = false
    this.getTableData()
  }
  //////////////////////////////////To Delete Epic or story or Task//////////////////////////////////////////
  deleteRow(data) {
    if (data.type == 'E') {
      let deleteEpic = {
        id: data.id,
      }
      this.dataService.post(apis.deleteEpic, deleteEpic).subscribe(res => {
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('error', 'Not Deleted', 'Record Not Deleted')
          // this.message.success(`${res.success}`); //for error .error
        } else {
          this.notification.create('success', 'Deleted Successfully', 'Your data is Deleted')
        }
      })
      this.getTableData()
    } else if (data.type == 'S') {
      let deleteStory = {
        id: data.id,
      }
      this.dataService.post(apis.deleteStory, deleteStory).subscribe(res => {
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('error', 'Not Deleted', 'Record Not Deleted')
          // this.message.success(`${res.success}`); //for error .error
        } else {
          this.notification.create('success', 'Deleted Successfully', 'Your data is Deleted')
        }
      })
      this.getTableData()
    } else {
      let deleteTask = {
        id: data.Id,
      }
      this.dataService.post(apis.deleteMyTask, deleteTask).subscribe(res => {
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('error', 'Not Deleted', 'Record Not Deleted')
          // this.message.success(`${res.success}`); //for error .error
        } else {
          this.notification.create('success', 'Deleted Successfully', 'Your data is Deleted')
        }
      })
      this.getTableData()
    }
  }
  cancel() {
    this.openTaskaddForm = false
    this.openEpicAddForm = false
    this.modifyEpicForm = false
    this.openStoryForm = false
    this.modifyStoryForm = false
    this.modifyTaskForm = false
  }

  // onCurrentPageDataChange(data) {
  // this.pageNum=data;
  // this.getTableData();

  // }
  // onPageSizeChange(data){
  // console.log("page size change",data)
  // this.pageSize=data;
  // this.getTableData();

  // }
  reset() {
    this.searchForm.reset()
    this.getTableData()
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
  }
  handleEndOpenChange(open: boolean): void {
    console.log(open)
    this.endOpen = open
  }
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }

  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  //pagination
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getTableData()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.pageNum = 1
    this.getTableData()
  }

  onChange(): void {
    console.log(this.searchForm.value)
    this.getTableData()
  }

  // resetSearchFields(){
  // this.searchForm.reset()
  // this.getTableData()
  // }
}
