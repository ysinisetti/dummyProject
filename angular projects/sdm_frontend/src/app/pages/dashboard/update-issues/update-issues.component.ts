import { DatePipe } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { DataService } from './../../../data.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { apis } from 'src/app/api'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-update-issues',
  templateUrl: './update-issues.component.html',
  styleUrls: ['./update-issues.component.scss'],
  providers: [DatePipe],
})
export class UpdateIssuesComponent implements OnInit {
  updateIssueForm: FormGroup
  customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName

  loginPerson: any
  projectId: any
  selectedId: any
  id: any
  issueType: any[]
  status: any[]
  priority: any[]
  severity: any[]
  bucket: any[]
  category: any[]
  resulationType: any[]
  issuesData: any
  ProjectName: any
  btnDisable: boolean

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private message: NzMessageService,
  ) {
    this.dataService.get(apis.issueDropDown).subscribe((res: any) => {
      const data = res
      const IAType = []
      const IBType = []
      const IsType = []
      const ITType = []
      const ICType = []
      const IpType = []
      const IRType = []
      const SIType = []
      console.log(res)
      data.forEach(element => {
        if (element.optionType === 'IA') {
          IAType.push(element)
        } else if (element.optionType === 'IB') {
          IBType.push(element)
        } else if (element.optionType === 'IT') {
          ITType.push(element)
        } else if (element.optionType === 'IC') {
          ICType.push(element)
        } else if (element.optionType === 'IR') {
          IRType.push(element)
        } else if (element.optionType === 'SI') {
          SIType.push(element)
        } else if (element.optionType === 'Is') {
          IsType.push(element)
        } else if (element.optionType === 'Ip') {
          IpType.push(element)
        }
      })
      console.log(IAType, IBType, ITType, ICType, IRType, SIType, IsType, IpType)
      this.issueType = ITType
      this.status = IsType
      this.priority = IpType
      this.severity = SIType
      this.bucket = IBType
      this.category = ICType
      this.resulationType = IRType
      console.log('checkind=g dd', this.issueType)

      this.getById()
    })
  }
  dropDownList = [{ label: 'abc' }]
  ngOnInit(): void {
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails'))
    this.loginPerson = JSON.parse(sessionStorage.getItem('loginData'))
    console.log(this.projectId, this.loginPerson)
    this.selectedId = this.route.params.subscribe(params => {
      this.id = params['id']
      console.log(this.id)
    })

    this.updateIssueForm = this.fb.group({
      ticktId: [null],
      title: [null],
      issueType: [null],
      estimatedTime: [null],
      consumedTime: [null],
      status: [null],
      percentageComplete: [null],
      priority: [null],
      severity: [null],
      bucket: [null],
      category: [null],
      resolutionType: [null],
      components: [null],
      environments: [null],
      affectedVersions: [null],
      labels: [null],
      fixedVersions: [null],
      references: [null],
      createdBy: [null],
      assignedTo: [null],
      deployedBY: [null],
      createdDate: [null],
      assignedDate: [null],
      deployedDate: [null],
      targetDate: [null],
      resolvedDate: [null],
      closedDate: [null],
      description: [null],
      rootCauseAnalysis: [null],
      resolution: [null],
    })
  }

  getById() {
    console.log(this.id)
    this.dataService.getIssuesById(apis.getWithId, this.id).subscribe(res => {
      this.issuesData = res
      console.log('binding data', this.issuesData)
      console.log('checking binding')
      console.log(this.resulationType.filter(x => x.optionKey === this.issuesData.uxResolution)[0])
      this.updateIssueForm.get('assignedDate').patchValue(this.issuesData.assignedDate)
      //this.updateIssueForm.get('closedBy').patchValue(values.closedBy)
      this.updateIssueForm.get('ticktId').patchValue(this.issuesData.id)
      this.updateIssueForm.get('components').patchValue(this.issuesData.components)
      this.updateIssueForm.get('references').patchValue(this.issuesData.references)
      this.updateIssueForm.get('environments').patchValue(this.issuesData.environments)
      this.updateIssueForm.get('description').patchValue(this.issuesData.description)
      this.updateIssueForm.get('consumedTime').patchValue(this.issuesData.consumedTime)
      this.updateIssueForm.get('title').patchValue(this.issuesData.title)
      this.updateIssueForm.get('assignedTo').patchValue(this.issuesData.assignedTo)
      //this.updateIssueForm.get('releaseId').patchValue(this.issuesData.releaseId)
      this.updateIssueForm.get('rootCauseAnalysis').patchValue(this.issuesData.rootCause)
      this.updateIssueForm.get('deployedDate').patchValue(this.issuesData.deployedDate)
      this.updateIssueForm.get('resolvedDate').patchValue(this.issuesData.resolvedDate)
      this.updateIssueForm.get('estimatedTime').patchValue(this.issuesData.estimatedTime)
      //this.updateIssueForm.get('uxApproval').patchValue(this.issuesData.uxApproval)
      this.updateIssueForm.get('targetDate').patchValue(this.issuesData.targetDate)
      this.updateIssueForm.get('deployedBY').patchValue(this.issuesData.deployedBy)
      this.updateIssueForm.get('fixedVersions').patchValue(this.issuesData.fixedVersions)
      this.updateIssueForm.get('labels').patchValue(this.issuesData.labels)
      this.updateIssueForm.get('createdDate').patchValue(this.issuesData.createdDate)
      this.updateIssueForm.get('closedDate').patchValue(this.issuesData.closedDate)
      this.updateIssueForm.get('createdBy').patchValue(this.issuesData.createdBy)
      this.updateIssueForm.get('percentageComplete').patchValue(this.issuesData.percentageComplete)
      this.updateIssueForm.get('resolution').patchValue(this.issuesData.resolutionNote)
      this.updateIssueForm.get('affectedVersions').patchValue(this.issuesData.affectedVersions)
      this.updateIssueForm
        .get('status')
        .patchValue(this.status.filter(x => x.optionKey === this.issuesData.uxStatus)[0].optionKey)
      //this.updateIssueForm.get('taskId').patchValue(this.issuesData.taskId)
      this.updateIssueForm
        .get('category')
        .patchValue(
          this.category.filter(x => x.optionKey === this.issuesData.uxCategory)[0].optionKey,
        )
      this.updateIssueForm
        .get('issueType')
        .patchValue(this.issueType.filter(x => x.optionKey === this.issuesData.uxType)[0].optionKey)
      this.updateIssueForm
        .get('severity')
        .patchValue(
          this.severity.filter(x => x.optionKey === this.issuesData.uxSeverity)[0].optionKey,
        )
      this.updateIssueForm
        .get('priority')
        .patchValue(
          this.priority.filter(x => x.optionKey === this.issuesData.uxPriority)[0].optionKey,
        )
      this.updateIssueForm
        .get('resolutionType')
        .patchValue(
          this.resulationType.filter(x => x.optionKey === this.issuesData.uxResolution)[0]
            .optionKey,
        )
      this.updateIssueForm
        .get('bucket')
        .patchValue(this.bucket.filter(x => x.optionKey === this.issuesData.uxBucket)[0].optionKey)
    })
  }
  save() {
    this.btnDisable = true
    const assignedDate = this.datePipe.transform(
      this.updateIssueForm.get('assignedDate').value,
      'yyyy-dd-MM',
    )
    const targetDate = this.datePipe.transform(
      this.updateIssueForm.get('targetDate').value,
      'yyyy-dd-MM',
    )
    const resolvedDate = this.datePipe.transform(
      this.updateIssueForm.get('resolvedDate').value,
      'yyyy-dd-MM',
    )
    const deployedDate = this.datePipe.transform(
      this.updateIssueForm.get('deployedDate').value,
      'yyyy-dd-MM',
    )
    const closedDate = this.datePipe.transform(
      this.updateIssueForm.get('closedDate').value,
      'yyyy-dd-MM',
    )
    let reqBody = {
      assignedDate: assignedDate,
      uxCategory: this.updateIssueForm.controls.category.value,
      closedBy: this.issuesData.closedBy, //closedBy
      components: this.updateIssueForm.controls.components.value,
      references: this.updateIssueForm.controls.references.value,
      environments: this.updateIssueForm.controls.environments.value,
      description: this.updateIssueForm.controls.description.value,
      consumedTime: this.updateIssueForm.controls.consumedTime.value,
      title: this.updateIssueForm.controls.title.value,
      assignedTo: this.updateIssueForm.controls.assignedTo.value,
      releaseId: this.issuesData.releaseId, //releaseId
      uxType: this.updateIssueForm.controls.issueType.value, //issuetype
      rootCause: this.updateIssueForm.controls.rootCauseAnalysis.value,
      deployedDate: deployedDate,
      modifiedBy: this.loginPerson.FName,
      id: this.id,
      uxSeverity: this.updateIssueForm.controls.severity.value,
      resolvedDate: resolvedDate,
      uxPriority: this.updateIssueForm.controls.priority.value,
      estimatedTime: this.updateIssueForm.controls.estimatedTime.value,
      uxApproval: this.issuesData.uxApproval, //uxApproval
      targetDate: targetDate,
      deployedBy: this.updateIssueForm.controls.deployedBY.value,
      fixedVersions: this.updateIssueForm.controls.fixedVersions.value,
      labels: this.updateIssueForm.controls.labels.value,
      closedDate: closedDate,
      createdBy: JSON.parse(sessionStorage.getItem('loginData')).FName,
      percentageComplete: this.updateIssueForm.controls.percentageComplete.value,
      uxResolution: this.updateIssueForm.controls.resolutionType.value,
      uxBucket: this.updateIssueForm.controls.bucket.value,
      resolutionNote: this.updateIssueForm.controls.resolution.value,
      affectedVersions: this.updateIssueForm.controls.affectedVersions.value,
      projectId: this.projectId.Id,
      uxStatus: this.updateIssueForm.controls.status.value,
      taskId: this.issuesData.taskId, // taskId
    }
    console.log('checking request body', reqBody)
    this.dataService.post(apis.updateIssue, reqBody).subscribe(res => {
      if (res.hasOwnProperty('success') === true) {
        setTimeout(() => {
          this.notification.create('success', 'Successfully Added', 'Record updated successfully')
          // this.message.success(`${res.success}`);
        }, 1000)
        this.router.navigate(['/dashboard/defects'])
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
      }
    })
  }
  updateIssue() {
    if (this.updateIssueForm.invalid) {
      for (const i in this.updateIssueForm.controls) {
        this.updateIssueForm.controls[i].markAsTouched()
      }
    } else {
      console.log('data', this.updateIssueForm.value)
    }
  }
  resetIssue() {
    this.updateIssueForm.reset()
  }
  backNavigate() {
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  //////////////////////Breadcrumb//////////////////

  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }

  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
