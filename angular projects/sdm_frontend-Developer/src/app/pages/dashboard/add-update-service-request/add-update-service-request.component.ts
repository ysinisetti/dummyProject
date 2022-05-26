import { DatePipe } from '@angular/common'
import { DataService } from './../../../data.service'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { apis } from 'src/app/api'
import { NzSelectSizeType } from 'ng-zorro-antd/select'

@Component({
  selector: 'app-add-update-service-request',
  templateUrl: './add-update-service-request.component.html',
  styleUrls: ['./add-update-service-request.component.scss'],
  providers: [DatePipe],
})
export class AddUpdateServiceRequestComponent implements OnInit {
  addUpdateSRIssueForm: FormGroup
  customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
  btnLabel: string
  title: any
  size: NzSelectSizeType = 'default'
  ProjectName: any
  issueType: any[]
  enable: Boolean
  status: any[]
  priority: any[]
  severity: any[]
  bucket: any[]
  category: any[]
  endPoint: any
  id: any
  createdby: any
  servicedataId: any
  notification: any
  listOfResources: any
  priorityDropDown: any
  icon: string
  environment: any
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) {}
  projectDetails = JSON.parse(sessionStorage.getItem('projectDetails'))
  dropDownList = [{ label: 'abc' }]

  ngOnInit(): void {
                                                                                ///////PRIORITY DROP DOWN
     this.dataService.get(apis.issuesPriority).subscribe(res => {
      this.priority = res
      this.addUpdateSRIssueForm.controls.priority.patchValue(this.priority.filter(x=>x.optionValue === 'Low')[0].optionKey)
    })
                                                                                 /////////Environment Drop Down
   this.dataService.get(apis.enviruonmentDropDown).subscribe((res)=>{
    this.environment = res
     this.addUpdateSRIssueForm.controls.environments.patchValue(this.environment.filter(x=>x.Label === 'Prod')[0].Value)
  })
   var selectedId = this.route.params.subscribe(params => {
      this.id = params['id']
    })
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.addUpdateSRIssueForm = this.fb.group({
      ticktId: [null, [Validators.pattern('^[0-9]{0,5}$')]],
      title: [null, [Validators.required, Validators.maxLength(70)]],
      issueType: [null],
      estimatedTime: [null, [Validators.pattern('^[0-9]{0,2}$')]],
      estimatedBy: [null, [Validators.pattern('^[0-9]$')]],
      status: [null],
      percentageComplete: [null, [Validators.maxLength(3), Validators.pattern('^[0-9]{0,3}$')]],
      priority: [null],
      severity: [null],
      bucket: [null],
      category: [null],
      components: [null, [Validators.maxLength(100), Validators.pattern('^[A-Za-z ]*$')]],
      environments: [null, [Validators.maxLength(25), Validators.pattern('^[A-Za-z ]*$')]],
      affectedVersions: [null, [Validators.maxLength(50), Validators.pattern('^[A-Za-z ]*$')]],
      labels: [null, [Validators.maxLength(50), Validators.pattern('^[A-Za-z ]*$')]],
      references: [null, [Validators.maxLength(50), Validators.pattern('^[A-Za-z ]*$')]],
      assignedTo: [null, [Validators.maxLength(25), Validators.pattern('^[A-Za-z ]*$')]],
      approvedBy: [null, [Validators.maxLength(25), Validators.pattern('^[A-Za-z ]*$')]],
      createdDate: [null],
      assignedDate: [null],
      deployedDate: [null],
      approveDate: [null],
      targetDate: [null],
      description: [null, [Validators.maxLength(255)]],
      rootCauseAnalysis: [null, [Validators.maxLength(255)]],
      resolution: [null, [Validators.maxLength(255)]],
    })
    this.dataService.get(apis.issuesPriority).subscribe(res => {
      this.priorityDropDown = res
    })
    this.dropDownData()
    this.toHandleScreens()
    this.getContacts()
  }
                                                                       /////////////list of Resources
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
                                                                      /////////////To replace the values
  toHandleScreens() {
    if (this.router.url.includes('Update')) {
      this.btnLabel = 'Update'
      this.title = 'Edit'
      this.enable = true
      this.icon="edit"
      this.endPoint = apis.updateServiceManagement
      this.editData()
    } else {
      this.enable = false
      this.btnLabel = 'Save'
      this.title = 'Add'
      this.icon="save"
      this.endPoint = apis.postServiceManagement
    }
  }
  dropDownData() {                                                       /////////////////lookup list
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
      this.addUpdateSRIssueForm.controls.status.patchValue(this.status.filter(x=>x.optionValue === 'Created')[0].optionKey)
      this.addUpdateSRIssueForm.controls.status.disable();
      this.addUpdateSRIssueForm.controls.severity.patchValue(this.severity.filter(x=>x.optionValue === 'Minor')[0].optionKey)
      this.addUpdateSRIssueForm.controls.bucket.patchValue(this.bucket.filter(x=>x.optionValue === 'Under Review')[0].optionKey)
      this.addUpdateSRIssueForm.controls.category.patchValue(this.category.filter(x=>x.optionValue === 'User Interface')[0].optionKey)
      this.addUpdateSRIssueForm.controls.issueType.patchValue(this.issueType.filter(x=>x.optionValue === ' Defect')[0].optionKey)
    })
  }
  editData() {                                                                           
    this.dataService.getIssuesById(apis.getByIdServiceManagment, this.id).subscribe((res: any) => {
      var serviceData = res
      this.createdby = serviceData.createdDate
      this.servicedataId = serviceData.id
      this.addUpdateSRIssueForm.patchValue({
        ticktId: serviceData.id,
        title: serviceData.title,
        estimatedTime: serviceData.estimatedTime,
        components: serviceData.components,
        environments: serviceData.environments,
        affectedVersions: serviceData.affectedVersions,
        labels: serviceData.labels,
        references: serviceData.references,
        createdBy: serviceData.createdBy,
        assignedTo: serviceData.assignedTo,
        approvedBy: serviceData.approvedBy,
        createdDate: serviceData.createdDate,
        assignedDate: serviceData.assignedDate,
        deployedDate: serviceData.deployedDate,
        approveDate: serviceData.approvedDate,
        targetDate: serviceData.targetDate,
        description: serviceData.description,
        rootCauseAnalysis: serviceData.rootCause,
        resolution: serviceData.resolutionNote,
        percentageComplete: serviceData.percentageComplete,
        issueType:
          serviceData.uxType === null ||
          serviceData.uxType === '' ||
          serviceData.uxType === undefined
            ? null
            : this.issueType.filter(x => x.optionKey === serviceData.uxType)[0].optionKey,
        status:
          serviceData.uxStatus === null ||
          serviceData.uxStatus === '' ||
          serviceData.uxStatus === undefined
            ? null
            : this.status.filter(x => x.optionKey === serviceData.uxStatus)[0].optionKey,
        bucket:
          serviceData.uxBucket === null ||
          serviceData.uxBucket === '' ||
          serviceData.uxBucket === undefined
            ? null
            : this.bucket.filter(x => x.optionKey === serviceData.uxBucket)[0].optionKey,
        category:
          serviceData.uxCategory === null ||
          serviceData.uxCategory === '' ||
          serviceData.uxCategory === undefined
            ? null
            : this.category.filter(x => x.optionKey === serviceData.uxCategory)[0].optionKey,
        severity:
          serviceData.uxSeverity === null ||
          serviceData.uxSeverity === '' ||
          serviceData.uxSeverity === undefined
            ? null
            : this.severity.filter(x => x.optionKey === serviceData.uxSeverity)[0].optionKey,
        priority:
          serviceData.uxPriority === null ||
          serviceData.uxPriority === '' ||
          serviceData.uxPriority === undefined
            ? null
            : this.priorityDropDown.filter(x => x.optionKey === serviceData.uxPriority)[0]
                .optionKey,
      })
    })
  }
  saveRupdate() {                                                      //////////To save or update the data//////////
    if (this.addUpdateSRIssueForm.invalid) {
      for (const i in this.addUpdateSRIssueForm.controls) {
        this.addUpdateSRIssueForm.controls[i].markAsTouched()
      }
    } else {
      const asignDte = this.addUpdateSRIssueForm.get('assignedDate').value
      const targetDate = this.addUpdateSRIssueForm.get('targetDate').value
      var assignDate = this.datePipe.transform(asignDte, 'yyyy-MM-dd')
      var targetdate = this.datePipe.transform(targetDate, 'yyyy-MM-dd')
      const data = {
        assignedDate: assignDate,                                                         
        uxCategory: this.addUpdateSRIssueForm.get('category').value,
        components: this.addUpdateSRIssueForm.get('components').value,
        references: this.addUpdateSRIssueForm.get('references').value,
        environments: this.addUpdateSRIssueForm.get('environments').value,
        description: this.addUpdateSRIssueForm.get('description').value,
        title: this.addUpdateSRIssueForm.get('title').value,
        assignedTo: this.addUpdateSRIssueForm.get('assignedTo').value,
        releaseId: 1,
        uxType: this.addUpdateSRIssueForm.get('issueType').value,
        rootCause: this.addUpdateSRIssueForm.get('rootCauseAnalysis').value,
        id: this.router.url.includes('Update') ? this.servicedataId : '',
        uxSeverity: this.addUpdateSRIssueForm.get('severity').value,
        uxPriority: this.addUpdateSRIssueForm.controls.priority.value,
        estimatedTime: this.addUpdateSRIssueForm.get('estimatedTime').value,               
        targetDate: targetdate,                                                            
        labels: this.addUpdateSRIssueForm.get('labels').value,
        createdBy: this.router.url.includes('Update')
          ? this.createdby
          : JSON.parse(sessionStorage.getItem('loginData')).FName,
        percentageComplete: Number(this.addUpdateSRIssueForm.get('percentageComplete').value), 
        uxBucket: this.addUpdateSRIssueForm.get('bucket').value,
        resolutionNote: this.addUpdateSRIssueForm.get('resolution').value,
        affectedVersions: this.addUpdateSRIssueForm.get('affectedVersions').value,
        projectId: this.projectDetails.Id,
        uxStatus: this.addUpdateSRIssueForm.get('status').value,
        taskId: 2,
        estimatedBy: 'raj',
        approvedBy: 'raj',
        approvedDate: '',
        businessNeed: '',
        technicalFesability: '',
        potentialWork: '',
        rejectionNotes: '',
        closedBy: '',
        deployedDate: '',
        modifiedBy: '',
        uxApproval: '',
        deployedBy: '',
        fixedVersions: '',
        uxResolution: '',
        closedDate: '',
        resolvedDate: '',
        consumedTime: '',
      }
      this.dataService.post(this.endPoint, data).subscribe((res: any) => {
        if (res.hasOwnProperty('success') === true) {
          this.router.navigate(['dashboard/serviceMgmt'])
          this.notification.create(
            'success',
            'Successfully Added',
            `Record ${this.btnLabel} successfully`,
          )
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
        }
      })
    }
  }
  resetIssue() {
    this.addUpdateSRIssueForm.reset()
  }
  backNavigate() {
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }

                                                                              ///////////Breadcrumbs
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }

  details() {
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
