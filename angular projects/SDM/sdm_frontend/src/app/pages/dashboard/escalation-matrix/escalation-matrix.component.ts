import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzMessageService } from 'ng-zorro-antd/message'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { Router, ActivatedRoute } from '@angular/router'
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

  perData: any
  editTable: any

  res: any

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private nzMessageService: NzMessageService,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
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
  boolean: boolean = false
  radioData: any
  isVisibleTop = false
  isVisibleMiddle = false

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
    this.editTable = this.fb.group({
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
  }

  getAllData() {
    // sessionStorage.setItem('SelectedItem', JSON.stringify(this.contactid));
    const id = sessionStorage.getItem('PId')
    console.log('Project ID', id)
    this.dataService.get(apis.escalationGet + id).subscribe((res: any) => {
      console.log('response', res)
      this.tableData = res
      console.log('tabledata', this.tableData)
    })
  }

  onCurrentPageDataChange(data) {
    console.log(data)
  }

  showModal(): void {
    this.isVisible = true
  }
  showModall(): void {
    this.isVisible = true
  }
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
    console.log('ramya', data)
    this.router.navigate(['/dashboard/demo', id])
    console.log('ramya', id)
  }
  goToProjectManager(data) {
    const id = data.ProjectManager[0].contactid
    console.log('ramya', data)
    this.router.navigate(['/dashboard/demo', id])
    console.log('ramya', id)
  }
  goToAccountManager(data) {
    const id = data.AccountManager[0].contactid
    console.log('ramya', data)
    this.router.navigate(['/dashboard/demo', id])
    console.log('ramya', id)
  }
  goToSalesManager(data) {
    const id = data.SalesManager[0].contactid
    console.log('ramya', data)
    this.router.navigate(['/dashboard/demo', id])
    console.log('ramya', id)
  }
  goToProjectSponser(data) {
    const id = data.ProjectSponser[0].contactid
    console.log('ramya', data)
    this.router.navigate(['/dashboard/demo', id])
    console.log('ramya', id)
  }
  goToExecutiveLevel(data) {
    const id = data.ExecutiveLevel[0].contactid
    console.log('ramya', data)
    this.router.navigate(['/dashboard/demo', id])
    console.log('ramya', id)
  }
  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  editRow(res): void {
    //this.tableData = res
    console.log('hii', this.tableData)

    this.res = this.tableData
    this.isVisible1 = true
    this.editTable.get('PTL').patchValue(res.ProjectTeamLead[0].contactid)
    //console.log("PTL",res.ProjectTeamLead[0].contactid);

    this.editTable.get('PM').patchValue(res.ProjectManager[0].contactid)
    this.editTable.get('AM').patchValue(res.AccountManager[0].contactid)
    this.editTable.get('SM').patchValue(res.SalesManager[0].contactid)
    this.editTable.get('PS').patchValue(res.ProjectSponser[0].contactid)
    // console.log("PTL",res.ProjectSponser[0].contactid);
    this.editTable.get('EL').patchValue(res.ExecutiveLevel[0].contactid)
  }
  updateTask() {
    // this.rowdata=this.rowdata.createdDate
    this.isVisible1 = false
    // this. domainId =this.tableData.domainId,
    // //this. modifiedBy =this.tableData.modifiedBy,
    // this.projectId =this.tableData.projectId,
    // this.escalationlevel=this.tableData.escalationlevel
    console.log('domainid', this.domainId)
    const data = {
      ProjectTeamLead: this.editTable.get('PTL').value,
      ProjectManager: this.editTable.get('PM').value,
      SalesManager: this.editTable.get('SM').value,
      AccountManager: this.editTable.get('AM').value,
      ProjectSponser: this.editTable.get('PS').value,
      ExecutiveLevel: this.editTable.get('EL').value,

      // description: this.editTable.get('textArea').value,
      // projectId: this.projectid,
      // taskId: this.taskId,
      // releaseId: this.releaseId,
      // assignedDate: this.assignedDate,
      // resolvedDate: this.resolvedDate,
      // severity: this.severity,
      // createdBy: this.createdBy,
      // modifiedBy: this.modifiedBy,
    }
    console.log(data)
    this.dataService.post(apis.escalationUpdate, data).subscribe((res: any) => {
      // console.log('upadet====>', res)
      this.getAllData()
    })
    this.isVisible = false
  }
}
