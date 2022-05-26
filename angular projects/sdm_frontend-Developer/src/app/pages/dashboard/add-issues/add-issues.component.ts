import { Router } from '@angular/router'
import { DataService } from './../../../data.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { apis } from 'src/app/api'
import { DatePipe } from '@angular/common'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
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
  size: NzSelectSizeType = 'default'
  severity: any
  bucket: any
  priority: any
  category: any
  resulationType: any[]
  ProjectName: any
  btnDisable: boolean
  listOfResources: any
  environment: any
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
                                                                                    ///////////PRIORITY DROP DOWN
    this.dataService.get(apis.issuesPriority).subscribe(res => {
      this.priority = res
      this.addIssueForm.controls.priority.patchValue(this.priority.filter(x=>x.optionValue === 'Low')[0].optionKey)
    })
                                                                                    ////////////SEVERITY DROP DOWN
    this.dataService.get(apis.issuesSeverity).subscribe(res => {
      this.severity = res
    })
                                                                                    ////////////Environment drop down
 this.dataService.get(apis.enviruonmentDropDown).subscribe((res)=>{
   this.environment = res
    this.addIssueForm.controls.environments.patchValue(this.environment.filter(x=>x.Label === 'Prod')[0].Value)
 })

    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.addIssueForm = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(70)]],
      issueType: [null],
      estimatedTime: [null, [Validators.maxLength(11), Validators.pattern('^[0-9]$')]],
      status: [null] ,
      priority: [null],
      severity: [null],
      bucket: [null],
      category: [null],
      components: [null, [Validators.maxLength(100), Validators.pattern('^[A-Za-z ]*$')]],
      environments: [null, [Validators.maxLength(25), Validators.pattern('^[A-Za-z ]*$')]],
      affectedVersions: [null, [Validators.maxLength(50), Validators.pattern('^[A-Za-z ]*$')]],
      labels: [null, [Validators.maxLength(50), Validators.pattern('^[A-Za-z ]*$')]],
      fixedVersions: [null, [Validators.maxLength(50), Validators.pattern('^[A-Za-z ]*$')]],
      assignedDate: [null],
      targetDate: [null],
      description: [null, [Validators.maxLength(255)]],
      rootCauseAnalysis: [null, [Validators.maxLength(255)]],
      resolution: [null, [Validators.maxLength(255)]],
    })                                                                                   /////////////////lookup list
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
      this.issueType = ITType
      this.status = IsType
      this.severity = SIType
      this.bucket = IBType
      this.category = ICType
      this.resulationType = IRType
      this.addIssueForm.controls.status.patchValue(this.status.filter(x=>x.optionValue === 'Created')[0].optionKey)
      this.addIssueForm.controls.status.disable();
      this.addIssueForm.controls.severity.patchValue(this.severity.filter(x=>x.optionValue === 'Minor')[0].optionKey)
      this.addIssueForm.controls.bucket.patchValue(this.bucket.filter(x=>x.optionValue === 'Under Review')[0].optionKey)
      this.addIssueForm.controls.category.patchValue(this.category.filter(x=>x.optionValue === 'User Interface')[0].optionKey)
      this.addIssueForm.controls.issueType.patchValue(this.issueType.filter(x=>x.optionValue === ' Defect')[0].optionKey)
    })
    this.getContacts()
  }
                                                                          /////////////display the list of resources
  getContacts() {
    const children: Array<{ label: string; value: string }> = []
    this.dataService.get(apis.allResources).subscribe((res: any) => {
      this.listOfResources = res
      this.listOfResources.forEach(x => {
        children.push({ label: x.UserName, value: x.UserName })
      })
      this.listOfResources = children
    })
  }

  submitAdd() {                                                          ////////////TO VALIDATE 
    for (const i in this.addIssueForm.controls) {
      this.addIssueForm.controls[i].markAsTouched()
      this.addIssueForm.controls[i].updateValueAndValidity()
    }
  }

  addIssue() {
    this.btnDisable = true
    if (this.addIssueForm.invalid) {
      for (const i in this.addIssueForm.controls) {
        this.addIssueForm.controls[i].markAsTouched()
      }
    } else {
      var projectDetails = JSON.parse(sessionStorage.getItem('projectDetails'))
      const data = {
        projectId: projectDetails.Id, 
        title: this.addIssueForm.get('title').value,
        description: this.addIssueForm.get('description').value,
        rootcause: this.addIssueForm.get('rootCauseAnalysis').value,
        resolutionnote: '',
        taskId: 4,
        releaseId: 2,
        assignedDate: this.datePipe.transform(new Date(),'yyyy-MM-dd'),
        targetDate:'',
        resolvedDate: '',
        deployedDate: '',
        closedDate: '',
        uxType: this.addIssueForm.get('issueType').value,
        uxPriority: this.addIssueForm.get('priority').value,
        uxStatus: this.addIssueForm.get('status').value,
        uxSeverity: this.addIssueForm.get('severity').value,
        uxCategory: this.addIssueForm.get('category').value,
        uxBucket: this.addIssueForm.get('bucket').value,
        uxApproval: '',
        uxResolution: '',
        createdBy: JSON.parse(sessionStorage.getItem('loginData')).FName,
        modifiedBy: '',
        assignedTo: '',
        deployedBy: '',
        closedBy: '',
        estimatedTime: this.addIssueForm.get('estimatedTime').value,
        consumedTime: '',
        percentageComplete: '',
        affectedVersions: this.addIssueForm.get('affectedVersions').value,
        fixedVersions: '',
        components: this.addIssueForm.get('components').value,
        labels: this.addIssueForm.get('labels').value,
        environments: this.addIssueForm.get('environments').value,
        reference: '',
      }
      this.dataService.post(apis.addIssue, data).subscribe((res: any) => {
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
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
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
