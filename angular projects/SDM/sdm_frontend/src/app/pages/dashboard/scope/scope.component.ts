import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { stringify } from 'querystring'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzUploadChangeParam } from 'ng-zorro-antd/upload'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { Router } from '@angular/router'

// import { NzMessageService, NzUploadChangeParam } from 'ng-zorro-antd';
export interface TreeNodeInterface {
  parent: any
  level: any
  child: any
  createdDate: string
  seqNo: number
  createdBy: string
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
})
export class ScopeComponent implements OnInit {
  // options1: Array<{ value: string; category: string; count: number }> = []
  openEpicAddForm: boolean
  modifyEpicForm: boolean
  openStoryForm: boolean
  modifyStoryForm: boolean
  // addNewTaskForm: boolean
  openTaskaddForm: boolean
  modifyTaskForm: boolean
  addEpicForm: FormGroup
  prjForm: FormGroup
  editEpicForm: FormGroup
  addStoryForm: FormGroup
  editStoryForm: FormGroup
  addTaskForm: FormGroup
  editTaskForm: FormGroup
  userName = JSON.parse(sessionStorage.getItem('loginData')).FName
  loginId = JSON.parse(sessionStorage.getItem('loginData')).LoginId
  newStoryDetails: any
  selectedProjectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
  listOfMapData: TreeNodeInterface[]
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {}
  document: any
  arr = []
  // duplicateAry: TreeNodeInterface[]
  // filtered: any[]
  // projecttitle1: any
  // editId: any
  // samparr: TreeNodeInterface[]
  // listOfData: any=[]

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
  //uSoryId: any
  ucreatedBy: any
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
  parentId: any
  assignedTo: any
  getOnlyTask: any
  uId: any
  addIcon: boolean
  ProjectName: string
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
    private msg: NzMessageService,
    private dataService: DataService,
    private route: Router,
  ) {}
  ngOnInit(): void {
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
      // modifiedBy : ['',[Validators.required,Validators.maxLength(25),Validators.pattern('^[a-zA-z ]*$')]],
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
      // epicid: ['',],
      // projectid: ['',],
      storyPoints: [
        '',
        [Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]*$')],
      ],
      storyType: ['', [Validators.required]],
      // type: ['',],
      // seqno: ['',],
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
      // modifiedby: ['']
    })
    this.editStoryForm = this.fb.group({
      //epicid: [''],
      //projectid: [''],
      storyPoints: [
        '',
        [Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]*$')],
      ],
      //type: [''],
      storyType: ['', [Validators.required]],
      seqNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
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
      //modifieddate: [''],
      //modifiedby: [''],
      //id: [''],
    })
    this.addTaskForm = this.fb.group({
      // ProjectId : [''],
      // Type : [''],
      // SeqNo : [''],
      name: [
        '',
        [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-z ]*$')],
      ],
      description: [
        '',
        [Validators.required, Validators.maxLength(225), Validators.pattern('^[a-zA-z0-9 .]*$')],
      ],
      endDate: ['', [Validators.required]],
      // Duration : [''],
      // Predecessors : [''],
      assignedTo: [
        '',
        [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-z ]*$')],
      ],
      // CreatedBy : [''],
      // modifiedBy : [''],
      // StoryId : [''],
      status: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      // uploadfile : [''],
      // ModifiedDate : [''],
      startDate: ['', [Validators.required]],
    })

    this.editTaskForm = this.fb.group({
      status: ['', [Validators.required]],
      seqNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      description: [
        '',
        [Validators.required, Validators.maxLength(225), Validators.pattern('^[a-zA-Z0-9 .,]*$')],
      ],
      priority: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      name: [
        '',
        [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      startDate: ['', [Validators.required]],
      predecessors: [
        '',
        [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ,.]*$')],
      ],
    })
    this.getTableData()
    this.ProjectName = sessionStorage.getItem('pName')
    //this.getAllTasks();
  }

  // getAllTasks() {
  // this.dataService.getMyTasks(apis.getMytasks, this.loginId,this.selectedProjectId).subscribe(res => {
  // this.getOnlyTask = res
  // console.log(res)
  // })
  // }

  ////////////////////////////////Get Hirearchy//////////////////////////////////////////
  getTableData() {
    this.dataService.getHierarchy(apis.scope, this.selectedProjectId).subscribe((res: any) => {
      console.log(res), (this.listOfMapData = res)
      // if(res[0].type=='E' || res[0].type=='S'){
      // this.addIcon=true
      // }
      // else{
      // this.addIcon=false
      // }
      // console.log('gridData', this.listOfMapData);
      this.listOfMapData.forEach(item => {
        // console.log('loop', item.id)
        this.mapOfExpandedData[item.id] = this.convertTreeToList(item)
        // console.log('map data', this.mapOfExpandedData)
      })
    })
  }
  ////////////////////////////////To add a new Epic ////////////////////////////////////////
  addEpic() {
    this.openEpicAddForm = true
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
      console.log(res)
    })
    this.openEpicAddForm = false
    this.getTableData()
    this.addEpicForm.reset()
    this.getTableData()
  }
  //////////////////////////To add a new Story or new Task//////////////////////////////////
  addchildRow(data) {
    console.log(data)

    if (data.type == 'E') {
      this.openStoryForm = true
      this.epicId = data.id
    } else {
      console.log()
      this.openTaskaddForm = true
      this.storyId = data.id
      this.epicId = data.epicId
    }
  }
  addingTask() {
    let newtaskDetails = {
      //"parentId" : this.epicId,
      projectId: this.selectedProjectId,
      type: 'T',
      seqNo: 20,
      name: this.addTaskForm.controls.name.value,
      description: this.addTaskForm.controls.description.value,
      endDate: this.addTaskForm.controls.endDate.value,
      predecessors: 'predecessors',
      assignedTo: this.addTaskForm.controls.assignedTo.value,
      createdBy: this.userName,
      storyId: this.storyId,
      status: this.addTaskForm.controls.status.value,
      priority: this.addTaskForm.controls.priority.value,
      startDate: this.addTaskForm.controls.startDate.value,
    }
    console.log(newtaskDetails)

    this.dataService.post(apis.newTask, newtaskDetails).subscribe(res => {
      console.log(res)
    })
    this.openTaskaddForm = false
    this.addTaskForm.reset()
    this.getTableData()
  }
  addingStory() {
    this.newStoryDetails = {
      epicId: this.epicId,
      projectId: this.selectedProjectId,
      storyPoints: this.addStoryForm.controls.storyPoints.value,
      type: 'S',
      seqNo: 44,
      tags: this.addStoryForm.controls.tags.value,
      title: this.addStoryForm.controls.title.value,
      description: this.addStoryForm.controls.description.value,
      documentId: this.addStoryForm.controls.documentId.value,
      artifactId: this.addStoryForm.controls.artifactId.value,
      createdBy: this.addStoryForm.controls.createdBy.value,
      storyType: this.addStoryForm.controls.storyType.value,
    }
    this.dataService.post(apis.newStory, this.newStoryDetails).subscribe(res => {
      console.log(res)
    })
    this.openStoryForm = false
    this.addStoryForm.reset()
    this.getTableData()
  }
  /////////////////////////To patch a Epic or Story or Task//////////////////////////////////
  editRow(data) {
    console.log(data)

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
      this.editStoryForm.get('storyPoints').patchValue(data.storyPoints),
        this.editStoryForm.get('seqNo').patchValue(data.seqNo),
        this.editStoryForm.get('tags').patchValue(data.tags),
        this.editStoryForm.get('title').patchValue(data.title),
        this.editStoryForm.get('description').patchValue(data.description),
        this.editStoryForm.get('documentId').patchValue(data.documentId),
        this.editStoryForm.get('artifactId').patchValue(data.artifactId),
        this.editStoryForm.get('createdBy').patchValue(data.createdBy),
        this.editStoryForm.get('storyType').patchValue(data.Storytype)
    } else {
      console.log(data)
      this.modifyTaskForm = true
      this.modifyTaskForm = true
      this.parentId = data.ParentId
      this.storyId = data.StoryId
      this.uId = data.Id
      this.assignedTo = data.AssignedTo
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
      console.log(res)
    })
    this.getTableData()
    this.modifyEpicForm = false
    this.getTableData()
  }
  updatingStory() {
    let modifyStory = {
      epicId: this.uEpicId,
      projectId: this.selectedProjectId,
      storyPoints: this.editStoryForm.controls.storyPoints.value,
      stotyType: this.editStoryForm.controls.storyType.value,
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
      console.log(res)
    })
    this.modifyStoryForm = false
    this.getTableData()
  }
  updatingtask() {
    let modifyTask = {
      // parentId:this.parentId,
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
      assignedTo: this.assignedTo,
      type: 'T',
      uploadfile: '',
      predecessors: this.editTaskForm.controls.predecessors.value,
      storyId: this.storyId,
      id: this.uId,
      modifiedBy: this.userName,
    }
    console.log(modifyTask)
    this.dataService.post(apis.updateMyTask, modifyTask).subscribe(res => {
      console.log(res)
    })
    this.modifyTaskForm = false
    this.getTableData()
  }
  //////////////////////////////////To Delete Epic or story or Task//////////////////////////////////////////
  deleteRow(data) {
    if (data.type == 'E') {
      console.log(data)

      let deleteEpic = {
        id: data.id,
      }
      this.dataService.post(apis.deleteEpic, deleteEpic).subscribe(res => {
        console.log(res)
      })
      this.getTableData()
    } else if (data.type == 'S') {
      let deleteStory = {
        id: data.id,
      }
      this.dataService.post(apis.deleteStory, deleteStory).subscribe(res => {
        console.log(res)
      })
      this.getTableData()
    } else {
      console.log(data)
      console.log(data.Id)

      let deleteTask = {
        id: data.Id,
      }
      this.dataService.post(apis.deleteMyTask, deleteTask).subscribe(res => {
        console.log(res)
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
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
