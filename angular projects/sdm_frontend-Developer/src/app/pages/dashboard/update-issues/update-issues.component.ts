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
 selector: 'app-update-issues',
 templateUrl: './update-issues.component.html',
 styleUrls: ['./update-issues.component.scss'],
 providers: [DatePipe],
})
export class UpdateIssuesComponent implements OnInit {
 updateIssueForm: FormGroup
 customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
 size: NzSelectSizeType = 'default'
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
 alreadyCreatedBy: void
 listOfResources: any
 constructor(
 private fb: FormBuilder,
 private dataService: DataService,
 private router: Router,
 private route: ActivatedRoute,
 private datePipe: DatePipe,
 private notification: NzNotificationService,
 private message: NzMessageService,
 ) {
 this.dataService.get(apis.issueDropDown).subscribe((res: any) => {             /////////LOOKUP LIST
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
 this.priority = IpType
 this.severity = SIType
 this.bucket = IBType
 this.category = ICType
 this.resulationType = IRType
 this.getById()
 })
 }
 dropDownList = [{ label: 'abc' }]
 ngOnInit(): void {
 this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
 this.projectId = JSON.parse(sessionStorage.getItem('projectDetails'))
 this.loginPerson = JSON.parse(sessionStorage.getItem('loginData'))
 this.selectedId = this.route.params.subscribe(params => {
 this.id = params['id']
 })
 this.updateIssueForm = this.fb.group({
 ticktId: [null],
 title: [null,[Validators.required,Validators.maxLength(70)]],
 issueType: [null],
 estimatedTime: [null,[Validators.pattern('^[0-9]$')]],
 consumedTime: [null,[Validators.pattern('^[0-9]$')]],
 status: [null],
 percentageComplete: [null,[Validators.maxLength(3),Validators.pattern('^[0-9]{0,3}$')]],
 priority: [null],
 severity: [null],
 bucket: [null],
 category: [null],
 resolutionType: [null],
 components: [null,[Validators.maxLength(100),Validators.pattern('^[A-Za-z ]*$')]],
 environments: [null,[Validators.maxLength(25),Validators.pattern('^[A-Za-z ]*$')]],
 affectedVersions: [null,[Validators.maxLength(50),Validators.pattern('^[A-Za-z ]*$')]],
 labels: [null,[Validators.maxLength(50),Validators.pattern('^[A-Za-z ]*$')]],
 fixedVersions: [null,[Validators.maxLength(50),Validators.pattern('^[A-Za-z ]*$')]],
 references: [null,[Validators.maxLength(50),Validators.pattern('^[A-Za-z ]*$')]],
 assignedTo: [null,[Validators.maxLength(25),Validators.pattern('^[A-Za-z ]*$')]],
 deployedBY: [null,[Validators.maxLength(25),Validators.pattern('^[A-Za-z ]*$')]],
 createdDate: [null],
 assignedDate: [null],
 deployedDate: [null],
 targetDate: [null],
 resolvedDate: [null],
 closedDate: [null],
 description: [null,[Validators.maxLength(255)]],
 rootCauseAnalysis: [null,[Validators.maxLength(255)]],
 resolution: [null,[Validators.maxLength(255)]],
 })
 this.getContacts()
 }
                                                                         /////////////////LIST OF RESOURCES
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
 getById() {
 this.dataService.getIssuesById(apis.getWithId, this.id).subscribe(res => {
 this.issuesData = res
 this.alreadyCreatedBy = this.issuesData.createdBy;
 this.updateIssueForm.get('assignedDate').patchValue(this.issuesData.assignedDate)
 this.updateIssueForm.get('ticktId').patchValue(this.issuesData.id)
 this.updateIssueForm.get('components').patchValue(this.issuesData.components)
 this.updateIssueForm.get('references').patchValue(this.issuesData.references)
 this.updateIssueForm.get('environments').patchValue(this.issuesData.environments)
 this.updateIssueForm.get('description').patchValue(this.issuesData.description)
 this.updateIssueForm.get('consumedTime').patchValue(this.issuesData.consumedTime)
 this.updateIssueForm.get('title').patchValue(this.issuesData.title)
 this.updateIssueForm.get('assignedTo').patchValue(this.issuesData.assignedTo)
 this.updateIssueForm.get('rootCauseAnalysis').patchValue(this.issuesData.rootCause)
 this.updateIssueForm.get('deployedDate').patchValue(this.issuesData.deployedDate)
 this.updateIssueForm.get('resolvedDate').patchValue(this.issuesData.resolvedDate)
 this.updateIssueForm.get('estimatedTime').patchValue(this.issuesData.estimatedTime)
 this.updateIssueForm.get('targetDate').patchValue(this.issuesData.targetDate)
 this.updateIssueForm.get('deployedBY').patchValue(this.issuesData.deployedBy)
 this.updateIssueForm.get('fixedVersions').patchValue(this.issuesData.fixedVersions)
 this.updateIssueForm.get('labels').patchValue(this.issuesData.labels)
 this.updateIssueForm.get('createdDate').patchValue(this.issuesData.createdDate)
 this.updateIssueForm.get('closedDate').patchValue(this.issuesData.closedDate)
 this.updateIssueForm.get('percentageComplete').patchValue(this.issuesData.percentageComplete)
 this.updateIssueForm.get('resolution').patchValue(this.issuesData.resolutionNote)
 this.updateIssueForm.get('affectedVersions').patchValue(this.issuesData.affectedVersions)
 this.updateIssueForm
 .get('category')
 .patchValue(this.issuesData.uxCategory === null || this.issuesData.uxCategory === "" || this.issuesData.uxCategory === undefined ? null : this.category.filter(x => x.optionKey === this.issuesData.uxCategory)[0].optionKey)
 this.updateIssueForm
 .get('issueType')
 .patchValue( this.issuesData.uxType === null || this.issuesData.uxType === "" || this.issuesData.uxType === undefined ? null : this.issueType.filter(x => x.optionKey === this.issuesData.uxType)[0].optionKey)
 this.updateIssueForm
 .get('severity')
 .patchValue( this.issuesData.uxSeverity === null || this.issuesData.uxSeverity === "" || this.issuesData.uxSeverity === undefined ? null : this.severity.filter(x => x.optionKey === this.issuesData.uxSeverity)[0].optionKey)
 this.updateIssueForm
 .get('priority')
 .patchValue( this.issuesData.uxPriority === null || this.issuesData.uxPriority === "" || this.issuesData.uxPriority === undefined ? null : this.priority.filter(x => x.optionKey === this.issuesData.uxPriority)[0].optionKey)
 this.updateIssueForm
 .get('resolutionType')
 .patchValue( this.issuesData.uxResolution === null || this.issuesData.uxResolution === "" || this.issuesData.uxResolution === undefined ? null : this.resulationType.filter(x => x.optionKey === this.issuesData.uxResolution)[0].optionKey);
 this.updateIssueForm
 .get('bucket')
 .patchValue( this.issuesData.uxBucket === null || this.issuesData.uxBucket === "" || this.issuesData.uxBucket === undefined ? null : this.bucket.filter(x => x.optionKey === this.issuesData.uxBucket)[0].optionKey)
 this.updateIssueForm
 .get('status')
 .patchValue( this.issuesData.uxStatus === null || this.issuesData.uxStatus === "" || this.issuesData.uxStatus === undefined ? null : this.status.filter(x => x.optionKey === this.issuesData.uxStatus)[0].optionKey)
 })
 this.severityDropDown()
 this.priorityDropDown()
 }
                                                                              //////////Priority Drop Down/////////
 priorityDropDown(){
 this.dataService.get(apis.issuesPriority).subscribe((res)=>{
 this.priority=res;
 })
 }
                                                                               //////////Severity Drop Down/////////
 severityDropDown(){
 this.dataService.get(apis.issuesSeverity).subscribe((res)=>{
 this.severity=res;
 })
 }
 save() {                                                                       
 this.btnDisable = true
 if (this.updateIssueForm.invalid) {
  for (const i in this.updateIssueForm.controls) {
    this.updateIssueForm.controls[i].markAsTouched()
  }
} else {
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
 closedBy: this.issuesData.closedBy, 
 components: this.updateIssueForm.controls.components.value,
 references: this.updateIssueForm.controls.references.value,
 environments: this.updateIssueForm.controls.environments.value,
 description: this.updateIssueForm.controls.description.value,
 consumedTime: this.updateIssueForm.controls.consumedTime.value,
 title: this.updateIssueForm.controls.title.value,
 assignedTo: this.updateIssueForm.controls.assignedTo.value,
 releaseId: this.issuesData.releaseId, 
 uxType: this.updateIssueForm.controls.issueType.value, 
 rootCause: this.updateIssueForm.controls.rootCauseAnalysis.value,
 deployedDate: deployedDate,
 modifiedBy: this.loginPerson.FName,
 id: this.id,
 uxSeverity: this.updateIssueForm.controls.severity.value,
 resolvedDate: resolvedDate,
 uxPriority: this.updateIssueForm.controls.priority.value,
 estimatedTime: this.updateIssueForm.controls.estimatedTime.value,
 uxApproval: this.issuesData.uxApproval, 
 targetDate: targetDate,
 deployedBy: this.updateIssueForm.controls.deployedBY.value,
 fixedVersions: this.updateIssueForm.controls.fixedVersions.value,
 labels: this.updateIssueForm.controls.labels.value,
 closedDate: closedDate,
 createdBy: this.alreadyCreatedBy,
 percentageComplete: this.updateIssueForm.controls.percentageComplete.value,
 uxResolution: this.updateIssueForm.controls.resolutionType.value,
 uxBucket: this.updateIssueForm.controls.bucket.value,
 resolutionNote: this.updateIssueForm.controls.resolution.value,
 affectedVersions: this.updateIssueForm.controls.affectedVersions.value,
 projectId: this.projectId.Id,
 uxStatus: this.updateIssueForm.controls.status.value,
 taskId: this.issuesData.taskId, 
 }
 this.dataService.post(apis.updateIssue, reqBody).subscribe(res => {
 if (res.hasOwnProperty('success') === true) {
 setTimeout(() => {
 this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
 }, 1000)
 this.router.navigate(['/dashboard/defects'])
 } else {
 this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
 }
 })
 }
}
                                                                         
 updateIssue() {
 if (this.updateIssueForm.invalid) {
 for (const i in this.updateIssueForm.controls) {
 this.updateIssueForm.controls[i].markAsTouched()
 }
 } else {
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
 this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
 }
}
