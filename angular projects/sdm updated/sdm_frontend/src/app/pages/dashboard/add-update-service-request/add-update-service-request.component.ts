import { DatePipe } from '@angular/common'
import { DataService } from './../../../data.service'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { apis } from 'src/app/api'

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
  ProjectName: any
  issueType: any[]
  status: any[]
  priority: any[]
  severity: any[]
  bucket: any[]
  category: any[]
  endPoint: any
  id: any
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) {}
  projectDetails = JSON.parse(sessionStorage.getItem('projectDetails'))
  // id = this.route.snapshot.params.get('id');
  dropDownList = [{ label: 'abc' }]

  ngOnInit(): void {
    // console.log(this.id);
    var selectedId = this.route.params.subscribe(params => {
      this.id = params['id']
      console.log(this.id)
    })
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.addUpdateSRIssueForm = this.fb.group({
      ticktId: [null],
      title: [null],
      issueType: [null],
      estimatedTime: [null],
      estimatedBy: [null],
      status: [null],
      percentageComplete: [null],
      priority: [null],
      severity: [null],
      bucket: [null],
      category: [null],
      components: [null],
      environments: [null],
      affectedVersions: [null],
      labels: [null],
      references: [null],
      createdBy: [null],
      assignedTo: [null],
      approvedBy: [null],
      createdDate: [null],
      assignedDate: [null],
      deployedDate: [null],
      approveDate: [null],
      targetDate: [null],
      description: [null],
      rootCauseAnalysis: [null],
      resolution: [null],
    })
    this.dropDownData()
    this.toHandleScreens()
  }
  toHandleScreens() {
    if (this.router.url.includes('Update')) {
      this.btnLabel = 'Update'
      this.title = 'Edit'
      this.endPoint = apis.updateServiceManagement
      this.editData()
    } else {
      this.btnLabel = 'Save'
      this.title = 'Add'
      this.endPoint = apis.postServiceManagement
    }
  }
  dropDownData() {
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
      // this.resulationType = IRType
      console.log('checkind=g dd', this.issueType)
    })
  }
  editData() {
    console.log(this.id)
    this.dataService.getIssuesById(apis.getByIdServiceManagment, this.id).subscribe((res: any) => {
      var serviceData = res
      console.log(serviceData)
      this.addUpdateSRIssueForm.patchValue({
        ticktId: serviceData.id,
        title: serviceData.title,
        estimatedTime: serviceData.estimatedTime,
        // estimatedBy: this.issueType.filter(x=>x.optionKey === serviceData.uxType)[0].optionKey,
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
        issueType: this.issueType.filter(x => x.optionKey === serviceData.uxType)[0].optionKey,
        status: this.status.filter(x => x.optionKey === serviceData.uxStatus)[0].optionKey,
        priority: this.priority.filter(x => x.optionKey === serviceData.uxPriority)[0].optionKey,
        severity: this.severity.filter(x => x.optionKey === serviceData.uxSeverity)[0].optionKey,
        bucket: this.bucket.filter(x => x.optionKey === serviceData.uxBucket)[0].optionKey,
        category: this.category.filter(x => x.optionKey === serviceData.uxCategory)[0].optionKey,
      })
      // this.addUpdateSRIssueForm.get('issueType').patchValue(this.issueType.filter(x=>x.optionKey === serviceData.uxType)[0].optionKey)
    })
  }
  saveRupdate() {
    if (this.addUpdateSRIssueForm.invalid) {
      for (const i in this.addUpdateSRIssueForm.controls) {
        this.addUpdateSRIssueForm.controls[i].markAsTouched()
      }
    } else {
      // created date,approveDate is not given in request body
      // estimateBy and approveBy dropdown services are not yet given
      const asignDte = this.addUpdateSRIssueForm.get('assignedDate').value
      const targetDate = this.addUpdateSRIssueForm.get('targetDate').value
      var assignDate = this.datePipe.transform(asignDte, 'yyyy-MM-dd')
      var targetdate = this.datePipe.transform(targetDate, 'yyyy-MM-dd')
      const data = {
        assignedDate: assignDate, //assignedDate
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
        id: this.router.url.includes('Update') ? 1 : '',
        uxSeverity: this.addUpdateSRIssueForm.get('severity').value,
        uxPriority: this.addUpdateSRIssueForm.controls.priority.value,
        estimatedTime: this.addUpdateSRIssueForm.get('estimatedTime').value, //number
        targetDate: targetdate, //targetDate
        labels: this.addUpdateSRIssueForm.get('labels').value,
        createdBy: this.addUpdateSRIssueForm.get('createdBy').value,
        percentageComplete: Number(this.addUpdateSRIssueForm.get('percentageComplete').value), //number
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
      console.log(data)
      this.dataService.post(this.endPoint, data).subscribe((res: any) => {
        console.log(res)
      })
    }
  }
  resetIssue() {
    this.addUpdateSRIssueForm.reset()
  }
  backNavigate() {
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }

  ///////////BreadCRumb////////////////////
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }

  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
