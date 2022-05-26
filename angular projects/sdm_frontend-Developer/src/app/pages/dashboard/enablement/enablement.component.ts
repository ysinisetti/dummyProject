import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { Router } from '@angular/router'
import { HostListener } from '@angular/core'
import { DatePipe } from '@angular/common'
import { NzNotificationService } from 'ng-zorro-antd/notification'

interface ColumnItem {
  name: string
  width: string
}

@Component({
  selector: 'app-enablement',
  templateUrl: './enablement.component.html',
  styleUrls: ['./enablement.component.scss'],
  providers: [DatePipe],
})
export class EnablementComponent implements OnInit {

  pageNum: number
  pageSize: number
  totalPages: number
  gridData: any
  enabelementForm: FormGroup
  courseForm: FormGroup
  dropDown = []
  docdata: any = []
  tableData: any
  records: any
  cusName: any
  noOfRecords: any
  searchTask: any
  visiblEdit: boolean = false
  skillsetList = []
  courseDownLists = []
  delData: any
  addResponse: any
  editId: any
  data: any
  createdBy: any
  status: any
  viewUpdate: boolean = false
  title: string
  btnLabel: string
  icon: string

  listOfColumns: ColumnItem[] = [
    {
      name: '#',
      width: '30px',
    },
    {
      name: 'Course No',
      width: '90px',
    },
    {
      name: 'Title',
      width: '90px',
    },
    {
      name: 'Course Type',
      width: '100px',
    },
    {
      name: 'Role',
      width: '90px',
    },
    {
      name: 'Created By',
      width: '80px',
    },
    {
      name: 'Created Date',
      width: '80px',
    },
    {
      name: 'Action',
      width: '60px',
    },
  ]
  btnDisabled: boolean
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.enablementSearch(), (this.pageNum = 1)
    }
  }
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
  ) { }
  userName = JSON.parse(sessionStorage.getItem('loginData')).FName

  ngOnInit(): void {
    this.pageSize = 5
    this.pageNum = 1
    this.totalPages = 5
    // api for Dropdowns
    this.dataService.get(apis.skillsetdrop).subscribe(res => {
      this.skillsetList = res
      //api for assign to drop down in course 
      this.dataService.get(apis.coursedrop).subscribe(res => {
        this.courseDownLists = res
      })
    })

    this.courseForm = this.fb.group({
      courseNo: [
        null,
        [Validators.maxLength(10), Validators.pattern('^[0-9]*$')],],
      title: [null, [Validators.required, Validators.maxLength(70), Validators.pattern('^[a-zA-Z ]*$')],],
      type: [null, [Validators.required]],
      duration: [null, [Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]*$')],],
      role: [null, [Validators.required]],
      description: [null, [Validators.maxLength(250), Validators.pattern('^[\\s0-9a-zA-z]*$')]],
      crsReferences: [null, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
    })

    this.enabelementForm = this.fb.group({
      searchtitle: [null],
      searchroll: [null],
      searchtype: [null],
      createdDate: [null],
    })

    this.getTableData()
  }


  courseset = {
    C: 'Class Room',
    R: 'Remote Class',
    S: 'Self Learning',
  }
  skillset = {
    A: 'UxDesigner',
    A1: 'HR Manager',
    B: 'UxDeveloperAngular',
    B1: 'Management',
    C: 'UxDashboardsReports',
    C1: 'Project Manager',
    D: 'UxMenuSecurity',
    D1: 'Sales',
    E: 'UxQualityEnginer',
    E1: 'Recruiter',
    F: 'UxChatBots',
    F1: 'Marketing',
    G: 'BxIntegrator',
    G1: 'Finance',
    H: 'BxTLDeveloper',
    H1: 'Immigration',
    I: 'BxFilesWebSocketsS3',
    J: 'BxMQStreams',
    K: 'BxAleertsEmailLogs',
    L: 'BxDotNet',
    M: 'BxNodeJs',
    N: 'BxDB',
    O: 'BxScheduler',
    P: 'BxAPIGateway',
    Q: 'UxVisualAnalytics',
    R: 'IxDevOps',
    S: 'IxCloud',
    T: 'IxSecurity',
    U: 'IxNetworks',
    V: 'IxDataScientist',
    W: 'SAP Basis',
    X: 'SAP ABAP',
    Y: 'SAP Functional',
    Z: 'SAP PI/PO',
  }
  // Go to All projects Screen
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  //Pagenation
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getTableData()
  }
  onPageSizeChange(data) {
    this.pageSize = data
    this.getTableData()
  }
  // get table method
  getTableData() {
    const body = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      cTitle: '',
      uxRoleType: '',
      uxCourseType: '',
      createdDate: '',
    }
    this.dataService.post(apis.getEnablement, body).subscribe((res: any) => {
      this.tableData = res[0].data
      this.totalPages = res[0].count
      this.noOfRecords = res[0].count
      this.records = res[0].count
    })
  }
  // Search the Enablement Screen to required fields
  enablementSearch() {
    const cTitle = this.enabelementForm.controls.searchtitle.value
    const cDate = this.enabelementForm.controls.createdDate.value
    const uxCourseType = this.enabelementForm.controls.searchtype.value
    const uxRoleType = this.enabelementForm.controls.searchroll.value
    const createdDate = this.datePipe.transform(cDate, 'yyyy-MM-dd')

    let reqBody = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      cTitle: cTitle,
      uxRoleType: uxRoleType,
      uxCourseType: uxCourseType,
      createdDate: createdDate,
    }
    this.dataService.post(apis.searchTable, reqBody).subscribe(res => {
      this.records = res[0].count
      this.tableData = res[0].data
    })
  }
  // Reset the Search fields
  enablementReset() {
    this.enabelementForm.reset()
    this.getTableData()
  }
  clickOnCourseDetails(data) {
    sessionStorage.setItem('courseDetails', JSON.stringify(data))
    this.router.navigate(['/dashboard/courseDetails'])
  }
  // Delete method for delete grid row data
  deleteRow(data) {
    this.docdata = data.id
    const data1 = {
      id: data.id,
    }
    console.log('data1', data1)
    this.dataService.post(apis.deleteEnablement, data1).subscribe((res: any) => {

      console.log(res)
      this.delData = res
      //notification will display after delete the data
      if (res.hasOwnProperty('Result') === true) {
        setTimeout(() => {
          this.notification.create(
            'success',
            'Successfully Deleted',
            'Your data has been successfully Deleted',
          )
        }, 1000)
      } else {
        this.notification.create('error', 'Failed to Delete', 'Your data is failed to Delete ')
      }
      this.tableData.length === 1 ? this.pageNum = this.pageNum - 1 : this.pageNum
      this.getTableData()
    })
  }
  //edit  view method and patching the values
  startEdit(data) {
    console.log(data, typeof data)
    this.visiblEdit = true
    if (data === 'data') {
      this.viewUpdate = false
      this.title = 'Add Enablement';
      this.btnLabel = 'Save';
      this.icon = 'save'
      console.log(this.viewUpdate)
    } else if (data != 'data') {
      this.title = 'Edit Enablement';
      this.btnLabel = 'Update';
      this.icon = 'edit'
      this.viewUpdate = true
      console.log(this.viewUpdate)
      this.editEnablement(data);
    }
  }
  //This method is save and update 
  saveRupdate() {
    if ((this.viewUpdate === false)) {
      this.save()

    }
    if ((this.viewUpdate === true)) {
      this.editUpdate()

    }
    console.log(this.viewUpdate)
  }
  save() {
    this.btnDisabled = true

    if (this.courseForm.untouched || this.courseForm.invalid) {
      this.visiblEdit = true
      this.submitAdd()
    }

    if (this.courseForm.valid) {
      const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      // This is Requrest body to send data from frentend to backend
      let body = {
        estimatedTime: parseInt(this.courseForm.get('duration').value).toString(),
        createdBy: this.userName,
        author: this.userName,
        modifiedDate: '',
        description: this.courseForm.get('description').value,
        cTitle: this.courseForm.get('title').value,
        modifiedBy: '',
        cNo: +this.courseForm.get('courseNo').value,
        uxRoleType: this.courseForm.get('role').value,
        uxCourseType: this.courseForm.get('type').value,
        crsReferences: this.courseForm.get('crsReferences').value,
        status: '',
        startDate: currentDate,
        endDate: '',
      }
      console.log('ssssssssssssssssssss', body)
      this.dataService.post(apis.addEnablement, body).subscribe((res: any) => {
        console.log('hghngcvhnhh', res)



        this.getTableData()
        if (res.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Added',
            'Your data has been successfully added',
          )
        } else {
          this.notification.create('error', 'Failed to Add', 'Your data is failed to Add ')
        }
      });
      this.btnDisabled = false
      this.visiblEdit = false
      this.courseForm.reset()
    }
  }

  cancelEnablement() {
    this.visiblEdit = false
    this.courseForm.reset()
  }

  handleOk(): void {
    console.log('Button ok clicked!')
    this.visiblEdit = false
  }

  editenable(data) {
    sessionStorage.setItem('editdata', JSON.stringify(data))
    this.router.navigate(['/dashboard/editenablement'])
    console.log('dataaaaaa', data)
  }

  // This Method to patch the values 

  editEnablement(data) {
    console.log(data)
    this.courseForm.get('courseNo').patchValue(data.cNo)
    this.courseForm.get('title').patchValue(data.cTitle)
    this.courseForm.get('type').patchValue(data.uxCourseType)
    this.courseForm.get('duration').patchValue(data.estimatedTime)
    this.courseForm.get('role').patchValue(data.uxRoleType)
    this.courseForm.get('description').patchValue(data.description)
    this.courseForm.get('crsReferences').patchValue(data.crsReferences)
    this.editId = data.id
    this.createdBy = data.createdBy
    this.status = data.status
  }

  editUpdate() {
    if (this.courseForm.untouched || this.courseForm.invalid) {
      this.visiblEdit = true
      this.submitAdd()
    }

    if (this.courseForm.valid) {

      let body = {
        cTitle: this.courseForm.get('title').value,
        description: this.courseForm.get('description').value,
        uxCourseType: this.courseForm.get('type').value,
        createdBy: this.createdBy,
        modifiedBy: this.userName,
        author: '',
        estimatedTime: this.courseForm.get('duration').value,
        crsReferences: this.courseForm.get('crsReferences').value,
        cNo: +this.courseForm.get('courseNo').value,
        uxRoleType: this.courseForm.get('role').value,
        status: this.status,
        startDate: '2020-10-22',
        endDate: '2020-11-25',
        id: this.editId,
      }
      console.log(body)
      console.log('Insert data', body)
      this.dataService.post(apis.uploadenablemnt, body).subscribe((res: any) => {
        this.addResponse = res
        if (this.addResponse.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Updated',
            'Your data has been successfully Updated',
          )
          this.getTableData()
        } else {
          this.notification.create('error', 'Failed to Updated', 'Your data is failed to Updated ')
        }
      })
      this.visiblEdit = false
      this.courseForm.reset()
    }
  }

  //This method to submit the values to required the validations

  submitAdd(): void {
    for (const cTitle in this.courseForm.controls) {
      this.courseForm.controls[cTitle].markAsTouched()
      this.courseForm.controls[cTitle].updateValueAndValidity()
    }
  }
}
