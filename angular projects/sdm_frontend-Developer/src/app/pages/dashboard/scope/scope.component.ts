import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { DataService } from 'src/app/data.service'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { Router } from '@angular/router'
import { apis } from 'src/app/api'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import { HostListener } from '@angular/core'
import { DatePipe } from '@angular/common'
import { NzNotificationService } from 'ng-zorro-antd/notification'
interface TreeNodeInterface {
  parent: any
  level: any
  child: any
  createdDate: string
  seqNo: number
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
  expand?: boolean
}
@Component({
  selector: 'app-scope',
  templateUrl: './scope.component.html',
  styleUrls: ['./scope.component.scss'],
  providers: [DatePipe],
})
export class ScopeComponent implements OnInit {
  selectedEpic=false
  customColors= [ 'The predecessor is the first task; it controls the start or end date for all related successor tasks'];
  openEpicAddForm: boolean
  modifyEpicForm: boolean
  openStoryForm: boolean
  modifyStoryForm: boolean
  openTaskaddForm: boolean
  modifyTaskForm: boolean
  addEpicForm: FormGroup
  prjForm: FormGroup
  selectForm: FormGroup
  editEpicForm: FormGroup
  addStoryForm: FormGroup
  editStoryForm: FormGroup
  addTaskForm: FormGroup
  editTaskForm: FormGroup
  searchForm: FormGroup
  userName = JSON.parse(sessionStorage.getItem('loginData')).FName
  loginId = JSON.parse(sessionStorage.getItem('loginData')).LoginId
  selectedProjectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
  listOfMapData: TreeNodeInterface[]
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {}
  document: any
  size: NzSelectSizeType = 'default'
  storyId: any
  epicId: any
  uEpicId: any
  createdDate: any
  ucreatedBy: any
  pageNum = 1
  pageSize = 5
  totalPages: number
  Category = [
    { label: 'Functional', value: 'Functional' },
    { label: 'Non-Functional', value: 'Non-Functional' },
  ]
  Type = {
    E: 'Epic',
    S: 'Story',
    T: 'Task',
  }
  header = 'Search'
  parentId: any
  assignedTo: any
  uId: any
  listOfResources: any
  ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName;
  customerName= JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName;
  storyType: any
  status: any
  priority: any
  selectCategory: boolean
  listOfDocuments: any
  projectId=JSON.parse(sessionStorage.getItem('projectDetails')).Id;
  epicDiv: boolean
  storyDiv: boolean
  selectDiv: boolean
  dropDown: boolean
  listOfEpics: any
  type: any
  disableEpicTag: boolean
  data: any
  title:any;
  fileList: NzUploadFile[] = []
  file: File
  isUploaded: boolean;
  storiesCount: any;
  epicStoriesCount: any;
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
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    ////////////Story type Dropdown
    this.dataService.get(apis.storyType).subscribe(res => {
      this.storyType = res
      console.log("Story Type Drop down",res);
    })
    ///////////Status dropdown
    this.dataService.get(apis.status).subscribe(res => {
      this.status = res
    })
    ///////////Priority dropdown
    this.dataService.get(apis.priority).subscribe(res => {
      this.priority = res
    })

    this.selectForm = this.fb.group({
      EorSForm: [null],
    })
    this.addEpicForm = this.fb.group({
      seqNo: ['', [Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      tags: ['', [Validators.maxLength(100), Validators.pattern('^[a-zA-z0-9 ]*$')]],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [ Validators.maxLength(255)]],
      createdBy: ['', [Validators.maxLength(25), Validators.pattern('^[a-zA-z ]*$')]],
    })
    this.editEpicForm = this.fb.group({
      seqNo: ['', [Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      tags: ['', [Validators.maxLength(100), Validators.pattern('^[a-zA-z0-9 ]*$')]],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [ Validators.maxLength(255)]],
    })
    this.addStoryForm = this.fb.group({
      storyPoints: [null, [Validators.maxLength(3), Validators.pattern('^[0-9]*$')]],
      storyType: [''],
      tags: ['', [Validators.maxLength(100), Validators.pattern('^[a-zA-z0-9 ]*$')]],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [ Validators.maxLength(1000)]],
      documentId: ['', [Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      artifactId: ['', [Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      createdBy: ['', [Validators.maxLength(25), Validators.pattern('^[a-zA-z ]*$')]],
      seqNo: ['', [Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      dependedEpic: [null],
      selectedEpic:[null]
    })
    this.editStoryForm = this.fb.group({
      dependedEpic: [null],
      storyPoints: [null, [Validators.maxLength(3), Validators.pattern('^[0-9]*$')]],
      storyType: [null],
      seqNo: [null, [Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      tags: [null, [Validators.maxLength(100), Validators.pattern('^[a-zA-z0-9 ]*$')]],
      title: [null, [Validators.required, Validators.maxLength(100)]],
      description: [null, [ Validators.maxLength(1000)]],
      documentId: [null, [Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      artifactId: [null, [Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
    })
    this.addTaskForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(50)]],
      description: [null, [Validators.maxLength(255)]],
      endDate: [null],
      assignedTo: [null],
      status: [null],
      priority: [null],
      startDate: [null],
      selectedStory: [null],
      predecessors: [null, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ,.]*$')]],
      seqNo: [null, [Validators.maxLength(11), Validators.pattern('^[0-9]*$')]],
    })
    this.editTaskForm = this.fb.group({
      status: [null],
      seqNo: [null, [Validators.maxLength(11), Validators.pattern('^[0-9]*$')]],
      description: [
        null,
        [Validators.required, Validators.maxLength(255), Validators.pattern('^[a-zA-Z0-9 .,]*$')],
      ],
      priority: [null],
      endDate: [null],
      name: [null, [Validators.required, Validators.maxLength(50)]],
      startDate: [null],
      predecessors: [null, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ,.]*$')]],
      assignedTo: [null],
    })
    this.searchForm = this.fb.group({
      searchValue: [null],
      searchDate: [null],
    })
    this.getTableData()
    this.getContacts()
    this.getEpics()
    this.getDocuments()
    this.getStoryCount('')
  }
getStoryCount(item){
  let reqBody={
    "projectId":this.selectedProjectId,
    "epicId":item
  }
  this.dataService.post(apis.storyCount,reqBody).subscribe((res)=>{
    console.log(res);
    this.storiesCount=res[0][0].storycount;
    this.epicStoriesCount=res[1][0].count;
    console.log(this.storiesCount);
    console.log(this.epicStoriesCount);
  })
}
  selectOptions = [
    { label: 'Epic', value: 'E' },
    { label: 'Story', value: 'S' },
  ]
  openAdd() {
    this.selectDiv = true
    this.dropDown = true
  }
  openSelectedForm(event) {
    this.disableEpicTag = true
    this.type = event
    if (event === 'E') {
      this.title="Add Epic"
      this.epicDiv = true
      this.dropDown = true
      this.storyDiv = false
    } else if (event === 'S') {
      this.title="Add Story"
      this.storyDiv = true
      this.dropDown = true
      this.epicDiv = false
    }
  }
  newEpicOrStory() {
        if (this.type === 'E') {
      this.newEpic()
    } else if (this.type === 'S') {
      this.addingStory()
    }
  }
  ////////////////////////////////Get Hirearchy//////////////////////////////////////////
  getTableData() {
    const title = this.searchForm.controls.searchValue.value
      if (this.searchForm.get('searchDate').value) {
       var createdDate = new Date(this.searchForm.get('searchDate').value)
          .toISOString()
          .substring(0, 10)
      }
    let reqBody = {
      createdDate: createdDate === null || createdDate === undefined ? '' : createdDate,
      title: title === null || title === undefined ? '' : title,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      projectId: this.selectedProjectId,
    }
    this.dataService.post(apis.scope, reqBody).subscribe((res: any) => {
      this.listOfMapData = res[0].data
      this.totalPages = res[0].count
      this.listOfMapData.forEach(item => {
      this.mapOfExpandedData[item.id] = this.convertTreeToList(item)
      })
    })
  }
  ///////////////////////////Get All Contacts//////////////////////////////////////////////
  getContacts() {
    const children: Array<{ label: string; value: string }> = []
    this.dataService.getIssuesById(apis.allResources, this.projectId).subscribe((res: any) => {
      this.listOfResources = res
      this.listOfResources.forEach(x => {
        children.push({ label: x.resourceName, value: x.UserName })
      })
      this.listOfResources = children
    })
  }
  getEpics() {
    const child = []
    this.dataService.getIssuesById(apis.getOnlyEpics, this.projectId).subscribe((res: any) => {
      this.listOfEpics = res
      this.listOfEpics.forEach(y => {
        child.push({ label: y.title, value: y.id })
      })
      this.listOfEpics = child
    })
  }
  //////////////////////////Get All Documents/////////////////////////////////////////////
  getDocuments() {
    const children = []
    this.dataService.getIssuesById(apis.requiredDocuments, this.projectId).subscribe((res: any) => {
      this.listOfDocuments = res
      this.listOfDocuments.forEach(x => {
        children.push({ label: x.fileName, value: x.fileName })
      })
      this.listOfDocuments = children
      console.log(this.listOfDocuments)
    })
  }
  ////////////////Validating form
  submitAdd(){
      for (const i in this.addEpicForm.controls) {
            this.addEpicForm.controls[i].markAsTouched()
            this.addEpicForm.controls[i].updateValueAndValidity()
          }
      for (const i in this.addTaskForm.controls) {
            this.addTaskForm.controls[i].markAsTouched()
            this.addTaskForm.controls[i].updateValueAndValidity()
          }
      for (const i in this.addStoryForm.controls) {
            this.addStoryForm.controls[i].markAsTouched()
            this.addStoryForm.controls[i].updateValueAndValidity()
          }
  }
  ////////////////////////////////To add a new Epic ////////////////////////////////////////
  newEpic() {
    if (this.addEpicForm.untouched) {
      this.epicDiv=true
      this.submitAdd()
    }
    if(this.addEpicForm.valid){
    let newEpicDetails = {
      projectId: this.selectedProjectId,
      taskId: 2,
      seqNo: this.addEpicForm.controls.seqNo.value,
      tags: this.addEpicForm.controls.tags.value,
      title: this.addEpicForm.controls.title.value,
      description: this.addEpicForm.controls.description.value,
      createdBy: this.addEpicForm.controls.createdBy.value,
    }
    this.dataService.post(apis.newEpic, newEpicDetails).subscribe(res => {
      this.getTableData()
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
    })
    this.selectDiv = false
    this.storyDiv = false
    this.epicDiv = false
    this.openEpicAddForm = false
    this.selectForm.reset()
    this.addEpicForm.reset()
    this.getTableData()
  }
}
  //////////////////////////To add a new Story or new Task//////////////////////////////////
  addchildRow(data) {
  this.selectedEpic=true;
  this.addStoryForm.get('selectedEpic').patchValue(data.title)
  this.dropDown=false
    if (data.type === 'E') {
      this.type='S';
      this.selectDiv = true
      this.storyDiv = true
      this.epicId = data.id
    } else {
      this.addTaskForm.get('selectedStory').patchValue(data.title)
      this.openTaskaddForm = true
      this.storyId = data.id
      this.epicId = data.epicId
    }
    this.disableEpicTag = false
  }
  addingTask() {
    if (this.addTaskForm.untouched) {
      this.openTaskaddForm=true
      this.submitAdd()
    }
    if(this.addTaskForm.valid){
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
    this.dataService.post(apis.newTask, newtaskDetails).subscribe(res => {
      this.getTableData()
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
      }
    })
    this.openTaskaddForm = false
    this.addTaskForm.reset()
    this.getTableData()
  }
}

onFileChange($event: { file: NzUploadFile }): void {
  if($event.file.type == "done"){
   this.isUploaded = true
     this.file = $event.file.originFileObj
   }
}
 addingStory() {
   if (this.addStoryForm.untouched) {
     this.submitAdd()
   }
   if(this.addStoryForm.valid){
   const formData = new FormData()
   formData.append('files',this.file)
   var id = this.addStoryForm.get('dependedEpic').value;
   const newStoryDetails = {
     epicId: this.epicId === null || this.epicId === undefined || this.epicId === '' ? id : this.epicId,
     projectId: this.selectedProjectId,
     storyPoints: this.addStoryForm.controls.storyPoints.value,
     seqNo: this.addStoryForm.controls.seqNo.value,
     tags: this.addStoryForm.controls.tags.value,
     title: this.addStoryForm.controls.title.value,
     description: this.addStoryForm.controls.description.value,
     documentName: this.addStoryForm.controls.documentId.value,
     artifactId: this.addStoryForm.controls.artifactId.value,
     createdBy: this.userName,
     storyType: this.addStoryForm.controls.storyType.value,
   }
   formData.append('data', new Blob([JSON.stringify(newStoryDetails)],
   {
   type: "application/json"
   }));
   this.dataService.post(apis.postStory, formData).subscribe(res => {
     if (res.hasOwnProperty('success') === true) {
       this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
     } else {
       this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
       this.selectForm.reset()
     }
   })
   this.selectDiv = false
   this.storyDiv = false
   this.epicDiv = false
   this.selectForm.reset()
   this.addStoryForm.reset()
   this.getTableData()
 }
 }
  downloadFile(path,name){
    const newPath = path.replace(/\\/g, '/') + '/' + name
    window.open(apis.downloadArtifact + '?' + 'filePath=' + newPath)
    }
  /////////////////////////To patch a Epic or Story or Task//////////////////////////////////
  editRow(data) {
    if (data.type == 'E') {
         this.modifyEpicForm = true
      this.uEpicId = data.id
      this.ucreatedBy = data.createdBy
      this.modifyEpicForm = true
      this.editEpicForm.get('seqNo').patchValue(data.seqNo),
        this.editEpicForm.get('tags').patchValue(data.tags),
        this.editEpicForm.get('title').patchValue(data.title),
        this.editEpicForm.get('description').patchValue(data.description)
    } else if (data.type == 'S') {
      this.storyId = data.id
      this.ucreatedBy = data.createdBy
      this.uEpicId = data.epicId
      this.modifyStoryForm = true
      this.editStoryForm.get('storyPoints').patchValue(data.storyPoints.toString()),
        this.editStoryForm.get('seqNo').patchValue(data.seqNo),
        this.editStoryForm.get('tags').patchValue(data.tags),
        this.editStoryForm.get('title').patchValue(data.title),
        this.editStoryForm.get('description').patchValue(data.description),
        this.addStoryForm.get('documentId').patchValue(data.documentName === null || data.documentName === "" || data.documentName === undefined ? null : this.listOfDocuments.filter(x => x.value === data.documentName)[0].value)
        this.editStoryForm.get('artifactId').patchValue(data.artifactId),
        this.editStoryForm
 .get('storyType')
 .patchValue(data.Storytype === null ||data.Storytype === "" ||data.Storytype === undefined ? null : this.storyType.filter(x => x.Value === data.Storytype)[0].Value)

    } else {
      this.modifyTaskForm = true
      this.modifyTaskForm = true
      this.parentId = data.ParentId
      this.storyId = data.StoryId
      this.uId = data.Id
      this.createdDate = data.createdDate
      this.assignedTo = data.AssignedTo.split(',')
      // this.editTaskForm.get('status').patchValue(data.Status),

        this.editTaskForm.get('seqNo').patchValue(data.seqNo),
        this.editTaskForm.get('description').patchValue(data.description),
        // this.editTaskForm.get('priority').patchValue(data.Priority),

        this.editTaskForm.get('endDate').patchValue(data.EndDate),
        this.editTaskForm.get('name').patchValue(data.title),
        this.editTaskForm.get('startDate').patchValue(data.StartDate),
        this.editTaskForm.get('predecessors').patchValue(data.Predecessors)
        this.editTaskForm
        .get('status')
        .patchValue(this.data.Status === null || this.data.Status === "" || this.data.Status === undefined ? null : this.status.filter(x => x.optionKey === this.data.Status)[0].optionKey)
        this.editTaskForm
        .get('priority')
        .patchValue(this.data.Priority === null || this.data.Priority === "" || this.data.Priority === undefined ? null : this.priority.filter(x => x.optionKey === this.data.Priority)[0].optionKey)

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
      projectId: this.selectedProjectId,
      taskId: 2,
      tags: this.editEpicForm.controls.tags.value,
    }
    this.dataService.post(apis.updateEpic, modifingEpic).subscribe(res => {
      this.getTableData()
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
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
      seqNo: this.editStoryForm.controls.seqNo.value,
      tags: this.editStoryForm.controls.tags.value,
      title: this.editStoryForm.controls.title.value,
      description: this.editStoryForm.controls.description.value,
      documentName: this.editStoryForm.controls.documentId.value,
      artifactId: this.editStoryForm.controls.artifactId.value,
      createdBy: this.ucreatedBy,
      modifiedBy: this.userName,
      id: this.storyId,
    }
    this.dataService.post(apis.updateStory, modifyStory).subscribe(res => {
      this.getTableData()
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
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
        this.listOfMapData.length === 1 ? this.pageNum = this.pageNum -1 : this.pageNum
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('error', 'Not Deleted', 'Record Not Deleted')
        } else {
          this.notification.create('success', 'Deleted Successfully', 'Epic is Deleted')
          this.getTableData()
        }
      })
    } else if (data.type == 'S') {
      let deleteStory = {
        id: data.id,
      }
      this.dataService.post(apis.deleteStory, deleteStory).subscribe(res => {
        this.getTableData()
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('error', 'Not Deleted', 'Record Not Deleted')
        } else {
          this.notification.create('success', 'Deleted Successfully', 'Story is Deleted')
        }
      })
      this.getTableData()
    } else {
      let deleteTask = {
        id: data.Id,
      }
      this.dataService.post(apis.deleteMyTask, deleteTask).subscribe(res => {
        this.getTableData()
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('error', 'Not Deleted', 'Record Not Deleted')
        } else {
          this.notification.create('success', 'Deleted Successfully', 'Task is Deleted')
        }
      })
      this.getTableData()
    }
  }
  cancel() {
    this.searchForm.reset()
    this.getTableData()
    this.selectDiv = false
    this.openTaskaddForm = false
    this.openEpicAddForm = false
    this.modifyEpicForm = false
    this.openStoryForm = false
    this.modifyStoryForm = false
    this.selectForm.reset()
    this.epicDiv=false
    this.storyDiv=false
    this.modifyTaskForm = false
    this.selectCategory = false
    this.addStoryForm.reset()
    this.addTaskForm.reset()
    this.addEpicForm.reset()
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
  /////////BreadCrumb
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  details() {
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  ///////pagination
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
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfMapData, event.previousIndex, event.currentIndex)
    console.log(event, this.listOfMapData)
  }
  getColor(type) {
    switch (type) {
    case 'E':
    return 'rgb(27, 45, 206)'
    case 'S':
    return '#00aae7'
    case 'T':
    return 'purple'
    }
    }
}
