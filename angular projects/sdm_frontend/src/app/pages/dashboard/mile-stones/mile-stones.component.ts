import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { _ACTIVE_RUNTIME_CHECKS } from '@ngrx/store/src/tokens'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { DatePipe } from '@angular/common'

export interface subarray {
  Id: number
  Title: string
  Description: string
  attachment: string
  Status: string
  ModifiedBy: string
  ModifiedDate: string
  //
}

@Component({
  selector: 'app-mile-stones',
  templateUrl: './mile-stones.component.html',
  styleUrls: ['./mile-stones.component.scss'],
  providers: [DatePipe],
})
export class MileStonesComponent implements OnInit {
  i = 0
  visible = false
  isVisible = false
  isVisible1 = false
  isVisible2 = false
  searchValue = ''
  searchTerm: string
  pageNum: Number
  pageSize: Number
  totalPages: Number

  editId: string | null = null
  editCache: { [key: string]: { edit: boolean; data } } = {}
  // Type = {
  //   T: 'Task',
  //   S: 'Deliverables',
  // }
  // status = [
  //   { label: 'Active', value: 't' },
  //   { label: 'In-Active', value: 'm' },
  // ]
  // map = {
  //   t: 'Active',
  //   m: 'In-active',
  // }

  tableData = []
  arr = []
  filtered = []
  gridData = []
  taskForm = false
  Deliverables = false

  public newRecordType
  prjForm: FormGroup
  addForm: FormGroup
  addDevForm: FormGroup
  validateForm: FormGroup
  validateDevForm: FormGroup
  Task: boolean
  devForm: FormGroup
  optionForm: FormGroup
  editmileForm: FormGroup
  searchForm: FormGroup
  visiblEdit: boolean = false
  samparr: any[]
  submitted = false
  type: any = 'M'
  parentID: any
  deliverid: any = []
  deliverabledata: any
  logData: any
  name: string = ''
  Cdate: Date
  cName: any
  pName: any
  projectId: any
  ProjectName: string
  editStartDate: Date
  newprojectId: any
  startDate: string
  endDate: string
  sortName: string
  startValues = null
  addResponse: any
  deleteResponse: Object
  updateResult: any
  addDeliverableResult: any
  noOfRecords: number
  records: any
  listOfData: any
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataservice: DataService,
    private notification: NzNotificationService,
    private route: Router,
    private datePipe: DatePipe,
  ) {}
  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key
    this.startValues = sort.value
    this.search()
  }

  mapOfExpandedData: { [key: string]: Array<any> } = {}
  expandSet = new Set<number>()
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id)
    } else {
      this.expandSet.delete(id)
    }
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
    console.log('Tree-List')
    const stack = []
    const array = []
    const hashMap = {}
    console.log('convet to list', root.level, root.child, root.expand)
    stack.push({ ...root, level: 0, expand: false })
    console.log('stack data', stack)
    while (stack.length !== 0) {
      const node = stack.pop()!
      this.visitNode(node, hashMap, array)
      if (node.child) {
        console.log('node child', node.child)
        for (let i = node.child.length - 1; i >= 0; i--) {
          stack.push({ ...node.child[i], level: node.level! + 1, expand: false, parent: node })
          console.log('stack after loop', stack)
        }
      }
    }
    console.log('convert array', array)
    return array
  }

  visitNode(node, hashMap: { [Id: string]: boolean }, array): void {
    console.log('visit node')
    if (!hashMap[node.Id]) {
      hashMap[node.Id] = true
      array.push(node)
    }
  }
  header = 'Search'

  ngOnInit(): void {
    this.Cdate = new Date()
    this.newprojectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.logData = JSON.parse(sessionStorage.getItem('loginData'))
    console.log(this.logData)
    this.name = this.logData === null || this.logData === undefined ? '' : this.logData.FName
    this.pageSize = 10
    this.pageNum = 1
    this.totalPages = 20
    this.ProjectName = sessionStorage.getItem('pName')
    // this.dataservice.getDeliverables(apis.deliverables).subscribe((res: any) => {
    //   console.log('-----------', res)
    //   this.tableData = res
    //   console.log('table', this.tableData)
    //   this.tableData.forEach(item => {
    //     this.mapOfExpandedData[item.Id] = this.convertTreeToList(item)
    //     console.log('map', this.mapOfExpandedData, this.mapOfExpandedData[item.Id])
    //   })
    // })
    this.searchForm = this.fb.group({
      searchValue: [null],
      searchStartDate: [null],
      searchEndDate: [null],
    })

    this.prjForm = this.fb.group({
      cName: [null, [Validators.required]],
      pName: [null, [Validators.required]],
      remember: [true],
    })
    this.addForm = this.fb.group({
      addTitle: [
        null,
        [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      sDate: [null, [Validators.required]],
      eDate: [null, [Validators.required]],
    })

    // this.validateForm = this.fb.group({
    //   Ttitle: [null, [Validators.required]],
    //   Tstatus: [null, [Validators.required]],
    // })
    // this.validateDevForm = this.fb.group({
    //   intitle1: [null, [Validators.required]],
    //   instatus1: [null, [Validators.required]],
    // })

    this.addDevForm = this.fb.group({
      intitle: [
        null,
        [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      instatus: [null, [Validators.required]],
      desc: [null, [Validators.required, Validators.maxLength(225)]],
      attachment: [null],
      uploadedBy: [null, [Validators.required]],
    })

    this.devForm = this.fb.group({
      inEdittitle: [
        null,
        [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      inEditstatus: [null, [Validators.required]],
      // inEditTime: [null, [Validators.required]],
      // inEditUpdatedby: [null, [Validators.required]],
      description: [null, [Validators.required, Validators.maxLength(225)]],
      uploadedBy: [null, [Validators.required]],
      attachment1: [null],
    })
    this.editmileForm = this.fb.group({
      editDevTitle: [
        null,
        [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      editstartDate: [null, [Validators.required]],
      editendDate: [null, [Validators.required]],
    })

    this.optionForm = this.fb.group({
      radioData: [],
    })
    this.updateEditCache()
    // this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName;

    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.cName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.pName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    console.log('id', this.projectId)
    this.getAllData()
    this.logData = JSON.parse(sessionStorage.getItem('loginData'))
    console.log(this.logData)
    this.name = this.logData === null || this.logData === undefined ? '' : this.logData.FName
    // let projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    // console.log(projectId)
    // this.cName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    // this.pName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
  }

  getAllData() {
    const name = this.searchForm.controls.searchValue.value
    const startDate = this.searchForm.controls.searchStartDate.value
    const endDate = this.searchForm.controls.searchEndDate.value

    // this.datePipe.transform(this.addIssueForm.get('assignedDate').value,'yyyy-dd-MM')

    // if(this.searchForm.get('searchStartDate').value)
    // {
    //   this.startDate = new Date(this.searchForm.get('searchStartDate').value).toISOString().substring(0,10)

    // }
    // if(this.searchForm.get('searchEndDate').value)
    // {
    //   this.endDate = new Date(this.searchForm.get('searchEndDate').value).toISOString().substring(0,10)

    // }

    const data = {
      name: name === null || name === undefined ? '' : name,
      assignedTo: '',
      endDate:
        endDate === null || endDate === undefined
          ? ''
          : this.datePipe.transform(endDate, 'yyyy-MM-dd'),
      startDate:
        startDate === null || startDate === undefined
          ? ''
          : this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      projectId: this.projectId,
    }
    console.log('-----------', data)
    this.dataservice.post(apis.deliverables, data).subscribe((res: any) => {
      console.log('-----------', res)
      this.tableData = res[0].data
      this.records = res[0].count
      this.listOfData = res[0].data
      this.totalPages = res[0].count
      console.log('table', this.tableData)
      this.tableData.forEach(item => {
        this.mapOfExpandedData[item.Id] = this.convertTreeToList(item)
        console.log('map', this.mapOfExpandedData, this.mapOfExpandedData[item.Id])
      })
    })
  }

  newData: any

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.tableData, event.previousIndex, event.currentIndex)
  }
  deleteRow(Id: number): void {
    const body = {
      id: Id,
    }

    console.log('delete body', Id, body)
    this.dataservice.post(apis.delDelete, body).subscribe(res => {
      console.log('delete milstones', res)
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
    // this.tableData = this.tableData.filter(d => d.Id !== Id)
  }
  AddRow() {
    this.isVisible = true
    console.log('AddRow')
  }

  Save(): void {
    if (this.addForm.untouched || this.addForm.invalid) {
      this.isVisible = true
      this.submitAddForm()
    }
    if (this.addForm.valid) {
      let body = {
        parentId: null,
        status: null,
        seqNo: null,
        description: 'Description of Milestone',
        createdBy: null,
        priority: null,
        projectId: this.projectId,
        endDate: this.addForm.get('eDate').value,
        name: this.addForm.get('addTitle').value,
        startDate: this.addForm.get('sDate').value,
        assignedTo: null,
        type: 'M',
        uploadfile: null,
        predecessors: 'predecessors updated',
        // storyId: 0
      }

      console.log('+++++++++++++++++++++++', body)
      this.dataservice.post(apis.addDeliverables, body).subscribe((res: any) => {
        console.log('addmilstone res', res)
        this.addResponse = res

        if (this.addResponse.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Added',
            'Your data has been successfully added',
          )
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
        }

        this.getAllData()
        this.addForm.reset()
      })
      this.isVisible = false
    }
    console.log('handleSave')
  }
  Cancel() {
    this.isVisible = false
    this.addForm.reset()
  }

  handleCancel(): void {
    console.log('Button cancel clicked!')
    this.isVisible = false
  }

  EditRow() {}
  onChangeStatus($event) {
    console.log($event)
  }
  AddInnerTable(id) {
    this.parentID = id
    console.log(id)
    this.isVisible1 = true
    console.log('AddInnerTable')
    this.addDevForm.get('uploadedBy').patchValue(this.name)
  }
  handleSave1() {
    if (this.addDevForm.untouched || this.addDevForm.invalid) {
      console.log('******')
      this.submitaddDevForm()
      this.isVisible1 = true
    } else {
      console.log('addInnerTable', this.addDevForm.value)

      let dataToAPI2 = {
        // taskId:this.parentID,
        parentId: this.parentID,
        status: this.addDevForm.get('instatus').value,
        seqNo: null,
        description: this.addDevForm.get('desc').value,
        createdBy: this.name,
        priority: null,
        projectId: this.projectId,
        endDate: '2020-08-30',
        name: this.addDevForm.get('intitle').value,
        startDate: '2020-08-26',
        assignedTo: null,
        type: 'D',
        uploadfile: null,
        predecessors: 'predecessors updated',
        createdDate: this.Cdate,

        // storyId: 0
      }
      console.log('Edit data save', dataToAPI2)
      this.dataservice.postDev(apis.addDeliverables, dataToAPI2).subscribe((res: any) => {
        console.log('ressssss', res)
        this.addDeliverableResult = res
        if (this.addDeliverableResult.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Added',
            'Your data has been successfully Added',
          )
        } else {
          this.notification.create('error', 'Failed to Added', 'Your data is failed to Added ')
        }
        this.getAllData()
      })
      this.isVisible1 = false
    }
  }

  handleCancel1(): void {
    console.log('Button cancel clicked!')
    this.isVisible1 = false
    // this.router.navigate(['/dashboard/mile-stones'])
  }
  startEdit(data): void {
    console.log('reached deliverables data', data)
    this.isVisible2 = true
    console.log('data.id=========================================>', data.Id)
    this.deliverid = data
    this.devForm.get('inEdittitle').patchValue(data.Name)
    this.devForm.get('inEditstatus').patchValue(data.Status)
    // this.devForm.get('inEditUpdatedby').patchValue(data.ModifiedBy)
    // this.devForm.get('inEditTime').patchValue(data.ModifiedDate)
    this.devForm.get('description').patchValue(data.Description)
    this.devForm.get('uploadedBy').patchValue(this.name)
  }
  handleSave2(): void {
    console.log('========> form <=========')
    this.isVisible2 = false
    if (this.devForm.invalid) {
      this.submitForm()
      this.isVisible2 = true
    }
    if (this.devForm.valid) {
      console.log('this.deliverid', this.deliverid)
      console.log('parentid===================>', this.parentID)
      let dataToAPI2 = {
        parentId: this.deliverid['ParentId'],
        status: this.devForm.value.inEditstatus,
        seqNo: this.deliverid['SeqNo'],
        description: this.devForm.value.description,
        createdBy: this.name,
        priority: null,
        projectId: this.deliverid.ProjectId,
        duration: null,
        createdDate: this.Cdate,
        // modifiedDate: this.devForm.value.inEditTime,
        // modifiedBy: this.name,
        endDate: '2020-08-30',
        name: this.devForm.value.inEdittitle,
        startDate: '2020-08-26',
        assignedTo: null,
        type: 'D',
        uploadfile: null,

        // createdDate: '2020-08-26',
        predecessors: 'predecessors updated123',
        id: this.deliverid['Id'],
        // storyId: 0,
      }
      console.log('datatoapi================>', dataToAPI2)
      this.dataservice
        .updateDeliverables(apis.updateMilestones, dataToAPI2)
        .subscribe((res: any) => {
          console.log(res)
          // this.getAllData()

          this.deliverabledata = res

          this.getAllData()
          console.log('Edit data save', dataToAPI2)
          console.log('deliverable data=======>', this.deliverabledata)
          if (this.deliverabledata.hasOwnProperty('success') === true) {
            this.notification.create(
              'success',
              'Successfully Updated',
              'Your data has been successfully updated',
            )
          } else {
            this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
          }
        })
    }
  }

  handleCancel2(): void {
    console.log('Button cancel clicked!')
    this.isVisible2 = false
    this.devForm.reset()
  }
  submitForm(): void {
    for (const i in this.devForm.controls) {
      this.devForm.controls[i].markAsDirty()
      this.devForm.controls[i].updateValueAndValidity()
    }
  }

  submitAddForm(): void {
    for (const i in this.addForm.controls) {
      this.addForm.controls[i].markAsDirty()
      this.addForm.controls[i].updateValueAndValidity()
    }
  }

  submitTaskForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }
  }

  submitDevForm(): void {
    for (const i in this.validateDevForm.controls) {
      this.validateDevForm.controls[i].markAsDirty()
      this.validateDevForm.controls[i].updateValueAndValidity()
    }
  }

  submitaddDevForm(): void {
    for (const i in this.addDevForm.controls) {
      this.addDevForm.controls[i].markAsDirty()
      this.addDevForm.controls[i].updateValueAndValidity()
    }
  }

  submiteditMileForm() {
    for (const i in this.editmileForm.controls) {
      this.editmileForm.controls[i].markAsDirty()
      this.editmileForm.controls[i].updateValueAndValidity()
    }
  }

  proj() {
    this.route.navigate(['/dashboard/projectDetails/', this.pName])
  }
  dashboard() {
    this.route.navigate(['/dashboard/allProjects'])
  }

  // selectedType(event) {
  //   console.log(this.addForm.valid)
  //   if (this.addForm.valid && this.addForm.touched) {
  //     this.type = 'M'
  //   }
  //   console.log(event)
  //   console.log('hi reached here')
  //   if (event === 'Task') {
  //     if (this.addForm.valid && this.addForm.touched) {
  //       this.type = 'M'
  //     } else {
  //       this.type = 'T'
  //     }
  //     this.Task = true
  //     this.Deliverables = false
  //   } else if (event === 'Deliverables') {
  //     if (this.addForm.valid && this.addForm.touched) {
  //       this.type = 'M'
  //     } else {
  //       this.type = 'D'
  //     }
  //     this.Deliverables = true
  //     this.Task = false
  //   } else {
  //     this.type = 'M'
  //   }
  // }
  // startEdit1(Id: number): void {
  //   this.editCache[Id].edit = true
  // }
  cancelEdit(Id: number): void {
    const index = this.tableData.findIndex(item => item.Id === Id)
    this.editCache[Id] = {
      data: { ...this.tableData[index] },
      edit: false,
    }
  }

  saveEdit(Id: number): void {
    const index = this.tableData.findIndex(item => item.Id === Id)
    Object.assign(this.tableData[index], this.editCache[Id].data)
    this.editCache[Id].edit = false
  }

  updateEditCache(): void {
    this.tableData.forEach(item => {
      this.editCache[item.Id] = {
        edit: false,
        data: { ...item },
      }
    })
  }
  stopEdit(): void {
    this.editId = null
  }
  onSearch(event) {
    console.log('serach value', event.toLowerCase())
    if (event === '') {
      this.tableData = this.arr
      console.log('if stmt', this.tableData)
    } else {
      console.log('else stmt')
      this.filtered = this.tableData.filter(x => {
        let name1 = x.title.toLowerCase()
        if (name1.includes(event.toLowerCase())) return x
      })
      this.tableData = this.filtered
      this.filtered = []
    }
  }
  Save3() {
    if (this.editmileForm.untouched || this.editmileForm.invalid) {
      this.submiteditMileForm()
      this.visiblEdit = true
    } else {
      //  let d1 = this.editmileForm.get('editstartDate').value
      //   let d2 = this.editmileForm.get('editendDate').value

      //   let sDate = this.edit

      let data = {
        parentId: null,
        status: null,
        seqNo: 2,
        description: 'description updated',
        createdBy: null,
        priority: null,
        projectId: this.projectId,
        modifiedBy: null,
        endDate: this.editmileForm.get('editendDate').value,
        name: this.editmileForm.get('editDevTitle').value,
        startDate: this.editmileForm.get('editstartDate').value,
        assignedTo: null,
        type: 'M',
        uploadfile: null,
        createdDate: '2020-08-27',
        predecessors: 'predecessors ',
        // storyId: 1,
        id: this.editValues.Id,
      }
      console.log('-------->', data)
      this.dataservice.post(apis.updateMilestones, data).subscribe((res: any) => {
        console.log('Update milstone res', res)
        this.updateResult = res
        if (this.updateResult.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Updated',
            'Your data has been successfully updated',
          )
        } else {
          this.notification.create('error', 'Failed to update', 'Data is not update ')
        }
        this.getAllData()
      })
      this.visiblEdit = false
    }
  }

  Cancel3() {
    this.visiblEdit = false
  }
  editValues
  startEdit1(item): void {
    console.log('item', item)
    this.editValues = item
    this.editStartDate = new Date(item.StartDate)
    this.editmileForm.controls.editDevTitle.patchValue(item.Name)
    this.editmileForm.controls.editstartDate.patchValue(item.StartDate)
    this.editmileForm.controls.editendDate.patchValue(item.EndDate)
    this.visiblEdit = true
    // this.editCache[Id].edit = true
  }

  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }

  //add
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
  }

  handleEndOpenChange(open: boolean): void {
    console.log(open)
    this.endOpen = open
  }

  startValueEdit: Date | null = null
  endValueEdit: Date | null = null
  endOpenEdit = false
  disabledStartDateEdit = (startValue: Date): boolean => {
    if (!startValue) {
      return false
    }
    return startValue.getTime() < this.editStartDate.getTime()
  }

  disabledEndDateEdit = (endValue: Date): boolean => {
    if (!endValue) {
      return false
    }
    return endValue.getTime() <= this.startValueEdit.getTime()
  }

  onStartChangeEdit(date: Date): void {
    this.startValueEdit = date
  }

  onEndChangeEdit(date: Date): void {
    this.endValueEdit = date
  }

  handleStartOpenChangeEdit(open: boolean): void {
    if (!open) {
      this.endOpenEdit = true
    }
  }

  handleEndOpenChangeEdit(open: boolean): void {
    console.log(open)
    this.endOpenEdit = open
  }
  reset() {}
  search() {}

  //edit

  //pagination
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllData()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.pageNum = 1
    this.getAllData()
  }

  onChange(): void {
    this.getAllData()
  }

  resetSearchFields() {
    this.searchForm.reset()
    this.getAllData()
  }
}
