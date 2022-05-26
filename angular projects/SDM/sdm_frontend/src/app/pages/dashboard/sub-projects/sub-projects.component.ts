import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { Router, Route } from '@angular/router'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { NzSelectSizeType } from 'ng-zorro-antd/select'

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

@Component({
  selector: 'app-sub-projects',
  templateUrl: './sub-projects.component.html',
  styleUrls: ['./sub-projects.component.scss'],
})
export class SubProjectsComponent implements OnInit {
  tableData: SubProjectsArray[]
  samparr = []
  isVisibleMiddle = false
  taskEditForm: FormGroup
  editsamp = {}
  isVisible1 = false
  public newRecordType
  validateForm: FormGroup
  mapOfExpandedData: { [key: string]: Array<any> } = {}
  temp: any = []
  Data11 = {}
  selectedType: string
  subprojects = []
  type = {
    T: 'Task',
    S: 'Sub-Project',
    M: 'Milestone',
    D: 'Deliverable',
  }
  dropdownType = [
    { label: 'Task', value: 'T' },
    { label: 'Sub-Project', value: 'S' },
    { label: 'Milestone', value: 'M' },
  ]
  cusName
  proName
  parentid: any
  projectId: any
  enableDeliverable: boolean
  ProjectName: string
  enableSubject: boolean
  listOfResources = []
  editResources = []
  size: NzSelectSizeType = 'default'
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataservice: DataService,
    private route: Router,
  ) {
    this.taskEditForm = this.fb.group({
      sDate2: [null, [Validators.required]],
      eDate2: [null, [Validators.required]],
      type: [null, [Validators.required]],
      assignedTo: [null, [Validators.required]],
      title: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      description: [null, [Validators.required]],
    })

    this.validateForm = this.fb.group({
      taskName: [null, [Validators.required]],
      StartDate1: [new Date(), [Validators.required]],
      EndDate1: [null, [Validators.required]],
      taskAssingedTo: [null, [Validators.required]],
      desc: [null, [Validators.required]],
      remember: [true],
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
    this.getSubprojects()
    this.ProjectName = sessionStorage.getItem('pName')
    this.getAllResources()
  }

  getSubprojects() {
    this.dataservice.getSubprojects(apis.subprojects, this.projectId).subscribe(res => {
      console.log('res', res)
      this.tableData = res
      this.tableData.forEach(item => {
        this.mapOfExpandedData[item.Id] = this.convertTreeToList(item)
      })
    })
  }

  getAllResources() {
    const children: Array<{ label: string; value: string }> = []
    this.dataservice.get(apis.resource).subscribe((res: any) => {
      this.listOfResources = res
      console.log('gridData', this.listOfResources)
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
      this.getSubprojects()
    })
  }

  onSearch(event) {}

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
      this.getSubprojects()
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
    const children: Array<{ label: string; value: string }> = []
    this.editResources = data['AssignedTo'].split(',')
    console.log('splited', data['AssignedTo'].split(','))
    this.taskEditForm.get('title').patchValue(data['Name'])
    this.taskEditForm.get('duration').patchValue(data['Duration'])
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
      this.getSubprojects()
    })
  }

  UpdateCancel(): void {
    console.log('Update Button cancel clicked!')
    this.isVisible1 = false
  }

  //Start and end date functionality
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
