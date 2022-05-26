import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { _ACTIVE_RUNTIME_CHECKS } from '@ngrx/store/src/tokens'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { DatePipe } from '@angular/common'
import { NzUploadFile } from 'ng-zorro-antd/upload'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { HostListener } from '@angular/core'





@Component({
  selector: 'app-mile-stones',
  templateUrl: './mile-stones.component.html',
  styleUrls: ['./mile-stones.component.scss'],
  providers: [DatePipe],
})
export class MileStonesComponent implements OnInit {
  i = 0
  visible = false
  // ---------------------------- To Open Milestone Add Dialogue Box -------------------------------
  addMilestonePopup = false
  // ---------------------------- To Open Deliverable Add Dialogue Box -------------------------------
  addDeliverablePopup = false
  // ---------------------------- To Open Deilverable Edit Dialogue Box -------------------------------
  editDeliverablePopup = false
  searchValue = ''

  searchTerm: string
  // ----------------------------Holds Page Number To Send The required Page Data From BackEnd -------------------------------
  pageNum: number
  // ----------------------------Holds Page Size To Dispaly The Required No Of Records Per Page -------------------------------
  pageSize: number
  // ----------------------------Holds Total No Of Records from From BackEnd -------------------------------
  totalPages: number

  editId: string | null = null
  editCache: { [key: string]: { edit: boolean; data } } = {}
 
// ------------------------------------ Holds The On Load Response And Binds The Data To The Table Grid ---------------------------
  tableData = []
  // ------------------------------------ Holds Multiple Files Data That Are Being Uploaded ---------------------------
  multipleFiles = []
  arr = []
  filtered = []
  gridData = []
  taskForm = false
  Deliverables = false

 

  file: NzUploadFile[] = []

  
  public newRecordType

  prjForm: FormGroup
  // --------------------------- A Form To Add A Milestone ---------------------------
  addForm: FormGroup
  // --------------------------- A Form To Add A Deliverable ---------------------------
  addDevForm: FormGroup

  validateForm: FormGroup

  validateDevForm: FormGroup

  Task: boolean
  // --------------------------- A Form To Edit A Deliverable ---------------------------
  devForm: FormGroup

 
  // --------------------------- A Form To Edit A Milestone ---------------------------
  editmileForm: FormGroup
  // --------------------------- A Form To Search A Record ---------------------------
  searchForm: FormGroup
  // --------------------------- To Open Milestone Edit Dialogue Box ---------------------------
  editMilestonePopup: boolean = false

  samparr: any[]
  submitted = false
  // --------------------- Defines The Type Of The Record --------------------------------
  type: any = 'M'
  // ----------- Holds The Id Of the Milestone To Which A Deliverable Is To Be Added ----------------------
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
  // ----------------------- Variable That Holds Response Of The Inserting A Deliverable ----------------------------
  addResponse: any
  deleteResponse: Object
  updateResult: any
  addDeliverableResult: any
  noOfRecords: number
  records: any
  listOfData: any
  uploadedFile: any
  uploadResponse: any
  disabledEndDate: (current: Date) => boolean
  btnDisabled: boolean = false
  title: string
  modalTitle: string
  attachedFile: any

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getAllData()
    }
  }
  



   moment = require('moment-business-days');

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
   
  }
// -------------------------------- Expandes The Childs ------------------------------
  mapOfExpandedData: { [key: string]: Array<any> } = {}
  expandSet = new Set<number>()
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id)
    } else {
      this.expandSet.delete(id)
    }
  }
// -------------------- Enables The Collapse Feature If A Child Exit For A Milestone ----------------------------
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
  // ----------------------------- Header For The Collapse ---------------------------------------------

  header = 'Search'
// ---------------------- Used To 
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

    // ---------------- Milestone Add Or Edit Form -------------------------------
    this.addForm = this.fb.group({
      addMileTitle: [
        null,
        [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      MilestoneStartDate: ['', [Validators.required]],
      MilestoneEndDate: [null, [Validators.required]],
    })

    // ----------------------------------- Deliverables Add Or Edit Form ---------------------------------------
   
    this.addDevForm = this.fb.group({
      addDeltitle: [ 
        null,
        [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      addDelStatus: [null,Validators.required],
      desc: [null, [Validators.maxLength(255)]],
      attachment: [null],
      uploadedBy: [null, [Validators.required]],
    })

    

    
  

    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.cName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.pName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    console.log('id', this.projectId)
    this.getAllData()
    this.logData = JSON.parse(sessionStorage.getItem('loginData'))
    console.log(this.logData)
    this.name = this.logData === null || this.logData === undefined ? '' : this.logData.FName
    
  }

// --------------------------------------- To get Table Data on load -----------------------------------------

  getAllData() {
    const name = this.searchForm.controls.searchValue.value
    const startDate = this.searchForm.controls.searchStartDate.value
    const endDate = this.searchForm.controls.searchEndDate.value

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

 

// --------------------- Deletes A Milestone Or A Deliverable Based On Id----------------------------------

  deleteRow(Id: number): void {
    const body = {
      id: Id,
    }

    console.log('delete body', Id, body)
    this.dataservice.post(apis.delDelete, body).subscribe(res => {
      console.log('delete milstones', res)
      this.deleteResponse = res
      this.tableData.length === 1 ? this.pageNum = this.pageNum -1 : this.pageNum
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
  
  }

  // ------------------------------- Opens Milestone Add Dialogue Box ------------------------

  AddRow(data) {
    if(data === 'addMilestone')
    {
      this.addMilestonePopup = true
      this.modalTitle = "Add Milestone"
      this.addForm.controls.MilestoneStartDate.patchValue(new Date());
      this.title="Save"
    }
    else{
      this.addMilestonePopup = true
      this.modalTitle = "Edit Milestone"
      this.title="Update"
      this.startEdit1(data)
     
    }
   
    console.log('AddRow')
  }


// -------------------------------- Adds Or Edits a Milestone ----------------------------

  addOrEditMilestone(): void {
    this.btnDisabled = true;
    if (this.addForm.untouched || this.addForm.invalid) {
      this.addMilestonePopup = true
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
        endDate: this.addForm.get('MilestoneEndDate').value,
        name: this.addForm.get('addMileTitle').value,
        startDate: this.addForm.get('MilestoneStartDate').value,
        assignedTo: null,
        type: 'M',
        uploadfile: null,
        predecessors: 'predecessors updated',
       id:this.title === "Save" ? '' :this.editValues.Id
       
      }

      console.log('+++++++++++++++++++++++', body)
      if(this.title === "Save")
      {
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
          this.btnDisabled = false
          this.getAllData()
          this.addForm.reset()
        })
        this.addMilestonePopup = false
      }
      else
      {
        this.dataservice.post(apis.updateMilestones, body).subscribe((res: any) => {
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
          this.btnDisabled = false
          this.getAllData()
        })
        this.addMilestonePopup = false
      }
     
    }
    console.log('handleSave')
  }

// -------------------------------- Closes Milestone Add Or Edit Form Dialogue --------------------------------------

  cancelMilestoneAddOrEdit() {
    this.addMilestonePopup = false
    this.editMilestonePopup= false
    this.btnDisabled = false
    this.addForm.reset()
  }

 
  // ------------------------ Opens The Dialogue Box For The Adding or Editing A Milestone ----------------------
  AddInnerTable(data,action) {
    if(action === 'addDeliverable')
    {
      this.modalTitle = "Add Deliverable"
      this.title = "Save"
      this.parentID = data
      console.log(data)
      this.addDeliverablePopup = true
      console.log('AddInnerTable')
      this.addDevForm.get('uploadedBy').patchValue(this.name)
    }
    else
    {
      this.addDeliverablePopup = true
      this.title="Update"
      this.modalTitle = "Edit Deliverable"
      this.startEdit(data) 
    }

  }


  // ------------------------------ Adds Or Edits Deliverable ------------------------------

  addOrEditDeliverable() {
    this.btnDisabled = true;
    if (this.addDevForm.untouched || this.addDevForm.invalid) {
      console.log('******')
      this.submitaddDevForm()
      this.addDeliverablePopup = true
    } else {
      const fileData = new FormData()
      this.multipleFiles.forEach(x => {
        fileData.append('files', x)
      })

      this.dataservice.post(apis.uploadFile, fileData).subscribe((res: any) => {
        console.log('file response', res)
        this.uploadResponse = res
        console.log('response', this.uploadResponse)
      })

      console.log('addInnerTable', this.addDevForm.value)
      let dataToAPI2 = {
      
        parentId: this.modalTitle === 'Add Deliverable' ? this.parentID:this.deliverid['ParentId'],
        status: this.addDevForm.get('addDelStatus').value,
        seqNo: this.modalTitle === 'Add Deliverable' ? null : this.deliverid['SeqNo'],
        description: this.addDevForm.get('desc').value,
        createdBy: this.name,
        priority: null,
        projectId: this.projectId,
        endDate: '2020-08-30',
        name: this.addDevForm.get('addDeltitle').value,
        startDate: '2020-08-26',
        assignedTo: null,
        type: 'D',
        uploadFile: this.uploadedFile,
        predecessors: 'predecessors updated',
        createdDate: this.Cdate,
        id: this.modalTitle === 'Add Deliverable' ? '' : this.deliverid['Id'],
        
      }
      console.log('Edit data save', dataToAPI2)
      if(this.modalTitle === "Add Deliverable")
      {
        this.dataservice.postDev(apis.addDeliverables, dataToAPI2).subscribe((res: any) => {
        
       
          this.btnDisabled = false
         
          
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
          this.addDevForm.reset()
          this.getAllData()
        })
        this.addDeliverablePopup = false
      }
      else
      {
        this.dataservice
        .updateDeliverables(apis.updateMilestones, dataToAPI2)
        .subscribe((res: any) => {
          console.log(res)
        

          this.deliverabledata = res

          this.btnDisabled = false
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
        this.addDeliverablePopup = false
        this.addDevForm.reset()
      }
      
      
    }
  }

  // ------------------------------ Clsoes Deliverable Add Form Dialogue  ------------------------------

  cancelDeliverableAddOrEdit(): void {
    console.log('Button cancel clicked!')
    this.btnDisabled = false
    this.addDeliverablePopup = false
    this.addDevForm.reset()
   
  }

// -------------------------------- Patches A Deliverable For Editing --------------------------------------

  startEdit(data): void {
    console.log('reached deliverables data', data)
    this.attachedFile = data.uploadefile
    this.editDeliverablePopup = true
    console.log('data.id=========================================>', data.Id)
    this.deliverid = data
    this.addDevForm.get('addDeltitle').patchValue(data.Name)
    this.addDevForm.get('addDelStatus').patchValue(data.Status)

    this.addDevForm.get('desc').patchValue(data.Description)
    this.addDevForm.get('uploadedBy').patchValue(this.name)
    this.addDevForm.get('attachment').patchValue(data.uploadfile)
  }


// ------------------------ Makes All The Controls As Touched When User Directly Clicks On Save Without Even Touching The Form --------------------------------------------------------


  

  submitAddForm(): void {
    for (const i in this.addForm.controls) {
      this.addForm.controls[i].markAsTouched()
      this.addForm.controls[i].updateValueAndValidity()
    }
  }

  submitaddDevForm(): void {
    for (const i in this.addDevForm.controls) {
      this.addDevForm.controls[i].markAsTouched()
      this.addDevForm.controls[i].updateValueAndValidity()
    }
  }

  // --------------------------- BreadCrumb Navigation ---------------------------------- 

  proj() {
    this.route.navigate(['/dashboard/projectDetails/', this.pName])
  }
  dashboard() {
    this.route.navigate(['/dashboard/allProjects'])
  }




  // --------------------------- Closes Milestones Edit Form  Dialogue --------------------------------------------

  cancelMilestoneEdit() {
    this.btnDisabled = false
    this.editMilestonePopup = false
  }
  editValues

  // ------------------------ Patches a Particular Milestone for Editing ----------------------------

  startEdit1(item): void {
    console.log('item', item)
    this.editValues = item
    this.editStartDate = new Date(item.StartDate)
    this.addForm.controls.addMileTitle.patchValue(item.Name)
    this.addForm.controls.MilestoneStartDate.patchValue(item.StartDate)
    this.addForm.controls.MilestoneEndDate.patchValue(item.EndDate)
  }

  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }

  
  startValue: Date | null = null
  endValue: Date | null = null
  endOpen = false
  current = new Date()
  actualDate = new Date(this.current.getTime() - 24 * 60 * 60 * 1000)

 
 

  //edit

  //---------------------- On Changing The Page Number On Load Method Is Called With Suitable Pagination Values ---------------------------------------

  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllData()
  }

  //---------------------- On Changing The Record Per Page On Load Method Is Called With Suitable Pagination Values ---------------------------------------


  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.pageNum = 1
    this.getAllData()
  }

  onChange(): void {
    this.getAllData()
  }

  //  --------------------------- Resets The Search Fields And Calls On Load Method -------------------------------

  resetSearchFields() {
    this.searchForm.reset()
    this.getAllData()
  }

  // ----------------- Based On Events Data Adds Multiple Files To The Array --------------------------

  changeListener($event): void {
    console.log($event)
    if ($event['type'] == 'removed') {
      let index = this.multipleFiles.findIndex(x => x.name === $event.file.originFileObj.name)
      console.log('index ', index)
      if (index >= 0) {
        this.multipleFiles.splice(index, 1)
      }
    }
    if ($event.file.status == 'done') {
      
      this.multipleFiles.push($event.file.originFileObj)
      console.log($event.file.originFileObj, this.multipleFiles)
      this.uploadedFile = $event.file.originFileObj.name
    }
  }

  //-------------------------- Disables Dates Before Current Day and Enables End Dates Start Date ------------------------------ 

  disabledStartDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0
  }

  disabledStartDate1 = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date(this.editValues.StartDate)) < 0
  }

  onStartdateChange(date: Date): void {
    this.startValue = date
    this.disabledEndDate = (current: Date): boolean => {
      return differenceInCalendarDays(current, new Date(this.startValue)) < 0
    }
  }
}
