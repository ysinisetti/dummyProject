import { Router } from '@angular/router'
import { DataService } from './../../../data.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { apis } from 'src/app/api'
import { DatePipe } from '@angular/common'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-add-issues',
  templateUrl: './add-issues.component.html',
  styleUrls: ['./add-issues.component.scss'],
  providers: [DatePipe],
})
export class AddIssuesComponent implements OnInit {
  addIssueForm: FormGroup
  issueType: any
  status: any
  customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName

  severity: any
  bucket: any
  priority: any
  category: any
  resulationType: any[]
  ProjectName: any
  btnDisable: boolean
  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private dataService: DataService,
    private datePipe: DatePipe,
    private router: Router,
    private message: NzMessageService,
  ) {}
  dropDownList = [{ label: 'abc' }]
  ngOnInit(): void {
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName

    this.addIssueForm = this.fb.group({
      // ticktId: [null],
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
    })
  }
  addIssue() {
    this.btnDisable = true
    if (this.addIssueForm.invalid) {
      for (const i in this.addIssueForm.controls) {
        this.addIssueForm.controls[i].markAsTouched()
      }
    } else {
      const assignedDate = this.datePipe.transform(
        this.addIssueForm.get('assignedDate').value,
        'yyyy-dd-MM',
      )
      const targetDate = this.datePipe.transform(
        this.addIssueForm.get('targetDate').value,
        'yyyy-dd-MM',
      )
      const resolvedDate = this.datePipe.transform(
        this.addIssueForm.get('resolvedDate').value,
        'yyyy-dd-MM',
      )
      const deployedDate = this.datePipe.transform(
        this.addIssueForm.get('deployedDate').value,
        'yyyy-dd-MM',
      )
      const closedDate = this.datePipe.transform(
        this.addIssueForm.get('closedDate').value,
        'yyyy-dd-MM',
      )
      var projectDetails = JSON.parse(sessionStorage.getItem('projectDetails'))
      const data = {
        projectId: projectDetails.Id, // from session
        title: this.addIssueForm.get('title').value,
        description: this.addIssueForm.get('description').value,
        rootcause: this.addIssueForm.get('rootCauseAnalysis').value,
        resolutionnote: this.addIssueForm.get('resolution').value,
        taskId: 4, //title id // has to ask about ID
        releaseId: 2, //has to ask send title id
        assignedDate: assignedDate,
        targetDate: targetDate,
        resolvedDate: resolvedDate,
        deployedDate: deployedDate,
        closedDate: closedDate,
        uxType: this.addIssueForm.get('issueType').value,
        uxPriority: this.addIssueForm.get('priority').value,
        uxStatus: this.addIssueForm.get('status').value,
        uxSeverity: this.addIssueForm.get('severity').value,
        uxCategory: this.addIssueForm.get('category').value,
        uxBucket: this.addIssueForm.get('bucket').value,
        // created date is not there in requestBody
        uxApproval: '',
        uxResolution: this.addIssueForm.get('resolutionType').value,
        createdBy: JSON.parse(sessionStorage.getItem('loginData')).FName,
        modifiedBy: '', //has to ask
        assignedTo: this.addIssueForm.get('assignedTo').value,
        deployedBy: this.addIssueForm.get('deployedBY').value, //in add
        closedBy: '', // doubt // in Edit
        estimatedTime: this.addIssueForm.get('estimatedTime').value,
        consumedTime: this.addIssueForm.get('consumedTime').value,
        percentageComplete: this.addIssueForm.get('percentageComplete').value,
        affectedVersions: this.addIssueForm.get('affectedVersions').value,
        fixedVersions: this.addIssueForm.get('fixedVersions').value,
        components: this.addIssueForm.get('components').value,
        labels: this.addIssueForm.get('labels').value,
        environments: this.addIssueForm.get('environments').value,
        reference: this.addIssueForm.get('references').value,
      }
      console.log(data)
      this.dataService.post(apis.addIssue, data).subscribe((res: any) => {
        console.log(res)
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
          // this.message.success(`${res.success}`); //for error .error
          this.router.navigate(['/dashboard/defects'])
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
        }
      })
    }
  }
  resetIssue() {
    this.addIssueForm.reset()
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
