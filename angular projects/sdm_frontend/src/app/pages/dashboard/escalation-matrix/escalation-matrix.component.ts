import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzMessageService } from 'ng-zorro-antd/message'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { Router, ActivatedRoute } from '@angular/router'
import { NzNotificationService } from 'ng-zorro-antd'
interface ItemData {
  department: string
  ProjectTeamLead: string
  ProjectManager: string
  AccountManager: string
  SalesManager: string
  ProjectSponser: string
  ExecutiveLevel: string
}
@Component({
  selector: 'app-escalation-matrix',
  templateUrl: './escalation-matrix.component.html',
  styleUrls: ['./escalation-matrix.component.scss'],
})
export class EscalationMatrixComponent implements OnInit {
  length: any
  projectId: number
  contactid: any
  domainId: number
  escalationlevel: number
  selectedProject: any
  projectTitle: String
  ProjectName: string
  isVisible1: boolean = false
  data2: []
  isVisible4: boolean
  perData: any
  editTable: any

  res: any
  addTable: any
  createdBy: string
  workDomainId: string
  modifiedBy: string
  pageSize: number
  pageNum: number
  totalPages: number
  cName: any
  createData: any
  CustomerName: any
  //modifiedBy: any

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private nzMessageService: NzMessageService,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
  ) {}
  disabled = false

  isVisible = false
  isConfirmLoading = false
  optionForm: FormGroup
  displaySmsTags: boolean = false
  displayEmailTags: boolean = false
  hideRadioBtns: boolean = true

  tableData = []

  optionList1 = [
    { label: 'All', value: 'All' },
    { label: 'Scoop Text', value: 'Scoop Text' },
    { label: 'Hubble', value: 'Hubble' },
    { label: 'Request Management', value: 'Request Management' },
    { label: 'Task Managment', value: 'Task Managment' },
    { label: 'Risk Managementll', value: 'Risk Management' },
    { label: 'Project Manager', value: 'Project Manager' },
    { label: 'BPM', value: 'BPM' },
    { label: 'Meeting Manager', value: 'Meeting Manager' },
    { label: 'Gentex Inc', value: 'Gentex Inc' },
  ]
  optionList = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' },
  ]
  prjForm: FormGroup
  searchform: FormGroup
  boolean: boolean = false
  radioData: any
  isVisibleTop = false
  isVisibleMiddle = false
  header = 'Search'

  ngOnInit(): void {
    this.optionForm = this.fb.group({
      radioData: [],
      name: [null, Validators.required],
      phone: [null, Validators.required],
      Name: [null, Validators.required, Validators.pattern['A-Za-z']],
      email: [null, Validators.required, Validators.email],
      subject: [null, Validators.required],
      message: [null, Validators.required],
    })
    this.searchform = this.fb.group({
      contactName: [null],
    })
    // this.pageSize=5;
    // this.pageNum=1;
    // this.totalPages=10;

    //this.getTableDataBySearch();

    this.selectedProject = this.route.params.subscribe(params => {
      this.projectTitle = params['title']
      console.log('title', this.projectTitle)
    })
    this.editTable = this.fb.group({
      MAT: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      PM: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      PTL: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      AM: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],

      SM: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      PS: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],

      // textArea: [
      //     null,
      //     [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      // ],
      EL: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
    })

    this.getAllData()
    this.ProjectName = sessionStorage.getItem('pName')
    //console.log("gfghfhgfjh",this.ProjectName );

    this.addTable = this.fb.group({
      MAT: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      PM: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      PTL: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      AM: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],

      SM: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
      PS: [
        '',
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],

      EL: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[\\sa-zA-z]*$')],
      ],
    })
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    console.log('mouni', this.projectId)
    // this.pName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.CustomerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName

    // this.ProjectName = sessionStorage.getItem('pName')
  }

  getAllData() {
    const contactName = this.searchform.controls.contactName.value
    const id = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    const data = {
      projectId: id,
      contactId: contactName === null || contactName === undefined ? '' : contactName,
    }
    console.log('ramyaa', data)

    this.dataService.post(apis.escalationGet, data).subscribe((res: any) => {
      this.tableData = res
      console.log('REsponse', this.tableData)
    })
  }

  proj() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  dashboard() {
    this.router.navigate(['/dashboard/projectDetails/ProjectName'])
  }

  // onCurrentPageDataChange(data) {
  //   console.log(data)
  // }

  showModal(): void {
    this.isVisible = true
  }
  // showModall(): void {
  //   this.isVisible = true
  // }
  handleOk(): void {
    this.isConfirmLoading = false
    this.isVisible = false
    this.radioData = this.optionForm.get('radioData').value
    console.log(this.radioData)
    if (this.radioData === 'Sms') {
      this.showModalTop()
    } else {
      this.showModalMiddle()
    }
  }
  handleCancel(): void {
    this.isVisible = false
    this.isVisible1 = false
    this.isVisible4 = false
  }

  sendData() {
    console.log('data', this.optionForm.value)
    this.isVisible = false
  }

  showModalTop(): void {
    this.isVisibleTop = true
  }

  showModalMiddle(): void {
    this.isVisibleMiddle = true
  }

  handleOkTop(): void {
    this.isVisibleTop = false
  }

  handleCancelTop(): void {
    this.isVisibleTop = false
  }

  handleOkMiddle(): void {
    this.isVisibleMiddle = false
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false
  }
  goToProjectTeamLead(data) {
    const id = data.ProjectTeamLead[0].contactid
    // console.log('ramya', data)
    this.router.navigate(['/dashboard/demo', id])
    // console.log('ramya', id)
  }
  goToProjectManager(data) {
    const id = data.ProjectManager[0].contactid
    // console.log('ramya', data)
    this.router.navigate(['/dashboard/demo', id])
    // console.log('ramya', id)
  }
  goToAccountManager(data) {
    const id = data.AccountManager[0].contactid
    // console.log('ramya', data)
    this.router.navigate(['/dashboard/demo', id])
    // console.log('ramya', id)
  }
  goToSalesManager(data) {
    const id = data.SalesManager[0].contactid
    // console.log('ramya', data)
    this.router.navigate(['/dashboard/demo', id])
    // console.log('ramya', id)
  }
  goToProjectSponser(data) {
    const id = data.ProjectSponser[0].contactid
    // console.log('ramya', data)
    this.router.navigate(['/dashboard/demo', id])
    // console.log('ramya', id)
  }
  goToExecutiveLevel(data) {
    const id = data.ExecutiveLevel[0].contactid
    // console.log('ramya', data)
    this.router.navigate(['/dashboard/demo', id])
    // console.log('ramya', id)
  }
  details() {
    //this.ProjectName = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }

  editRow(res): void {
    //this.tableData = res
    console.log('hii', this.tableData)

    this.res = this.tableData
    this.isVisible1 = true
    this.editTable.get('MAT').patchValue(res.department)
    // this.editTable.get('PTL').patchValue(res.ProjectTeamLead[0].contactid)
    //console.log("PTL",res.ProjectTeamLead[0].contactid);

    this.editTable.get('PM').patchValue(res.ProjectManager[0].contactid)
    this.editTable.get('AM').patchValue(res.AccountManager[0].contactid)
    this.editTable.get('SM').patchValue(res.SalesManager[0].contactid)
    this.editTable.get('PS').patchValue(res.ProjectSponser[0].contactid)
    // console.log("PTL",res.ProjectSponser[0].contactid);
    this.editTable.get('EL').patchValue(res.ExecutiveLevel[0].contactid)
  }

  // =================UPDATE ROW=================

  updateTask() {
    const Id = this.projectId
    // this.rowdata=this.rowdata.createdDate
    this.isVisible1 = false
    // this. domainId =this.tableData.domainId,
    //this. modifiedBy =this.tableData.modifiedBy,
    // this.projectId =this.tableData.projectId,
    // this.escalationlevel=this.tableData.escalationlevel
    console.log('domainid', this.domainId)
    const data = {
      domainTitle: this.editTable.controls.MAT.value,
      projectDomainEscalations: [
        {
          escalationLevel: 1,
          contactId: this.editTable.get('PTL').value,
          projectId: Id,
          modifiedBy: 'chinnari',
        },
        {
          escalationLevel: 2,
          contactId: this.editTable.get('PM').value,
          projectId: Id,
          modifiedBy: 'chinnari',
        },
        {
          escalationLevel: 3,
          contactId: this.editTable.get('AM').value,
          projectId: Id,
          modifiedBy: 'chinnari',
        },
        {
          escalationLevel: 4,
          contactId: this.editTable.get('SM').value,
          projectId: Id,
          modifiedBy: 'chinnari',
        },
        {
          escalationLevel: 5,
          contactId: this.editTable.get('PS').value,
          projectId: Id,
          modifiedBy: 'chinnari',
        },
        {
          escalationLevel: 6,
          contactId: this.editTable.get('EL').value,
          projectId: Id,
          modifiedBy: 'chinnari',
        },
      ],
    }

    console.log(data)
    this.dataService.post(apis.escalationUpdate, data).subscribe((res: any) => {
      // console.log('update====>', res)
      this.getAllData()

      this.createData = res
      console.log('createData data=======>', this.createData)
      if (this.createData.hasOwnProperty('success') === true) {
        this.notification.create(
          'success',
          'Successfully Updated',
          'Your data has been successfully Updated',
        )
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
      }
    })
    this.isVisible = false
  }

  addRow1(): void {
    this.isVisible4 = true
  }

  // ===================DELETE ROW==================
  deleteRow(data) {
    const id = this.projectId
    // this.rowdata=this.rowdata.createdDate
    console.log('ID', data)

    let dId = {
      domainTitle: data.department,
      projectId: id,
    }
    console.log('ramyaaa', dId)
    this.dataService.post(apis.escalationDelete, dId).subscribe(res => {
      console.log('deleted')
      this.getAllData()
      console.log(res)
      this.createData = res
      console.log('createData data=======>', this.createData)
      if (this.createData.hasOwnProperty('Domains Result') === true) {
        this.notification.create(
          'success',
          'Successfully Deleted',
          'Your data has been successfully Deleted',
        )
      } else {
        this.notification.create('error', 'Failed to Delete', 'Your data is failed to Delete ')
      }
    })
    //this.tableData = this.tableData.filter(d => d.issueTitle !== id)
  }

  // =================ADD ROW=================

  addTask() {
    const id = this.projectId
      // const id = sessionStorage.getItem('PId')
    ;(this.createdBy = 'sai'),
      //this.workDomainId = 702,
      // this.description = "Project domain escalations",
      (this.modifiedBy = 'sai')
    let dataToAPI = {
      domainTitle: this.addTable.controls.MAT.value,
      seqNo: 7,
      createdBy: 'chinnari',
      workDomainId: 125,
      modifiedBy: 'chinnari',
      projectId: id,
      projectDomainEscalations: [
        {
          contactId: this.addTable.controls.PTL.value,
          createdBy: 'jahnavi',
          workDomainId: 702,
          description: 'Project domain escalations',
          modifiedBy: 'jahnavi',
          projectId: id,
          escalationLevel: 1,
        },
        {
          contactId: this.addTable.controls.PM.value,
          createdBy: 'Chinnari',
          workDomainId: 702,
          description: 'Project domain escalations',
          modifiedBy: 'Chinnari',
          projectId: id,
          escalationLevel: 2,
        },
        {
          contactId: this.addTable.controls.AM.value,
          createdBy: 'ajay',
          workDomainId: 702,
          description: 'Project domain escalations',
          modifiedBy: 'ajay',
          projectId: id,
          escalationLevel: 3,
        },
        {
          contactId: this.addTable.controls.SM.value,
          createdBy: 'sai',
          workDomainId: 702,
          description: 'Project domain escalations',
          modifiedBy: 'sai',
          projectId: id,
          escalationLevel: 4,
        },
        {
          contactId: this.addTable.controls.PS.value,
          createdBy: 'supraja',
          workDomainId: 702,
          description: 'Project domain escalations',
          modifiedBy: 'supraja',
          projectId: 1,
          escalationLevel: 5,
        },
        {
          contactId: this.addTable.controls.EL.value,
          createdBy: 'ramya',
          workDomainId: 702,
          description: 'Project domain escalations',
          modifiedBy: 'ramya',
          projectId: id,
          escalationLevel: 6,
        },
      ],
    }
    console.log('--->data to table', dataToAPI)
    this.dataService.post(apis.escalationAdd, dataToAPI).subscribe((res: any) => {
      this.getAllData()
      console.log(res)
      this.createData = res
      console.log('createData data=======>', this.createData)
      if (this.createData.hasOwnProperty('success') === true) {
        this.notification.create(
          'success',
          'Successfully Added',
          'Your data has been successfully added',
        )
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
      }
    })
    this.isVisible4 = false
    this.addTable.reset()
  }
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllData()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.getAllData()
  }

  onChange(): void {
    this.getAllData()
  }
  resetSearchFields() {
    this.searchform.reset()
    this.getAllData()
  }
}
