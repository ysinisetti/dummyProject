import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { HostListener } from '@angular/core'
import { DatePipe } from '@angular/common'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss'],
  providers: [DatePipe],
})
export class AllProjectsComponent implements OnInit {
  isVisible = false
  addPojectForm: FormGroup
  editProjectForm: FormGroup
  allproSearchForm: FormGroup
  searchForm: FormGroup
  header = 'Search'
  listOfData: any
  openEditForm = false
  records: any
  visible = false
  projectName: any
  ProjectName: String
  customerName: any
  duration: any
  startDate: any
  endDate: any
  ModifiedDate: any
  idToBeEdited: any
  myProjects: any
  loginId: any
  pageNum=1
  pageSize=5
  pageIndex = 1
  noOfRecords: number
  totalPages: number
  sStartDate: any
  sEndDate: any
  sProjectName: any
  projectType: any
  practice: any
  title: string
  btnLabel: string
  icon: string
  rowData: any
  listOfCustomers: any
  values: any
  display: boolean
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getAllProjects()
      this.pageNum = 1
    }
  }
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private dataService: DataService,
  ) {}
  ngOnInit() {
    this.loginId = JSON.parse(sessionStorage.getItem('loginData')).LoginId
    this.addPojectForm = this.fb.group({
      projectName: [null, [Validators.required, Validators.maxLength(100)]],
      customerName: [null, [Validators.required, Validators.maxLength(50)]],
      startDate: [null],
      endDate: [null],
      description: [null, Validators.maxLength(512)],
      practice: [null],
      projectType: [null],
      startDatePlan: new Date(),
      endDatePlan: [null],
    })
    this.editProjectForm = this.fb.group({
      projectName: [null, [Validators.required, Validators.maxLength(100)]],
      customerName: [null, [Validators.required, Validators.maxLength(50)]],
      startDate: [null],
      endDate: [null],
      description: [null, Validators.maxLength(512)],
      practice: [null],
      projectType: [null],
      startDatePlan: [null],
      endDatePlan: [null],
    })
    this.searchForm = this.fb.group({
      sProjectName: [null],
      sCustomerName: [null],
      sStartDate: [null],
      sEndDate: [null],
    })
    this.dataService.get(apis.customerName).subscribe((res:any) => {
      this.listOfCustomers = res
    })
    this.dataService.get(apis.projectType).subscribe((res: any) => {
      this.projectType = res
    })
    this.dataService.get(apis.practice).subscribe((res: any) => {
      this.practice = res
    })
    this.getAllProjects()
  }

  //////Redirect to dashboard
  details(SelectedProjectDetails) {
    sessionStorage.setItem('projectDetails', JSON.stringify(SelectedProjectDetails))
    this.router.navigate(['/dashboard/projectDetails', SelectedProjectDetails.ProjectName])
  }
  //////Redirect to Project-View
  subProjects(SelectedProjectDetails) {
    sessionStorage.setItem('projectDetails', JSON.stringify(SelectedProjectDetails))
    this.router.navigate(['/dashboard/subProjects'])
  }
  //////////////////////////////Get My Projects && Searching////////////////////////////
  getAllProjects() {
    const sStartDate = this.datePipe.transform(
    this.searchForm.get('sStartDate').value,'yyyy-MM-dd',)
    const sEndDate = this.datePipe.transform(this.searchForm.get('sEndDate').value, 'yyyy-MM-dd')
    const customerName = this.searchForm.controls.sCustomerName.value
    const projectName = this.searchForm.controls.sProjectName.value
    let reqBody = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      loginId: this.loginId,
      projectName: projectName === null || projectName === undefined ? '' : projectName,
      customerName: customerName === null || customerName === undefined ? '' : customerName,
      startDate: sStartDate === null || sStartDate === undefined ? '' : sStartDate,
      endDate:sEndDate === null || sEndDate === undefined? '' : new Date(sEndDate).toISOString().substring(0, 10),
    }
    this.dataService.post(apis.allProjects, reqBody).subscribe(res => {
      this.totalPages = res[0].count
      this.listOfData = res[0].data
      this.records = res[0].count
    })
  }
  /////////////////////////////New Project/////////////////////////////////////////
  addRow() {
    this.isVisible = true
    this.addPojectForm.get('startDatePlan').patchValue(new Date());
  }
  newProject() {
    if (this.addPojectForm.untouched) {
      this.isVisible = true
      this.submitAdd()
    }
    if (this.addPojectForm.valid) {
      let addProject = {
        projectName: this.addPojectForm.controls.projectName.value,
        customerName: this.addPojectForm.controls.customerName.value,
        startDate: this.addPojectForm.controls.startDate.value,
        endDate: this.addPojectForm.controls.endDate.value,
        projectDescription: this.addPojectForm.controls.description.value,
        practice: this.addPojectForm.controls.practice.value,
        projectType: this.addPojectForm.controls.projectType.value,
        startDatePlan: this.addPojectForm.controls.startDatePlan.value,
        endDatePlan: this.addPojectForm.controls.endDatePlan.value,
        loginId: this.loginId,
      }
      this.dataService.post(apis.postNewProject, addProject).subscribe(res => {
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
        }
        this.getAllProjects()
      })
      this.isVisible = false
      this.addPojectForm.reset()
      this.getAllProjects()
    }
  }
  ///////// To Patch the values to be Edited
  editRow(values, type) {
    if (type === 'E') {
      this.editProjectForm.enable()
      this.title = 'Edit Project'
      this.btnLabel = 'Update'
      this.icon = 'edit'
      this.display=true
    } else if (type === 'C') {
      this.title = 'Copy Project'
      this.btnLabel = 'Copy'
      this.icon = 'copy'
      this.display=false
      this.editProjectForm.disable()
      this.editProjectForm.get('projectName').enable()
      this.editProjectForm.get('startDatePlan').enable()
    }
    this.rowData = values
    this.openEditForm = true;
    this.idToBeEdited = values.Id,
    this.editProjectForm.get('projectName').patchValue(values.ProjectName)
    this.editProjectForm.get('startDate').patchValue(values.StartDate)
    this.editProjectForm.get('endDate').patchValue(values.EndDate)
    this.editProjectForm.get('description').patchValue(values.ProjectDescription)
    this.editProjectForm
 .get('projectType')
 .patchValue(values.ProjectType === null || values.ProjectType === "" || values.ProjectType === undefined ? null : this.projectType.filter(x => x.Value === values.ProjectType)[0].Value)
    this.editProjectForm.get('startDatePlan').patchValue(values.StartDatePlan)
    this.editProjectForm.get('endDatePlan').patchValue(values.EndDatePlan)
    this.editProjectForm.get('customerName').patchValue(values.CustomerName=== null || values.CustomerName === "" || values.CustomerName === undefined ? null : this.listOfCustomers.filter(x => x.Value === values.CustomerName)[0].Value)
    this.editProjectForm.get('practice').patchValue(values.Practice === null || values.Practice === "" || values.Practice === undefined ? null : this.practice.filter(x => x.Value === values.Practice)[0].Value)

  }


  //////////////To copy or edit the project

  updateProject() {
    if (this.btnLabel === 'Update') {
      let updated = {
        id: this.idToBeEdited,
        projectName: this.editProjectForm.controls.projectName.value,
        customerName: this.editProjectForm.controls.customerName.value,
        startDate: this.editProjectForm.controls.startDate.value,
        endDate: this.editProjectForm.controls.endDate.value,
        projectDescription: this.editProjectForm.controls.description.value,
        practice: this.editProjectForm.controls.practice.value,
        projectType: this.editProjectForm.controls.projectType.value,
        startDatePlan: this.editProjectForm.controls.startDatePlan.value,
        endDatePlan: this.editProjectForm.controls.endDatePlan.value,
      }
      this.dataService.post(apis.updateProject, updated).subscribe(res => {
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
        }
        this.getAllProjects()
      })
    } else {
      var datePlan = this.editProjectForm.controls.startDatePlan.value
      var startDatePlan = this.datePipe.transform(datePlan, 'yyyy-MM-dd')
      let copyValues = {
        startDate: this.rowData.StartDate,
        projectName: this.editProjectForm.get('projectName').value,
        customerName: this.rowData.CustomerName,
        endDate: this.rowData.EndDate,
        projectDescription: this.rowData.ProjectDescription,
        projectType: this.rowData.ProjectType,
        practice: this.rowData.Practice,
        startDatePlan: startDatePlan,
        endDatePlan: this.rowData.EndDatePlan,
        oldProjectId: this.rowData.Id,
      }
      let check = {
        projectName: copyValues.projectName,
      }
      this.dataService.post(apis.duplicateCheck, check).subscribe((res: any) => {
        if (res.Result === 'existing project') {
          alert('Duplicate Project')
        } else {
          this.dataService.post(apis.copyProject, copyValues).subscribe(res => {
            this.getAllProjects()
          })
          this.openEditForm = false
          this.editProjectForm.reset()
          this.getAllProjects()
        }
      })
    }
    this.openEditForm = false
    this.editProjectForm.reset()
    this.getAllProjects()
  }

//////////To delete the project

  deleteRow(id) {
    let dId = {
      id: id,
    }
    this.dataService.post(apis.deleteProject, dId).subscribe(res => {
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('error' ,'Not Deleted', 'Record not deleted'  )
      } else {
        this.notification.create('success', 'Successfully Deleted', 'Record deleted successfully')
      }
      this.getAllProjects()
    })
  }

  ////To validate Form

  submitAdd() {
    for (const i in this.addPojectForm.controls) {
      this.addPojectForm.controls[i].markAsTouched()
      this.addPojectForm.controls[i].updateValueAndValidity()
    }
  }

  cancel(): void {
    this.isVisible = false
    this.openEditForm = false
    this.editProjectForm.reset()
    this.addPojectForm.reset()
    this.searchForm.reset()
    this.getAllProjects()
  }
///////////Pagination

  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllProjects()
  }
  onPageSizeChange(data) {
    this.pageSize = data
    this.pageNum = 1
    this.getAllProjects()
  }
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  /////////Date validations

  startValue: Date | null = null
  endValue: Date | null = null
  endOpen = false
  endValue1: Date | null = null
  endOpen1 = false

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false
    }
    return startValue.getTime() > this.endValue.getTime()
  }

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false
    }
    return endValue.getTime() <= this.startValue.getTime()
  }

  disabledEndDate1 = (endValue1: Date): boolean => {
    if (!endValue1 || !this.startValue) {
      return false
    }
    return endValue1.getTime() <= this.startValue.getTime()
  }

  onStartChange(date: Date): void {
    this.startValue = date
  }
  onEndChange(date: Date): void {
    this.endValue = date
  }

  onEndChange1(date: Date): void {
    this.endValue1 = date
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true
    }
  }
  handleEndOpenChange(open: boolean): void {
    this.endOpen = open
  }
  handleStartOpenChange1(open: boolean): void {
    if (!open) {
      this.endOpen1 = true
    }
  }

  handleEndOpenChange1(open: boolean): void {
    this.endOpen1 = open
  }

  /////////Edit Date Picker///////////////////
  endValue5: Date | null = null
  endOpen5 = false
  endValue6: Date | null = null
  endOpen6 = false

  disabledStartDate5 = (startValue: Date): boolean => {
    if (!startValue || !this.endValue5) {
      return false
    }
    return startValue.getTime() > this.endValue5.getTime()
  }

  disabledEndDate5 = (endValue5: Date): boolean => {
    if (!endValue5 || !this.startValue) {
      return false
    }
    return endValue5.getTime() <= this.startValue.getTime()
  }

  disabledEndDate6 = (endValue6: Date): boolean => {
    if (!endValue6 || !this.startValue) {
      return false
    }
    return endValue6.getTime() <= this.startValue.getTime()
  }

  onStartChange5(date: Date): void {
    this.startValue = date
  }

  onEndChange5(date: Date): void {
    this.endValue5 = date
  }

  onEndChange6(date: Date): void {
    this.endValue6 = date
  }

  handleStartOpenChange5(open: boolean): void {
    if (!open) {
      this.endOpen5 = true
    }
  }

  handleEndOpenChange5(open: boolean): void {
    this.endOpen5 = open
  }

  handleStartOpenChange6(open: boolean): void {
    if (!open) {
      this.endOpen6 = true
    }
  }
  handleEndOpenChange6(open: boolean): void {
    this.endOpen6 = open
  }
}
