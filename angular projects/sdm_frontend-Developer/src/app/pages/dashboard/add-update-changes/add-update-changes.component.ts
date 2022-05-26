import { DatePipe } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { DataService } from './../../../data.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { apis } from 'src/app/api'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
@Component({
  selector: 'app-add-update-changes',
  templateUrl: './add-update-changes.component.html',
  styleUrls: ['./add-update-changes.component.scss'],
  providers: [DatePipe],
})
export class AddUpdateChangesComponent implements OnInit {
  addUpdateChangeForm: FormGroup
  issueType: any[]
  status: any[]
  priority: any
  severity: any[]
  bucket: any[]
  createdby: any
  category: any[]
  resulationType: any[]
  ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
  projectId = JSON.parse(sessionStorage.getItem('projectDetails'))
  loginPerson = JSON.parse(sessionStorage.getItem('loginData'))
  customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
  selectedId: any
  id: any
  size: NzSelectSizeType = 'default'
  issuesData: any
  btnLabel: string
  title: string
  endPoint: string
  listOfResources: any
  icon: string
  enable: boolean
  environment: any

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
        }
      })
      this.issueType = ITType
      this.status = IsType
      this.severity = SIType
      this.bucket = IBType
      this.category = ICType
      this.resulationType = IRType
      this.addUpdateChangeForm.controls.status.patchValue(this.status.filter(x=>x.optionValue === 'Created')[0].optionKey)
      this.addUpdateChangeForm.controls.severity.patchValue(this.severity.filter(x=>x.optionValue === 'Minor')[0].optionKey)
      this.addUpdateChangeForm.controls.bucket.patchValue(this.bucket.filter(x=>x.optionValue === 'Under Review')[0].optionKey)
      this.addUpdateChangeForm.controls.category.patchValue(this.category.filter(x=>x.optionValue === 'User Interface')[0].optionKey)
      this.addUpdateChangeForm.controls.issueType.patchValue(this.issueType.filter(x=>x.optionValue === ' Defect')[0].optionKey)
    })
  }

  ngOnInit() {
                                                                            ///////Environment drop down
   this.dataService.get(apis.enviruonmentDropDown).subscribe((res)=>{
    this.environment = res
     this.addUpdateChangeForm.controls.environments.patchValue(this.environment.filter(x=>x.Label === 'Prod')[0].Value)
  })
                                                                            ///////PRIORITY DROP DOWN
    this.dataService.get(apis.issuesPriority).subscribe((res)=>{
      this.priority=res
      this.addUpdateChangeForm.controls.priority.patchValue(this.priority.filter(x=>x.optionValue === 'Low')[0].optionKey)
      })


    this.selectedId = this.route.params.subscribe(params => {
      this.id = params['id']
    })
    this.addUpdateChangeForm = this.fb.group({
      ticktId: [null, [Validators.maxLength(4), Validators.pattern('^[0-9]{0,4}$')]],
      title: [null,[Validators.required, Validators.maxLength(70), Validators.pattern('^[a-zA-Z ]*$')]],
      issueType: [null],
      estimatedTime: [null, [Validators.pattern('^[0-9]$')]],
      consumedTime: [null, [Validators.pattern('^[0-9]$')]],
      status: [null],
      percentageComplete: [null, [Validators.pattern('^[0-9]{0,3}$')]],
      priority: [null],
      severity: [null],
      bucket: [null],
      category: [null],
      resolutionType: [null],
      components: [null, [Validators.maxLength(100), Validators.pattern('^[a-zA-Z ]*$')]],
      environments: [null, [Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      affectedVersions: [null, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      labels: [null, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      fixedVersions: [null, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      references: [null, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      assignedTo: [null, [Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      deployedBY: [null, [Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      assignedDate: [null],
      deployedDate: [null],
      targetDate: [null],
      resolvedDate: [null],
      closedDate: [null],
      description: [null],
      rootCauseAnalysis: [null],
      resolution: [null],
    })
    this.getContacts()
    this.toHandleScreens()
  }
                                                                          /////////////////List of Resources 
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
                                                                          ///////Replacing the values/////////
  toHandleScreens() {
    if (this.router.url.includes('update')) {
      this.btnLabel = 'Update'
      this.title = 'Edit'
      this.icon = 'edit'
      this.getById()
      this.endPoint = apis.updateChanges
      this.editData()
      this.enable=true;
      this.addUpdateChangeForm.get('ticktId').disable()
    } else {
      this.btnLabel = 'Save'
      this.enable=false;
      this.title = 'Add'
      this.icon = 'save'
      this.endPoint = apis.postChanges
      this.addUpdateChangeForm.controls.status.disable();
    }
  }
  editData() {
    throw new Error('Method not implemented.')
  }
  addRUpdateChanges() {
    if (this.addUpdateChangeForm.invalid) {
      for (const i in this.addUpdateChangeForm.controls) {
        this.addUpdateChangeForm.controls[i].markAsTouched()
      }
    } else {
      const assignedDate = this.datePipe.transform(this.addUpdateChangeForm.get('assignedDate').value,'yyyy-MM-dd', )
      const targetDate = this.datePipe.transform(
        this.addUpdateChangeForm.get('targetDate').value,
        'yyyy-MM-dd',
      )
      const resolvedDate = this.datePipe.transform(
        this.addUpdateChangeForm.get('resolvedDate').value,
        'yyyy-MM-dd',
      )
      const deployedDate = this.datePipe.transform(
        this.addUpdateChangeForm.get('deployedDate').value,
        'yyyy-MM-dd',
      )
      const closedDate = this.datePipe.transform(
        this.addUpdateChangeForm.get('closedDate').value,
        'yyyy-MM-dd',
      )
      var projectDetails = JSON.parse(sessionStorage.getItem('projectDetails'))
      const data = {
        projectId: projectDetails.Id, // from session
        title: this.addUpdateChangeForm.get('title').value,
        description: this.addUpdateChangeForm.get('description').value,
        rootCause: this.addUpdateChangeForm.get('rootCauseAnalysis').value,
        resolutioNote: this.addUpdateChangeForm.get('resolution').value,
        taskId: 4, //title id // has to ask about ID
        releaseId: 2, //has to ask send title id
        assignedDate: assignedDate,
        targetDate: targetDate,
        resolvedDate: resolvedDate,
        deployedDate: deployedDate,
        closedDate: closedDate,
        uxType: this.addUpdateChangeForm.get('issueType').value,
        uxPriority: this.addUpdateChangeForm.get('priority').value,
        uxStatus: this.addUpdateChangeForm.get('status').value,
        uxSeverity: this.addUpdateChangeForm.get('severity').value,
        uxCategory: this.addUpdateChangeForm.get('category').value,
        uxBucket: this.addUpdateChangeForm.get('bucket').value,
        id: this.router.url.includes('update') ? this.issuesData.id : '',
        uxApproval: '',
        uxResolution: this.addUpdateChangeForm.get('resolutionType').value,
        createdBy: this.router.url.includes('Update') ? this.createdby : JSON.parse(sessionStorage.getItem('loginData')).FName,
        modifiedBy: this.router.url.includes('Update') ? JSON.parse(sessionStorage.getItem('loginData')).FName : '',
        assignedTo: this.addUpdateChangeForm.get('assignedTo').value,
        deployedBy: this.addUpdateChangeForm.get('deployedBY').value, //in add
        closedBy: this.router.url.includes('Update') ? JSON.parse(sessionStorage.getItem('loginData')).FName : '',
        estimatedTime: this.addUpdateChangeForm.get('estimatedTime').value,
        consumedTime: this.addUpdateChangeForm.get('consumedTime').value,
        percentageComplete: this.addUpdateChangeForm.get('percentageComplete').value,
        affectedVersions: this.addUpdateChangeForm.get('affectedVersions').value,
        fixedVersions: this.addUpdateChangeForm.get('fixedVersions').value,
        components: this.addUpdateChangeForm.get('components').value,
        labels: this.addUpdateChangeForm.get('labels').value,
        environments: this.addUpdateChangeForm.get('environments').value,
        references: this.addUpdateChangeForm.get('references').value,
      }
      this.dataService.post(this.endPoint, data).subscribe((res: any) => {
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('success', 'Success', 'success')
          this.router.navigate(['/dashboard/changes'])
        } else {
          this.notification.create('error', 'Failed', 'Failed')
        }
      })
    }
  }
  getById() {
    this.dataService.getIssuesById(apis.getChangesById, this.id).subscribe(res => {
      this.issuesData = res
      this.createdby = this.issuesData.createdBy
      this.addUpdateChangeForm.get('assignedDate').patchValue(this.issuesData.assignedDate)
      this.addUpdateChangeForm.get('ticktId').patchValue(this.issuesData.id)
      this.addUpdateChangeForm.get('components').patchValue(this.issuesData.components)
      this.addUpdateChangeForm.get('references').patchValue(this.issuesData.references)
      this.addUpdateChangeForm.get('environments').patchValue(this.issuesData.environments)
      this.addUpdateChangeForm.get('description').patchValue(this.issuesData.description)
      this.addUpdateChangeForm.get('consumedTime').patchValue(this.issuesData.consumedTime)
      this.addUpdateChangeForm.get('title').patchValue(this.issuesData.title)
      this.addUpdateChangeForm.get('assignedTo').patchValue(this.issuesData.assignedTo)
      this.addUpdateChangeForm.get('rootCauseAnalysis').patchValue(this.issuesData.rootCause)
      this.addUpdateChangeForm.get('deployedDate').patchValue(this.issuesData.deployedDate)
      this.addUpdateChangeForm.get('resolvedDate').patchValue(this.issuesData.resolvedDate)
      this.addUpdateChangeForm.get('estimatedTime').patchValue(this.issuesData.estimatedTime)
      this.addUpdateChangeForm.get('targetDate').patchValue(this.issuesData.targetDate)
      this.addUpdateChangeForm.get('deployedBY').patchValue(this.issuesData.deployedBy)
      this.addUpdateChangeForm.get('fixedVersions').patchValue(this.issuesData.fixedVersions)
      this.addUpdateChangeForm.get('labels').patchValue(this.issuesData.labels)
      this.addUpdateChangeForm.get('closedDate').patchValue(this.issuesData.closedDate)
      this.addUpdateChangeForm.get('percentageComplete').patchValue(this.issuesData.percentageComplete)
      this.addUpdateChangeForm.get('resolution').patchValue(this.issuesData.resolutionNote)
      this.addUpdateChangeForm.get('affectedVersions').patchValue(this.issuesData.affectedVersions)
      this.addUpdateChangeForm.get('category').patchValue(
          this.issuesData.uxCategory === null ||
            this.issuesData.uxCategory === '' ||
            this.issuesData.uxCategory === undefined
            ? null
            : this.category.filter(x => x.optionKey === this.issuesData.uxCategory)[0].optionKey,)
      this.addUpdateChangeForm.get('issueType').patchValue(
          this.issuesData.uxType === null ||
            this.issuesData.uxType === '' ||
            this.issuesData.uxType === undefined
            ? null
            : this.issueType.filter(x => x.optionValue === this.issuesData.uxType)[0].optionKey,
        )
      this.addUpdateChangeForm.get('severity').patchValue(
          this.issuesData.uxSeverity === null ||
            this.issuesData.uxSeverity === '' ||
            this.issuesData.uxSeverity === undefined
            ? null
            : this.severity.filter(x => x.optionKey === this.issuesData.uxSeverity)[0].optionKey,
        )
      this.addUpdateChangeForm.get('priority').patchValue(
          this.issuesData.uxPriority === null ||
            this.issuesData.uxPriority === '' ||
            this.issuesData.uxPriority === undefined
            ? null
            : this.priority.filter(x => x.optionKey === this.issuesData.uxPriority)[0].optionKey,
        )
      this.addUpdateChangeForm.get('resolutionType').patchValue(
          this.issuesData.uxResolution === null ||
            this.issuesData.uxResolution === '' ||
            this.issuesData.uxResolution === undefined
            ? null
            : this.resulationType.filter(x => x.optionKey === this.issuesData.uxResolution)[0]
                .optionKey,
        )
      this.addUpdateChangeForm.get('bucket').patchValue(
          this.issuesData.uxBucket === null ||
            this.issuesData.uxBucket === '' ||
            this.issuesData.uxBucket === undefined
            ? null
            : this.bucket.filter(x => x.optionKey === this.issuesData.uxBucket)[0].optionKey,
        )
      this.addUpdateChangeForm.get('status').patchValue(
          this.issuesData.uxStatus === null ||
            this.issuesData.uxStatus === '' ||
            this.issuesData.uxStatus === undefined
            ? null
            : this.status.filter(x => x.optionKey === this.issuesData.uxStatus)[0].optionKey,
        )
    })
  } 
                                                                        ///////reset
  resetIssue() {
    this.addUpdateChangeForm.reset()
  }

                                                                         /////////Breadcrumbs
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  details() {
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
