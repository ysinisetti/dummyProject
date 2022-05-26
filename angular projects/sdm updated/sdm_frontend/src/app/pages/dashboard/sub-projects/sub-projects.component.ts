import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table'
import { HostListener } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { HttpClient } from '@angular/common/http'

export interface SubProjectsArray {
  ParentId: string
  Status: string
  SeqNo: number
  Description: string
  CreatedBy: string
  Priority: string
  ProjectId: number
  Duration: number
  ModifiedDate: string
  ModifiedBy: string
  EndDate: string
  Name: string
  StartDate: string
  AssignedTo: string
  Type: string
  CreatedDate: string
  Predecessors: string
  StoryId: number
  Id: number
  level?: number
  expand?: boolean
  child: SubProjectsArray[]
}

export interface DataItem {
  ParentId: string
  Status: string
  SeqNo: number
  Description: string
  CreatedBy: string
  Priority: string
  ProjectId: number
  Duration: number
  ModifiedDate: string
  ModifiedBy: string
  EndDate: string
  Name: string
  StartDate: string
  AssignedTo: string
  Type: string
  CreatedDate: string
  Predecessors: string
  StoryId: number
  Id: number
  level?: number
  expand?: boolean
  child: SubProjectsArray[]
}

// interface ColumnItem {
//   name: string;
//   sortOrder?: NzTableSortOrder;
//   sortFn?: NzTableSortFn;
//   sortDirections?: NzTableSortOrder[];
// }

@Component({
  selector: 'app-sub-projects',
  templateUrl: './sub-projects.component.html',
  styleUrls: ['./sub-projects.component.scss'],
})
export class SubProjectsComponent implements OnInit {
  tableData: DataItem[]
  samparr = []
  isVisibleMiddle = false
  taskEditForm: FormGroup
  editsamp = {}
  isVisible1 = false
  public newRecordType
  validateForm: FormGroup
  searchForm: FormGroup
  mapOfExpandedData: { [key: string]: Array<any> } = {}
  temp: any = []
  Data11 = {}
  startDate: string
  endDate: string

  selectedType: string
  pageNum: number
  pageSize: number
  noOfRecords: number
  totalPages: number
  searchTerm: string
  subprojects = []
  type = {
    T: 'Task',
    S: 'Sub-Project',
    M: 'Milestone',
    D: 'Deliverable',
  }

  optionList

  cusName: any
  proName: any
  delData: any
  addData: any
  addDocData: any
  parentid: any
  projectId: any
  updateddata: any
  enableDeliverable: boolean
  ProjectName: string
  enableSubject: boolean
  listOfResources = []
  editResources = []
  size: NzSelectSizeType = 'default'
  editStartDate: Date
  header = 'Search'
  newData: Object
  dropdownType = [
    { label: 'Task', value: 'T' },
    { label: 'Sub-Project', value: 'S' },
    { label: 'Milestone', value: 'M' },
  ]

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getSubprojects()
    }
  }

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private nzMessageService: NzMessageService,
    private router: Router,
    private http: HttpClient,
    private notification: NzNotificationService,
    private dataservice: DataService,
    private route: Router,
  ) {
    this.taskEditForm = this.fb.group({
      sDate2: [null, [Validators.required]],
      eDate2: [null, [Validators.required]],
      type: [null, [Validators.required]],
      assignedTo: [null, [Validators.required]],
      title: [
        null,
        [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      description: [null, [Validators.required, Validators.maxLength(225)]],
    })

    this.validateForm = this.fb.group({
      taskName: [
        null,
        [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      StartDate1: [new Date(), [Validators.required]],
      EndDate1: [null, [Validators.required]],
      taskAssingedTo: [null, [Validators.required]],
      desc: [null, [Validators.required, Validators.maxLength(225)]],
      remember: [true],
    })
    this.searchForm = this.fb.group({
      searchValue: [null],
      searchDate: [null],
      searchType: [null],
      searchStartDate: [null],
      searchEndDate: [null],
    })
  }

  collapse(array, data, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach(d => {
          const target = array.find(a => a.Id === d.Id)!
          target.expand = false
          this.collapse(array, target, false)
        })
      } else {
        return
      }
    }
  }

  convertTreeToList(root) {
    const stack = []
    const array = []
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

  visitNode(node, hashMap: { [Id: string]: boolean }, array): void {
    if (!hashMap[node.Id]) {
      hashMap[node.Id] = true
      array.push(node)
    }
  }

  ngOnInit(): void {
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.cusName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.proName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    console.log('id', this.projectId)
    this.pageSize = 10
    this.pageNum = 1
    this.totalPages = 20
    this.getSubprojects()
    this.getProTypeData()
    this.ProjectName = sessionStorage.getItem('pName')
    this.getAllResources()
  }

  typeSelected: string

  getSubprojects() {
    console.log('searchValu', this.searchForm.get('searchValue').value)
    console.log('this.searchForm', this.searchForm.value)
    if (this.searchForm.get('searchStartDate').value) {
      this.startDate = new Date(this.searchForm.get('searchStartDate').value)
        .toISOString()
        .substring(0, 10)
    }
    if (this.searchForm.get('searchEndDate').value) {
      this.endDate = new Date(this.searchForm.get('searchEndDate').value)
        .toISOString()
        .substring(0, 10)
    }

    var reqBody = {
      name: this.searchForm.get('searchValue').value,
      type: this.searchForm.get('searchType').value,
      assignedTo: '',
      endDate: this.endDate,
      startDate: this.startDate,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      projectId: this.projectId,
    }
    console.log('reqBody', reqBody)
    this.dataservice.getSubprojects(apis.subprojects, reqBody).subscribe(res => {
      console.log('res', res)
      this.noOfRecords = res[0].count
      this.totalPages = this.noOfRecords
      this.tableData = res[0].data
      this.tableData.forEach(item => {
        this.mapOfExpandedData[item.Id] = this.convertTreeToList(item)
      })
    })
  }

  getAllResources() {
    const children: Array<{ label: string; value: string }> = []
    const body = {
      projectId: this.projectId,
      resourceName: '',
      resourceTitle: '',
      startDate: '',
      endDate: '',
      resourceType: '',
      pageNum: 1,
      pageSize: 5,
    }
    this.dataservice.post(apis.resource, body).subscribe((res: any) => {
      this.listOfResources = res[0].data
      console.log('gridData', this.listOfResources, res)
      this.listOfResources.forEach(x => {
        children.push({ label: x.resourceName, value: x.resourceName })
      })
      this.listOfResources = children
      console.log('list of resources', this.listOfResources)
    })
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.tableData, event.previousIndex, event.currentIndex)
  }

  deleteRow(itemId): void {
    const body = {
      id: itemId,
    }
    this.dataservice.post(apis.deleteSubproject, body).subscribe(res => {
      console.log('delete res', res)
      this.delData = res
      // setTimeout(() => {
      // this.getSubprojects()
      // }, 2000)
      this.getSubprojects()
      if (this.delData['Result'] == 'deleted Successfully') {
        this.notification.create(
          'success',
          'Successfully Deleted',
          'Your data has been successfully deleted',
        )
      }
    })
  }

  showModalMiddle(data): void {
    this.isVisibleMiddle = true
    this.temp = data
    this.parentid = this.temp.Id
    if (data.Type === 'M') {
      this.enableDeliverable = true
    }
    if (data.Type === 'S') {
      this.enableSubject = true
    }
  }

  handleOkMiddle(): void {
    console.log('added data', this.temp)
    console.log('category', this.newRecordType)
    if (this.newRecordType === 'Task') this.selectedType = 'T'
    else if (this.newRecordType === 'SubProject') this.selectedType = 'S'
    else if (this.newRecordType === 'Deliverable') this.selectedType = 'D'
    else this.selectedType = 'M'
    let loginName = JSON.parse(sessionStorage.getItem('loginData')).FName
    this.Data11 = {
      parentId: this.parentid,
      status: 'active',
      seqNo: 6,
      description: this.validateForm.get('desc').value,
      createdBy: loginName,
      priority: ' ',
      projectId: this.projectId,
      name: this.validateForm.get('taskName').value,
      startDate: this.validateForm.get('StartDate1').value,
      assignedTo: this.validateForm.get('taskAssingedTo').value.join(),
      type: this.selectedType,
      endDate: this.validateForm.get('EndDate1').value,
      uploadfile: null,
      predecessors: ' ',
      storyId: 0,
    }
    console.log('check', this.Data11)

    this.dataservice.post(apis.AddSubproject, this.Data11).subscribe(res => {
      console.log('res', res)
      this.newData = res
      this.getSubprojects()
      if (this.newData['success'] === 'Record inserted successfully') {
        this.notification.create(
          'success',
          'Successfully Created',
          'Your data has been successfully Added',
        )
      }
    })

    this.isVisibleMiddle = false
    this.enableDeliverable = false
    this.enableSubject = false
    this.validateForm.reset()
    this.newRecordType = ''
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false
    this.enableDeliverable = false
    this.enableSubject = false
    this.validateForm.reset()
    this.newRecordType = ''
  }
  showGlobalAdd() {
    this.parentid = null
    this.isVisibleMiddle = true
    this.enableDeliverable = false
    this.enableSubject = false
  }
  editRow(data: string): void {
    this.isVisible1 = true
    this.editsamp = data
    this.editStartDate = new Date(data['StartDate'])
    console.log('date start', this.editStartDate)
    const children: Array<{ label: string; value: string }> = []
    this.editResources = data['AssignedTo'].split(',')
    console.log('splited', data['AssignedTo'].split(','))
    this.taskEditForm.get('title').patchValue(data['Name'])
    this.taskEditForm.get('sDate2').patchValue(data['StartDate'])
    this.taskEditForm.get('eDate2').patchValue(data['EndDate'])
    this.taskEditForm.get('type').patchValue(data['Type'])
    // this.taskEditForm.get('assignedTo').patchValue(data['AssignedTo'])
    this.taskEditForm.get('description').patchValue(data['Description'])
    console.log('edit id data', this.editsamp, this.editsamp['Type'])
  }

  Update(): void {
    this.isVisible1 = false

    console.log('editForm', this.taskEditForm.value)
    const body = {
      parentId: this.editsamp['ParentId'],
      status: this.editsamp['Status'],
      seqNo: this.editsamp['SeqNo'],
      description: this.taskEditForm.get('description').value,
      createdBy: this.editsamp['CreatedBy'],
      priority: this.editsamp['Priority'],
      projectId: this.editsamp['ProjectId'],
      modifiedBy: this.editsamp['ModifiedBy'],
      endDate: this.taskEditForm.get('eDate2').value,
      name: this.taskEditForm.get('title').value,
      startDate: this.taskEditForm.get('sDate2').value,
      assignedTo: this.taskEditForm.get('assignedTo').value.join(),
      type: this.taskEditForm.get('type').value,
      uploadfile: this.editsamp['uploadfile'],
      createdDate: this.editsamp['CreatedDate'],
      predecessors: this.editsamp['Predecessors'],
      storyId: this.editsamp['StoryId'],
      id: this.editsamp['Id'],
    }

    console.log('edited', this.editsamp)
    this.dataservice.post(apis.updateSubproject, body).subscribe(res => {
      console.log('update res', res)
      this.addData = res

      if (this.addData['success'] == 'updated successfully') {
        this.notification.create(
          'success',
          'Successfully Updated',
          'Your data has been successfully Updated',
        )
      }
      this.getSubprojects()
    })
  }

  UpdateCancel(): void {
    console.log('Update Button cancel clicked!')
    this.isVisible1 = false
  }

  listOfColumn = [
    {
      title: 'TITLE',
      width: '400px',
      compare: (a: DataItem, b: DataItem) => a.Name.localeCompare(b.Name),
      priority: 1,
    },
    {
      title: 'TYPE',
      width: '75px',
      compare: (a: DataItem, b: DataItem) => a.Type.localeCompare(b.Type),
      priority: 3,
    },
    {
      title: 'START DATE',
      width: '100px',
    },
    {
      title: 'END DATE',
      width: '100px',
    },
    {
      title: 'DURATION',
      width: '100px',
      compare: (a: DataItem, b: DataItem) => a.Duration - b.Duration,
      priority: 2,
    },
    {
      title: 'ASSIGNED TO',
      width: '100px',
      compare: (a: DataItem, b: DataItem) => a.AssignedTo.localeCompare(b.AssignedTo),
      priority: 1,
    },
    {
      title: 'ACTION',
    },
  ]

  //Start and end date functionality
  startValue: Date | null = null
  endValue: Date | null = null
  endOpen = false
  current = new Date()
  actualDate = new Date(this.current.getTime() - 24 * 60 * 60 * 1000)

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue) {
      return false
    }
    return startValue.getTime() < this.actualDate.getTime()
  }

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue) {
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
    this.route.navigate(['/dashboard/projectDetails', this.proName])
  }

  startValue1: Date | null = null
  endValue1: Date | null = null
  endOpen1 = false

  disabledStartDate1 = (startValue: Date): boolean => {
    if (!startValue) {
      return false
    }
    return startValue.getTime() < this.editStartDate.getTime()
  }

  disabledEndDate1 = (endValue: Date): boolean => {
    if (!endValue) {
      return false
    }
    return endValue.getTime() <= this.startValue1.getTime()
  }

  onStartChange1(date: Date): void {
    this.startValue1 = date
  }

  onEndChange1(date: Date): void {
    this.endValue1 = date
  }

  handleStartOpenChange1(open: boolean): void {
    if (!open) {
      this.endOpen1 = true
    }
  }

  handleEndOpenChange1(open: boolean): void {
    console.log(open)
    this.endOpen1 = open
  }

  getProTypeData() {
    this.http.get('http://localhost:8089/tasktype').subscribe(res => {
      console.log('dropdown', res)
      this.optionList = res
    })
  }

  //pagination
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getSubprojects()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.pageNum = 1
    this.getSubprojects()
  }

  onChange(): void {
    this.getSubprojects()
  }

  resetSearchFields() {
    this.searchForm.reset()
    this.getSubprojects()
  }
  gotoHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }

  details1() {
    // this.projectname = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.proName])
  }
}
