import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import { HostListener } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { HttpClient } from '@angular/common/http'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import * as moment from 'moment'
import { getMenuData } from 'src/app/services/menu/config'
import { rename } from 'fs'
import { element } from 'protractor'


@Component({
  selector: 'app-sub-projects',
  templateUrl: './sub-projects.component.html',
  styleUrls: ['./sub-projects.component.scss'],
})
export class SubProjectsComponent implements OnInit {
  finalTableData = []    // this array used to count parent , child and levels
  listOfData = []        // this array is bound to the UI table(grid)
  tabledata = []         // this array contains data receiecd from back end
  prev_parentId
  curr_parentId
  depen= []              //temporary store dependencies
  addPopUp = false
  editsamp = {}
  parentIdList = []
  public newRecordType
  public editRecordType: string
  validateForm: FormGroup
  searchForm: FormGroup
  mapOfExpandedData: { [key: string]: Array<any> } = {}
  assinged: any[]
  requestBody = {}
  startDate: string
  endDate: string
  addAssigned: any
  noOfDays
  currentDate = new Date()
  addSubmitButton = false
  editUpdateButton = false
  addFormView = false
  selectedType: string
  pageNum: number
  noOfRecords: number
  searchTerm: string
  currentIndex: any
  disable: boolean = true
  type = {
    T: 'Task',
    S: 'Sub-Project',
    M: 'Milestone',
    D: 'Deliverable',
  }
  optionList
  cusName: any
  proName: any
  delData: any    // to stote delete response
  addData: any
  parentid: any
  depList: any
  projectId: any
  enableDeliverable: boolean
  ProjectName: string
  enableSubject: boolean
  listOfResources: any
  dep: []
  editResources = []
  editDependencies = []
  listOfDependencies: any
  addItem: any
  typeSelected: string     //to store type seleted in search form
  empty = "NA"
  priority                 // to store priority drow down data from back end
  status                   // to store status drop down data from back end
  idnew: any               // to store Id when drop down happened
  currentLevel: any
  currentRowId: number
  header = 'Search'
  newData: Object
  currentRowData: any
  recordCount: number
  dropdownType = [
    { label: 'Task', value: 'T' },
    { label: 'Sub-Project', value: 'S' },
    { label: 'Milestone', value: 'M' },
  ]
  disabledEndDate: (current: Date) => boolean

  @HostListener('window:keydown', ['$event']) // Host listner is a decorator used to handle events
  keyboardInput(event: any) { // We added a hostListener to the keyboardInput method by passing parameter 
    console.log(event)
    if (event.key === 'Tab') {
      console.log(event)
      if (event.srcElement.name === 'resources') {
        console.log(+this.currentRowId, this.recordCount - 1)
        if (+this.currentIndex === (this.recordCount - 1)) {
          console.log('after checking condition to add record')
          this.addRecord()
          this.currentRowId++
          this.currentIndex++
        } else {
          console.log(this.currentRowData.address, event.target.value)
          console.log(this.listOfData)
          console.log(this.currentRowId, typeof this.currentRowId)
          this.listOfData = this.listOfData
          this.currentRowId++
          this.currentIndex++
        }
      }
    }
  }
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private nzMessageService: NzMessageService,
    private http: HttpClient,
    private notification: NzNotificationService,
    private dataservice: DataService,
    private route: Router,
  ) {

    // form for edit and add item
    this.validateForm = this.fb.group({
      type: [null],
      taskName: [null, [Validators.required, Validators.maxLength(50)]],
      StartDate1: [new Date(),],
      EndDate1: [null, []],
      taskAssingedTo: [null, []],
      desc: [null, [Validators.maxLength(512)]],
      dependenciesList: [null],
      sPriority: [null],
      sStatus: [null],
      subProjectDuration: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
    })
    this.validateForm.get('StartDate1').patchValue(new Date())

    // form for searching
    this.searchForm = this.fb.group({
      searchTitle: [null],
      searchType: [null],
      searchStartDate: [null],
      searchEndDate: [null],
    })
  }

  // Used to add an empty record
  addRecord() {
    const data = []
    console.log('adding a new record to data')
    data.push({
      id: null,
      no: null,
      task: null,
      Customername: null,
      startDate: null,
      endDate: undefined,
      duration: null,
      rowId: this.recordCount,
      dirty: false,
      depends: null,
      resources: null,
      level: 0
    })
    console.log(this.listOfData)
    console.log(...this.listOfData, ...data)
    this.listOfData = [...this.listOfData, ...data] // Merging or combining exixting & newly add data and assigning to a variable
    this.recordCount++
  }

  ngOnInit(): void {
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.cusName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.proName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.validateForm.get('StartDate1').patchValue(this.currentDate)
    console.log("current date", this.currentDate)
    console.log('id', this.projectId)
    this.getTypeOfItem()
    this.getPriority()
    this.getStatus()
    this.getContacts()
    this.getDependencies();
    this.ProjectName = sessionStorage.getItem('pName')
    this.currentRowId = -1 // changed  1 to -1 initial value is 0
    this.currentIndex = -1
    this.getTableData()
    this.recordCount = this.listOfData.length
    console.log("recordCount",this.recordCount)
  }

  // to get table data from back end by ProjectId
  getTableData() {
    this.parentIdList = []
    this.finalTableData = []
    console.log('searchValu', this.searchForm.get('searchTitle').value)
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


    this.dataservice.get(apis.getsubProjectList + '/' + this.projectId).subscribe(res => {
      console.log('drag and drop', res)
      this.tabledata = res
      let val = 0
      let rowid = 0

      // to get parent Id and push to empty array 
      this.tabledata.forEach(item => {
        if (item.ParentId == null) {
          this.parentIdList.push(item.Id)
        }
      })

      // to get child data
      console.log("parent id", this.parentIdList)
      for (let i = 0; i <= this.parentIdList.length - 1; i++) {
        let level =0
        let pId = this.parentIdList[i]
        this.tabledata.forEach(element => {
          if (element.Id == pId) {
            element['level'] = level
            this.finalTableData.push(element)
            this.childData(element.Id , level)
          }
        })
        
      }

      this.finalTableData.forEach(element =>{
        element['rowId'] = rowid++
      })

      console.log("final table data", this.finalTableData)
      this.recordCount = this.listOfData.length
      this.listOfData = this.finalTableData
      this.noOfRecords = this.listOfData.length
    })
  }

  // to get child data and push into finala table data
  //And setting levels for child
  childData(id, level) {
    let level2 = ++level
    console.log("level in child data method",level2)
    let rowData = this.tabledata.filter(element => element.ParentId == id)
    if (rowData.length > 0) {
      for (let i = 0; i <= rowData.length - 1; i++) {
        rowData[i]['level'] =level2
        this.finalTableData.push(rowData[i])
        this.childData(rowData[i].Id,level2)
      }
    }
  }

  // To Delete  table's row record by Id
  deleteRow(itemId): void {
    const body = {
      id: itemId,
    }
    this.dataservice.post(apis.deleteSubproject, body).subscribe(res => {
      this.listOfData.length === 1 ? this.pageNum = this.pageNum - 1 : this.pageNum
      console.log('delete res', res)
      this.delData = res

      this.getTableData()
      if (this.delData['Result'] == 'deleted Successfully') {
        this.notification.create(
          'success',
          'Successfully Deleted',
          'Your data has been successfully deleted',
        )
      }
    })
  }

  //submit button validations
  submitAdd(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsTouched()
      this.validateForm.controls[i].updateValueAndValidity()
    }
  }

  // to ada new item in row
  addItemInner(data): void {
    this.addPopUp = true
    this.parentid = data.Id
    if (data.Type === 'M') {
      this.enableDeliverable = true
    }
    if (data.Type === 'S') {
      this.enableSubject = true
    }
  }

  //To add new record
  addNewRecord(): void {
    this.addSubmitButton = true

    if (this.validateForm.untouched || this.validateForm.invalid) {
      this.addPopUp = true
      this.submitAdd()
    }

    // setting the selected type of the new item
    if (this.newRecordType === 'Task') this.selectedType = 'T'
    else if (this.newRecordType === 'SubProject') this.selectedType = 'S'
    else if (this.newRecordType === 'Deliverable') this.selectedType = 'D'
    else this.selectedType = 'M'

    // setting the Resourses and Dependencies
    let loginName = JSON.parse(sessionStorage.getItem('loginData')).LoginId
    this.depen = this.validateForm.controls.taskAssingedTo.value
    if (this.depen == null) {
      this.addAssigned = 'NA'
    }
    else {
      this.addAssigned = this.depen.join()
    }
    this.dep = this.validateForm.controls.dependenciesList.value
    if (this.dep === null || this.dep === undefined) {
      this.depList = 'NA'
    }
    else {
      this.depList = this.dep.join()
    }

    // creating request body for sending to the back end
    if (this.validateForm.valid) {
      this.requestBody = {
        parentId: this.parentid,
        status: this.validateForm.controls.sStatus.value,
        seqNo: 6,
        description: this.validateForm.controls.desc.value,
        createdBy: loginName,
        priority: this.validateForm.controls.sPriority.value,
        duration: this.validateForm.controls.subProjectDuration.value,
        projectId: this.projectId,
        name: this.validateForm.controls.taskName.value,
        startDate: this.validateForm.controls.StartDate1.value,
        assignedTo: this.addAssigned,
        type: this.selectedType,
        dependencies: this.depList,
        endDate: this.validateForm.controls.EndDate1.value,
        uploadfile: null,
        predecessors: ' ',
        storyId: 0,
      }
      console.log('checkdata---***', this.requestBody)

      //now making the API call to add new item
      this.dataservice.post(apis.AddSubproject, this.requestBody).subscribe(res => {
        console.log('res', res)
        this.newData = res
        this.getTableData()
        if (this.newData['success'] === 'Record inserted successfully') {
          this.notification.create(
            'success',
            'Successfully Created',
            'Your data has been successfully Added',
          )
        }
      })
      this.addSubmitButton = false;
      this.addPopUp = false
      this.enableDeliverable = false
      this.enableSubject = false
      this.validateForm.reset()
      this.newRecordType = ''
      this.depList = ''
      this.addAssigned = ''
      this.depen = null
      this.dep = null
    }
  }

  //To edit row data
  editRow(data: string): void {
    this.newRecordType = data['Type'];
    console.log("edit data", data)
    this.editResources = [];
    this.editDependencies = [];
    this.validateForm.reset();
    if (data['AssignedTo'] != null) {
      const assignto = data['AssignedTo'].split(',')

      for (let i = 0; i < this.listOfResources.length; i++) {
        for (let j = 0; j < assignto.length; j++) {
          if (this.listOfResources[i].UserName == assignto[j]) {
            this.editResources.push(this.listOfResources[i].UserName);
          }
        }
      }
    }
    else {
      this.editResources = []
    }
    console.log("editResources", this.editResources)
    if (data['Dependencies'] != null) {
      const dependenc = data['Dependencies'].split(',')
      console.log(dependenc)
      console.log(this.editDependencies)
      console.log('editDependencies1', this.listOfDependencies)
      for (let i = 0; i < this.listOfDependencies.length; i++) {
        for (let j = 0; j < dependenc.length; j++) {
          if (this.listOfDependencies[i].Name == dependenc[j]) {
            this.editDependencies.push(this.listOfDependencies[i].Name);
          }
        }
      }
    }
    else {
      this.editDependencies = []
    }

    console.log('editDependencies2', this.editDependencies)
    this.addPopUp = true
    this.editsamp = data
    this.editRecordType = data['Type']
    console.log('edit data', data)
    console.log('editRecordType-', this.editRecordType)
    const children: Array<{ label: string; value: string }> = []
    this.validateForm.get('sStatus').patchValue(data['Status'])
    this.validateForm.get('sPriority').patchValue(data['Priority'])
    this.validateForm.get('taskName').patchValue(data['Name'])
    this.validateForm.get('StartDate1').patchValue(data['StartDate'])
    this.validateForm.get('EndDate1').patchValue(data['EndDate'])
    this.validateForm.get('type').patchValue(data['Type'])
    this.validateForm.get('dependenciesList').reset()
    this.validateForm.get('dependenciesList').patchValue(this.editDependencies)
    this.validateForm.get('subProjectDuration').patchValue(data['Duration'])
    this.validateForm.get('desc').patchValue(data['Description'])
    this.validateForm.get('taskAssingedTo').reset()
    this.validateForm.get('taskAssingedTo').patchValue(this.editResources)
  }

  // to cancel add oredit modal 
  addCancel(): void {
    this.editResources = [];
    this.editDependencies = [];
    this.addSubmitButton = false
    this.addPopUp = false
    this.enableDeliverable = false
    this.enableSubject = false
    this.validateForm.reset()
    this.newRecordType = null
    this.depList = null
    this.addAssigned = null
    this.dep = null
    this.depen = null
  }


  //to submit edited data after patching
  Update(): void {
    this.editUpdateButton = true
    this.addPopUp = false
    if (this.validateForm.untouched || this.validateForm.invalid) {
      this.addPopUp = true
      this.submitAdd()
    }

    console.log('editForm', this.validateForm.value)
    if (this.validateForm.valid) {
      const body = {
        parentId: this.editsamp['ParentId'],
        status: this.validateForm.get('sStatus').value,
        seqNo: this.editsamp['SeqNo'],
        description: this.validateForm.get('desc').value,
        createdBy: this.editsamp['CreatedBy'],
        priority: this.validateForm.get('sPriority').value,
        projectId: this.editsamp['ProjectId'],
        modifiedBy: this.editsamp['ModifiedBy'],
        endDate: this.validateForm.get('EndDate1').value,
        name: this.validateForm.get('taskName').value,
        startDate: this.validateForm.get('StartDate1').value,
        assignedTo: this.validateForm.get('taskAssingedTo').value.join(),
        type: this.validateForm.get('type').value,
        uploadfile: this.editsamp['uploadfile'],
        createdDate: this.editsamp['CreatedDate'],
        dependencies: this.validateForm.get('dependenciesList').value.join(),
        predecessors: this.editsamp['Predecessors'],
        storyId: this.editsamp['StoryId'],
        id: this.editsamp['Id'],
        duration: this.validateForm.get('subProjectDuration').value
      }
      console.log("update date", body)
      this.dataservice.post(apis.updateSubproject, body).subscribe(res => {
        console.log('update res', res)
        this.addData = res
        this.getTableData()
        if (this.addData['success'] == 'updated successfully') {
          this.notification.create(
            'success',
            'Successfully Updated',
            'Your data has been successfully Updated',
          )
        }
      })
    }
    this.addPopUp = false
    this.editUpdateButton = false
    this.validateForm.get('taskAssingedTo').reset()
    this.validateForm.get('dependenciesList').reset()
  }

  //Start and end date functionality
  startValue: Date | null = null
  disabledStartDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0
  }

  // to disable date's based on start and end date
  onStartChange(date: Date): void {
    this.startValue = date
    this.disabledEndDate = (current: Date): boolean => {
      return differenceInCalendarDays(current, new Date(this.startValue)) < 0
    }
  }

  //to get drop down values from api
  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.proName])
  }

  //to get item type drop down
  getTypeOfItem() {
    this.http.get(apis.gettasktype).subscribe(res => {
      this.optionList = res
    })
  }

  // to get priority drop down data from back end
  getPriority() {
    this.http.get(apis.priority).subscribe(res => {
      this.priority = res
    })
  }

  // to get status drop down data from back end
  getStatus() {
    this.http.get(apis.status).subscribe(res => {
      console.log("status list", res)
      this.status = res
    })
  }

  // to reset searchform fields and get table data
  resetSearchFields() {
    this.searchForm.reset()
    this.getTableData()
  }

  //breadcrumbs routing
  gotoHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }

  //breadcrumb routing
  details1() {
    // this.projectname = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.proName])
  }

  // to get list of resources from back end
  getContacts() {
    const children: Array<{ label: string; value: string }> = []
    this.dataservice.get(apis.allResources).subscribe((res: any) => {
      console.log("contacts", res)
      this.listOfResources = res
    })
  }

  //to get Dependencies drop down data
  getDependencies() {
    this.http.get(apis.getAllDependencies + this.projectId).subscribe(res => {
      console.log("Dependencieslist", res)
      this.listOfDependencies = res
    })
    console.log("listOfDependencies", this.listOfDependencies)
  }

  //to get end date based on start date and duration
  getEndDate() {
    if (this.addItem == "add" || this.addItem == 'Add') {
      const date = new Date(this.validateForm.get('StartDate1').value);
      const n = parseInt(this.validateForm.get('subProjectDuration').value)
      const star = this.validateForm.get('StartDate1').value
      console.log(date)
      console.log("start date", star)
      if (star != null) {
        var momentBusinessDays = require("moment-business-days")
        var s = momentBusinessDays(date.getDate(), 'DD-MM-YYYY').businessAdd(n)._d
        console.log("end date", s)
        this.validateForm.get('EndDate1').patchValue(s)
      }
    }
  }

  //to add new item data 
  showGlobalAddModel(action) {
    this.validateForm.reset();
    this.addItem = action
    this.parentid = null
    this.addPopUp = true
    this.enableDeliverable = false
    this.enableSubject = false
  }

  // to invoke the form and sending parent id
  showRowAddModel(data, action) {
    this.addItem = action
    this.addItemInner(data);
  }

  //this method to invoke edit form
  showEditModel(data, action) {
    this.validateForm.reset();
    console.log("add and edit click", data)
    this.addItem = action
    this.addFormView = false
    this.editRow(data)
  }

  // this method to compute save or update base on action
  saveModel() {
    if (this.addItem === 'Add') {
      this.addNewRecord()
    }
    else {
      this.Update()
    }
  }

   // Used to get the current row data
  onTrClick(data, index): void { // data = rowData & index = rowIndex
    console.log(data, index)
    this.currentIndex = index
    this.currentRowData = data
    this.currentLevel = data.level
    this.currentRowId = data.rowId
  }

  //Sending row data after editing grid
  enterKeyUpdate(data){
    console.log("enter key update",data)
    this.updateRow(data)
  }

  //level decrement
  decrement(data) {
    var cLevel = data.level - 1
    console.log('decrement', data, cLevel)
    if (data.level == cLevel) {
      console.log('if condition')
      this.disable = true
    } else {
      console.log('else cond')
      data.level--
    }
  }

  //level increment
  increment(data) {
    console.log('increment', data)
    data.level++
  }

  // Evnt contains existing and modified data with index values
  onDrop(event) {
    console.log(event)
    if (this.listOfData[event.previousIndex].Type === 'S' && this.listOfData[event.currentIndex].Type === 'S') {
      console.log('error')
      this.getTableData()
      this.notification.warning('Warning', 'Cannot drop one subproject into another')
    }
    else {
      this.listOfData.forEach((obj, index) => {
        if (index == event.previousIndex) {
          console.log("prev index")
          this.prev_parentId = obj.ParentId
        }
        if (index == event.currentIndex) {
          console.log("currv index")
          this.curr_parentId = obj.ParentId
          this.idnew = obj.Id
        }
      })
      //after drop event happened  seting parent ID
      moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex)
      if (this.curr_parentId == null) {
        this.listOfData[event.currentIndex].ParentId = this.idnew
      }
      else
        this.listOfData[event.currentIndex].ParentId = this.curr_parentId
      console.log(this.listOfData[event.currentIndex], this.curr_parentId)
      this.listOfData.forEach((x, i) => {
        if (i == event.currentIndex) {
          this.updateRow(x)
        }
      })
    }
  }

  //After drag and drop event happened making post API request body 
  updateRow(data) {
    const body = {
      parentId: data.ParentId,
      status: data.Status,
      seqNo: data.SeqNo,
      description: data.Description,
      createdBy: data.CreatedBy,
      priority: data.Priority,
      projectId: data.ProjectId,
      modifiedBy: data.ModifiedBy,
      endDate: data.EndDate,
      name: data.Name,
      startDate: data.StartDate,
      assignedTo: data.AssignedTo,
      type: data.Type,
      uploadfile: data.uploadfile,
      createdDate: data.CreatedDate,
      dependencies: data.Dependencies,
      predecessors: data.Predecessors,
      storyId: data.StoryId,
      id: data.Id,
      duration: data.Duration
    }
    console.log("update date", body)
    this.dataservice.post(apis.updateSubproject, body).subscribe(res => {
      console.log('update res', res)
      this.addData = res
      this.getTableData()
      if (this.addData['success'] == 'updated successfully') {
        this.notification.create(
          'success',
          'Successfully Updated',
          'Your data has been successfully Updated',
        )
      }
    })
  }
}




