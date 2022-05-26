import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router'
import { Component, OnInit, HostListener } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { DatePipe } from '@angular/common'

interface ColumnItem {
  name: string
  width: string
}
@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  providers: [DatePipe],
})
export class CourseDetailsComponent implements OnInit {
  endtime: number;
  viewUpdate: boolean;
  title: string;
  viewUpdateEnroll: boolean;
  enrollVisible: boolean;
  attendeeId: any;
  results: void;
  starttime(arg0: string, starttime: any) {
    throw new Error("Method not implemented.");
  }
  StartTime(StartTime: any) {
    throw new Error("Method not implemented.");
  }
  hrs: any;
  strttime1(arg0: string, strttime1: any, endtime1: (arg0: string, strttime1: any, endtime1: any) => void) {
    throw new Error("Method not implemented.");
  }
  endtime1(arg0: string, strttime1: any, endtime1: any) {
    throw new Error("Method not implemented.");
  }
  userName = JSON.parse(sessionStorage.getItem('loginData')).LoginId
  moduleData: any;
  moduleAddUpdateForm: FormGroup
  openModuleForm: boolean
  btnLabel
  formTitle
  icon
  endPoint
  item
  type
  enrollStatusList
  moduleSearchForm: FormGroup
  sectionAddUpdateForm: FormGroup
  openSetionForm: boolean
  stype
  secData
  selectedModuleId
  sectionData
  dropDownList = []
  allIssues: any = []
  pageNum: number = 1
  pageSize: number = 5
  totalPages: any
  visiblEdit: boolean = false
  visiblEditshedule: boolean = false
  visiblEdit2: boolean = false
  visiblEdit3: boolean = false
  EnrollvisiblEadd: boolean = false
  EnrollvisiblEedit: boolean = false
  skillsetList = []
  courseDownLists = []
  locationDownLists = []
  data12: any
  data: any
  records: any
  coursedatatable: any
  noOfRecords1: any
  totalPagesmodule: any
  records1: any
  editId: any
  mapOfExpandedData: { [key: string]: Array<any> } = {}
  expandSet = new Set<number>()
  datacourse: any
  editResponse: any
  editcourseid: any
  loginId: any
  pageNummodule: any
  pageSizemodule: any
  pageSizeshedule: number
  pageNumshedule: number
  pageSizeenroll: number
  pageSizemyshedule: number
  pageNummyshedule: number
  pageNumenroll: number
  totalPagesshedule: any
  enrolldatatable: any
  enrolleditId: any
  enrolledList: FormGroup
  enrolledTableLength: any
  mysheduletablelength: any
  courseDetailsForm: FormGroup
  erollEditData: any;
  noOfRecords11: any;
  mysheduletableData: any;
  totalPages3: any;
  enrolltotalPages: any;
  mysheduletotalPages: any;
  enablementdata: any;
  responseSections: Object;
  attendeeIdEnroll: void;
  attendeeMgrIdEnroll: void;
  dataSchedule: any;
  pageSizesection: number;
  pageNumsection: number;
  totalPagessection: number;
  myForm: any;
  startTime: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  onExpandChange(id: number, checked: boolean): void {
    this.selectedModuleId = id;
    if (checked) {
      this.expandSet.add(id)
    } else {
      this.expandSet.delete(id)
    }
    this.getSections()
  }
  collapse(array, data, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach(d => {
          const target = array.find(a => a.courseId === d.courseId)!
          target.expand = false
          this.collapse(array, target, false)
        })
      } else {
        return
      }
    }
  }
  convertTreeToList(root) {
    console.log('Tree-List')
    const stack = []
    const array = []
    const hashMap = {}
    console.log('convet to list', root.level, root.child, root.expand)
    stack.push({ ...root, level: 0, expand: false })
    console.log('stack data', stack)
    while (stack.length !== 0) {
      const node = stack.pop()!
      this.visitNode(node, hashMap, array)
      if (node.child) {
        console.log('node child', node.child)
        for (let i = node.child.length - 1; i >= 0; i--) {
          stack.push({ ...node.child[i], level: node.level! + 1, expand: false, parent: node })
          console.log('stack after loop', stack)
        }
      }
    }
    console.log('convert array', array)
    return array
  }

  visitNode(node, hashMap: { [Id: string]: boolean }, array): void {
    console.log('visit node')
    if (!hashMap[node.Id]) {
      hashMap[node.Id] = true
      array.push(node)
    }
  }
  courseForm: FormGroup
  scheduleForm: FormGroup
  editscheduleform: FormGroup
  scheduleSearch: FormGroup
  courseadd: FormGroup
  courseedit: FormGroup
  enrollAddForm: FormGroup
  Editenrollform: FormGroup
  mysheduleform: FormGroup
  ProjectName: any
  cusName: any
  addResponse: any
  noOfRecords: any
  docdata: any
  delData: any

  listOfColumnsModule: ColumnItem[] = [
    {
      name: 'Title',
      width: '80px',
    },
    {
      name: 'Author',
      width: '90px',
    },
    {
      name: 'Created Date',
      width: '90px',
    },
    {
      name: 'Created By',
      width: '80px',
    },
    {
      name: 'Sections',
      width: '90px',
    },

    {
      name: 'Action',
      width: '60px',
    },
  ]
  listOfColumnsSections: ColumnItem[] = [
    {
      name: 'Title',
      width: '80px',
    },
    {
      name: 'Created By',
      width: '80px',
    },
    {
      name: 'Author',
      width: '90px',
    },
    {
      name: 'Created Date',
      width: '90px',
    },
    {
      name: 'Estimated Time',
      width: '90px',
    },

    {
      name: 'Video Links',
      width: '90px',
    },

    {
      name: 'Action',
      width: '60px',
    },
  ]
  listOfColumnsSchedule: ColumnItem[] = [
    {
      name: '#',
      width: '30px',
    },
    {
      name: 'Offered Date',
      width: '80px',
    },
    {
      name: 'Start Time',
      width: '80px',
    },
    {
      name: 'Instructor',
      width: '90px',
    },
    {
      name: 'Location Type',
      width: '90px',
    },
    {
      name: 'Cost',
      width: '90px',
    },

    {
      name: 'Action',
      width: '60px',
    },
  ]
  listOfColumnsEnroll: ColumnItem[] = [
    {
      name: '#',
      width: '30px',
    },
    {
      name: 'Attendee Id',
      width: '80px',
    },
    {
      name: 'Feedback',
      width: '80px',
    },
    {
      name: 'Crs Id',
      width: '90px',
    },
    {
      name: 'Status',
      width: '90px',
    },
    {
      name: 'Apporved Date',
      width: '90px',
    },
    {
      name: 'Created Date',
      width: '90px',
    },
    {
      name: 'Comments',
      width: '90px',
    },

    {
      name: 'Action',
      width: '60px',
    },
  ]
  listOfColumnsMyschedule: ColumnItem[] = [
    {
      name: '#',
      width: '30px',
    },
    {
      name: 'C Title',
      width: '80px',
    },
    {
      name: 'Instructor',
      width: '80px',
    },
    {
      name: 'Status',
      width: '90px',
    },
    {
      name: 'Start Date',
      width: '90px',
    },
    {
      name: 'Description',
      width: '90px',
    }

  ]
  moduleViewUpdate: boolean = false
  header = 'Search'
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.scheduledSearch(), (this.pageNum = 1)
      this.searchEnrolledList(), (this.pageNum = 1)

    }
  }
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
  ) { }
  ngOnInit(): void {
    this.loginId = JSON.parse(sessionStorage.getItem('loginData')).LoginId

    this.pageSizemodule = 5
    this.pageNummodule = 1
    this.totalPagesmodule = 5
    this.pageSizesection = 5
    this.pageNumsection = 1
    this.totalPagessection = 5
    this.pageSizeshedule = 5
    this.pageNumshedule = 1
    this.pageSizeenroll = 5
    this.pageNumenroll = 1
    this.pageSizemyshedule = 5
    this.pageNummyshedule = 1

    // Get the Enablement data to patch the values in to the schedule screen
    this.enablementdata = JSON.parse(sessionStorage.getItem('courseDetails'))
    console.log("enablement dataaaaa", this.enablementdata)
    this.dataService.get(apis.skillsetdrop).subscribe(res => {
      this.skillsetList = res

    })
    //api for assign to drop down in course and location 
    this.dataService.get(apis.coursedrop).subscribe(res => {
      this.courseDownLists = res
    })

    this.dataService.get(apis.schedulelocationdrop).subscribe(res => {
      this.locationDownLists = res
    })

    this.courseForm = this.fb.group({
      courseNo: [null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')],],
      title: [null, [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')],],
      type: [null, [Validators.required]],
      skillSet: [null, [Validators.required]],
      duration: [null, [Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]*$')],],
      role: [null, [Validators.required]],
      author: [null, [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')],],
    })

    this.scheduleForm = this.fb.group({
      Cost: [null, [Validators.maxLength(5), Validators.min(2500), Validators.pattern('^[0-9]*$')],],
      Capacity: [null, [, Validators.maxLength(5), Validators.min(5), Validators.pattern('^[0-9]*$')],],
      Loaction: [null, [Validators.maxLength(100), Validators.pattern('^[a-zA-Z ]*$')],],
      InstructorMachines: [null, [Validators.maxLength(100), Validators.pattern('^[a-zA-Z ]*$')],],
      startTime: [null, [Validators.required],],
      Instructor: [null, [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')],],
      HrManagr: [null, [Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')],],
      offeredDate: [null],
      locationType: [null],
    })
    this.scheduleSearch = this.fb.group({
      serachlocationtype: [null],
    })
    this.courseadd = this.fb.group({
      addmoduleid: [null],
      addcourseid: [null],
      Sequenceno: [null],
      addcreatedby: [null],
      addmodifiedby: [null],
    })
    this.courseedit = this.fb.group({
      editmoduleid: [null],
      editcourseid: [null],
      editcreateddate: [null],
      editcreatedBy: [null],
    })
    this.userName = JSON.parse(sessionStorage.getItem('loginData')).LoginId
    this.attendeeId = JSON.parse(sessionStorage.getItem('loginData')).Email1
    console.log("login dataaa", this.attendeeId)
    this.enrollAddForm = this.fb.group({
      enrollcrsScheduleId: [null, [Validators.required, Validators.maxLength(8), Validators.pattern('^[0-9]*$')],],
      enrollattendeeId: [null],
      enrollattendeeMgrId: [null],
      enrollstatus: [null],
      enrollcomments: [null, [Validators.maxLength(250), Validators.pattern('^[\\s0-9a-zA-z]*$'
      )]],
      enrollattendeeFeedback: [, [Validators.maxLength(10), Validators.pattern('^[0-9]*$')],],

    })
    this.enrolledList = this.fb.group({
      enrolledCreatedBy: [null],
      enrolledStatus: [null],
      enrolledDate: [null],
    })
    this.courseDetailsForm = this.fb.group({
      courseModularId: [null],
      courseId: [null],
      courseCreatedDate: [null],
    })

    this.moduleAddUpdateForm = this.fb.group({
      moduleTitle: [null, [Validators.required, Validators.maxLength(70), Validators.pattern('^[a-zA-Z ]*$')]],
      estimatedTime: [null, [Validators.maxLength(2), Validators.pattern('^[0-9]*$')]],
      description: [null, [Validators.maxLength(250), Validators.pattern('^[\\s0-9a-zA-z]*$'
      )]]
    })
    this.moduleSearchForm = this.fb.group({
      title: [null],
      author: [null],
      createdDate: [null],
      createdBy: [null],
    })

    this.sectionAddUpdateForm = this.fb.group({
      seqNo: [null, [Validators.maxLength(3), Validators.pattern('^[0-9]*$')],],
      sectionTitle: [null, [Validators.required, Validators.maxLength(70), Validators.pattern('^[\\s0-9a-zA-z]*$')],],
      description: [null, [Validators.maxLength(250), Validators.pattern('^[\\s0-9a-zA-z]*$')]],
      videoLinks: [null, [Validators.maxLength(200)],],
      htmlLinks: [null, [Validators.maxLength(200)],],
      notes: [null],
      estimatedTime: [null, [Validators.maxLength(2), Validators.pattern('^[0-9]*$')]]
    })

    this.mysheduleform = this.fb.group({
      myschedulectitle: [null],
      myscheduleinstructor: [null],
      myschedulestartdate: [null],
    })
    this.getStatusEnrollList()
    this.getTableData()
    this.enrollTable()
    this.myshedulegettabledata()
    this.getModules()
    this.getSections()
    this.addRUpdateModules()
    this.addRUpdateSection()
    this.moduleAddUpdateForm.reset()
    this.sectionAddUpdateForm.reset()
  }
  loactiontype = {
    C: 'Class Room Training',
    T: 'Tele Conf Call',
    W: 'Webinar',
  }

  status = {
    A: 'Assigned',
  }
  // Get the data to display the grid
  getTableData(): void {
    const body = {
      locationType: '',
      pageNum: this.pageNumshedule,
      pageSize: this.pageSizeshedule,
    }

    this.dataService.post(apis.tableData, body).subscribe((res: any) => {
      this.allIssues = res[0].data
      this.noOfRecords11 = res[0].count
      this.totalPagesshedule = res[0].count
      this.records = res[0].count
    })
  }
  // serach Schedule
  scheduledSearch() {
    const secloctype = this.scheduleSearch.controls.serachlocationtype.value
    const reqBody = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      locationType: secloctype === null || secloctype === undefined ? '' : secloctype,
    }
    this.dataService.post(apis.tableData, reqBody).subscribe(res => {
      this.records = res[0].count
      this.allIssues = res[0].data
    })
  }
  resetSchedule() {
    this.scheduleSearch.reset()
    this.getTableData()
  }
  // Add Schedule
  save() {
    let body = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      estimatedTime: parseInt(this.courseForm.get('duration').value),
      createdBy: 'Saradhi',
      author: this.courseForm.get('author').value,
      skillSet: this.courseForm.get('skillSet').value,
      modifiedDate: '2020-09-28',
      description: 'description',
      cTitle: this.courseForm.get('title').value,
      modifiedBy: 'jahnavi',
      cNo: this.courseForm.get('courseNo').value,
      uxRoleType: this.courseForm.get('role').value,
      uxCourseType: this.courseForm.get('type').value,
      crsReferences: 'Edition',
    }
    this.dataService.post(apis.addEnablement, body).subscribe((res: any) => {
      this.addResponse = res
    })
  }
  // Pagination
  onCurrentPageDataChangemodule(data) {
    this.pageNummodule = data
    this.getModules()
  }
  onPageSizeChangemodule(data) {
    this.pageSizemodule = data
    this.getModules()
  }
  onCurrentPageDataChangesection(data) {
    this.pageNumsection = data
    this.getSections()
  }
  onPageSizeChangesection(data) {
    this.pageSizesection = data
    this.getSections()
  }
  onCurrentPageDataChangeshedule(data) {
    this.pageNumshedule = data
    this.getTableData()
  }
  onPageSizeChangeshedule(data) {
    this.pageSizeshedule = data
    this.getTableData()
  }
  onCurrentPageDataChangenroll(data) {
    this.pageNumenroll = data
    this.enrollTable()
  }
  onPageSizeChangeenroll(data) {
    this.pageSizeenroll = data
    this.enrollTable()
  }
  onCurrentPageDataChangmyshedule(data) {
    this.pageNummyshedule = data
    this.myshedulegettabledata()
  }
  onPageSizeChangemyshedule(data) {
    this.pageSizemyshedule = data
    this.myshedulegettabledata()
  }

  //////////////BreadCrumb/////////////
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }

  details() {

    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }

  // -----------Course Edit------------
  courseeditCancel() {
    this.visiblEdit3 = false
  }

  editcoursehandleOk(): void {
    this.visiblEdit3 = false
  }

  // --------scheduled add---------------

  schedulesAdd() {
    this.visiblEdit = true
  }

  scheduleAddCancel() {
    this.visiblEdit = false
    this.scheduleForm.reset()
  }

  scheduleAddhandleOk(): void {
    this.visiblEdit = false
  }
  // Add and Update the schedule screen
  startEdit(data) {
    console.log(data, typeof data)
    this.visiblEdit = true
    if (data === 'data') {
      this.viewUpdate = false
      this.title = 'Add Schedule';
      this.btnLabel = 'Save';
      this.icon = 'save';
      this.scheduleForm.controls.Capacity.patchValue("5");
      this.scheduleForm.controls.Cost.patchValue("2500");
    } else if (data != 'data') {
      this.title = 'Edit Schedule';
      this.btnLabel = 'Update';
      this.icon = 'edit'
      this.viewUpdate = true
      this.schedulesEdit(data);
    }
  }
  saveRupdate() {
    if ((this.viewUpdate === false)) {
      this.AddSaveForm()

    }
    if ((this.viewUpdate === true)) {
      this.scheduleSaveeditform()

    }
  }

  AddSaveForm() {
    if (this.scheduleForm.untouched || this.scheduleForm.invalid) {
      this.visiblEdit = true
      this.submitAddSchedule()

    }

    if (this.scheduleForm.valid) {
      const starttime = this.scheduleForm.controls.startTime.value
      let body = {
        courseId: this.enablementdata.id,
        cost: parseInt(this.scheduleForm.get('Cost').value),
        capacity: parseInt(this.scheduleForm.get('Capacity').value),
        locationType: this.scheduleForm.get('locationType').value,
        location: this.scheduleForm.get('Loaction').value,
        instructorMachines: this.scheduleForm.get('InstructorMachines').value,
        studentMachines: '',
        offeredDate: this.scheduleForm.get('offeredDate').value,
        startTime: starttime === null || starttime === undefined ? '' : this.datePipe.transform(new Date(Date.parse(starttime)), 'HH:mm:ss'),
        modifiedDate: '',
        createdBy: this.userName,
        modifiedBy: '',
        instructor: this.scheduleForm.get('Instructor').value,
        hrManagger: this.scheduleForm.get('HrManagr').value,
      }
      this.dataService.post(apis.scheduleInsert, body).subscribe((res: any) => {
        this.data12 = res
        this.addResponse = res
        if (this.addResponse.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Added',
            'Your data has been successfully added',
          )
          this.getTableData()
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
        }
      });
      this.visiblEdit = false
      this.scheduleForm.reset()

    }

  }

  scheduleSaveeditform() {

    if (this.scheduleForm.untouched || this.scheduleForm.invalid) {

      this.submitEditSchedule()
    }

    if (this.scheduleForm.valid) {
      const starttime = this.scheduleForm.controls.startTime.value
      let body = {
        id: this.editId,
        courseId: '13214325',
        cost: this.scheduleForm.get('Cost').value,
        capacity: '20',
        locationType: this.scheduleForm.get('locationType').value,
        location: 'Miracle City',
        instructorMachines: 'Instructs to the required faculty',
        studentMachines: 'Gives the feedback of the student',
        offeredDate: this.scheduleForm.get('offeredDate').value,
        startTime: starttime === null || starttime === undefined ? '' : this.datePipe.transform(new Date(Date.parse(starttime)), 'HH:mm:ss'),
        modifiedDate: '2020-09-16',
        createdBy: 'Jahnavi',
        modifiedBy: 'Chinnari',
        instructor: this.scheduleForm.get('Instructor').value,
        hrManager: 'Raja Ramesh',
      }
      this.dataService.post(apis.scheduleUpdate, body).subscribe((res: any) => {
        this.addResponse = res

        if (this.addResponse.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Updated',
            'Your data has been successfully Updated',
          )
          this.getTableData()
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
        }
      })
    }
    this.visiblEdit = false
    this.scheduleForm.reset()
  }

  scheduleEditCancel() {
    this.visiblEditshedule = false
  }

  scheduleEdithandleOk(): void {
    this.visiblEditshedule = false
  }

  schedulesEdit(data): void {
    this.visiblEditshedule = true
    console.log("Editttttttt", data.startTime);
    const datee = new Date()
    console.log('editttt', data.startTime.split(':')[0])
    console.log('editttt', data.startTime.split(':')[1])
    let mins = data.startTime.split(':')[1];
    datee.setHours(data.startTime.split(':')[0]);
    datee.setMinutes(mins.split(' ')[0]);
    console.log(datee);
    this.scheduleForm.get('Cost').patchValue(data.cost)
    this.scheduleForm.get('offeredDate').patchValue(data.offeredDate)
    this.scheduleForm.get('Instructor').patchValue('data')
    this.scheduleForm.get('locationType').patchValue(data.locationType)
    this.scheduleForm.get('startTime').patchValue(datee)
    this.editId = data.id
  }
  // Dalete the grid data with the particular row in the schedule screen
  deleteSchedule(data) {
    this.docdata = data.id
    const data1 = {
      id: data.id,
    }
    this.dataService.post(apis.scheduleDelete, data1).subscribe((res: any) => {
      this.delData = res

      if (this.delData.hasOwnProperty('Result') === true) {
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
      this.allIssues.length === 1 ? this.pageNumshedule = this.pageNumshedule - 1 : this.pageNumshedule
      this.getTableData()

    })
  }
  // Redirect to navigation for enablement screen

  gotoEnablement() {
    this.router.navigate(['/dashboard/enablement'])
  }
  // Enroll cancel method
  enrollAddCancel() {
    this.enrollVisible = false
    this.enrollAddForm.reset();
  }
  enrollAddhandleOk() {
    this.enrollVisible = false
  }
  // Add and Update the Enroll list
  startEditEnroll(id, data) {
    console.log(data, typeof data)
    this.enrollVisible = true

    if (data === 'data') {
      this.viewUpdateEnroll = false
      this.title = 'Add Enroll';
      this.btnLabel = 'Save';
      this.icon = 'save';
      this.enrollAddForm.get('enrollattendeeId').patchValue(this.attendeeId)
      this.enrollAddForm.get('enrollattendeeMgrId').patchValue(this.userName)
      this.enrollAddForm.get('enrollcrsScheduleId').patchValue(id)
      this.enrollAddForm.get('enrollstatus').patchValue('C')
    } else if (data != 'data') {
      this.title = 'Edit Enroll';
      this.btnLabel = 'Update';
      this.icon = 'edit'
      this.viewUpdateEnroll = true
      this.enrollEdit(data);
    }
  }
  saveRupdateEnroll() {
    if ((this.viewUpdateEnroll === false)) {
      this.enrollAddpopup()

    }
    if ((this.viewUpdateEnroll === true)) {
      this.enrolleditpopup()

    }
    console.log(this.viewUpdateEnroll)
  }
  enrollAddpopup() {
    if (this.enrollAddForm.untouched || this.enrollAddForm.invalid) {
      this.submitAddEnroll()
    }
    if (this.enrollAddForm.valid) {
      const currentDate = new Date()
      let body = {
        crsScheduleId: this.enrollAddForm.controls.enrollcrsScheduleId.value,
        attendeeId: this.enrollAddForm.controls.enrollattendeeId.value,
        attendeeMgrId: this.enrollAddForm.controls.enrollattendeeMgrId.value,
        status: this.enrollAddForm.controls.enrollstatus.value,
        attendance: '',
        quiz: '',
        instructorFeedback: '123',
        attendeeFeedback: '123',
        comments: this.enrollAddForm.controls.enrollcomments.value,
        addedDate: currentDate,
        approvedDate: '',
        modifiedDate: '',
        createdBy: this.userName,
        modifiedBy: '',

      }
      this.dataService.post(apis.addenrollform, body).subscribe((res: any) => {
        this.addResponse = res

        if (this.addResponse.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Added',
            'Your data has been successfully added',
          )
          this.enrollVisible = false
          this.enrollTable()
          this.myshedulegettabledata()
        } else {
          this.notification.create('error', 'Failed to Add', 'Your data is failed to Add ')
        }
      })

      this.enrollAddForm.reset()
      this.enrollVisible = false
    }
  }
  // get the values and patch the values in to the update form

  enrollEdit(data) {
    this.erollEditData = data
    this.EnrollvisiblEedit = true
    this.enrollAddForm.get('enrollcrsScheduleId').patchValue(data.crsScheduleId)
    this.enrollAddForm.get('enrollattendeeId').patchValue(data.attendeeId)
    this.enrollAddForm.get('enrollattendeeMgrId').patchValue(data.attendeeId)
    this.enrollAddForm.get('enrollstatus').patchValue(data.status)
    this.enrollAddForm.get('enrollattendeeFeedback').patchValue(data.attendeeFeedback)
    this.enrollAddForm.get('enrollcomments').patchValue(data.comments)
    this.enrolleditId = data.id
  }

  enrolleditpopup() {
    if (this.enrollAddForm.untouched || this.enrollAddForm.invalid) {
      this.submitEditEnroll()
    }
    if (this.enrollAddForm.valid) {
      const currentDate = new Date()
      console.log(this.erollEditData)
      let body = {
        crsScheduleId: this.enrollAddForm.get('enrollcrsScheduleId').value,
        attendeeId: this.enrollAddForm.get('enrollattendeeId').value,
        attendeeMgrId: this.enrollAddForm.get('enrollattendeeMgrId').value,
        status: this.enrollAddForm.get('enrollstatus').value,
        attendance: this.erollEditData['attendance'],
        quiz: this.erollEditData['quiz'],
        instructorFeedback: this.erollEditData['instructorFeedback'],
        attendeeFeedback: this.enrollAddForm.get('enrollattendeeFeedback').value,
        comments: this.enrollAddForm.get('enrollcomments').value,
        addedDate: this.erollEditData['addedDate'],
        approvedDate: currentDate,
        modifiedDate: currentDate,
        createdBy: this.erollEditData['createdBy'],
        modifiedBy: this.loginId,
        id: this.enrolleditId,
      }
      this.dataService.post(apis.updateEnroll, body).subscribe((res: any) => {
        this.addResponse = res

        if (this.addResponse.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Updated',
            'Your data has been successfully Updated',
          )
          this.enrollTable()
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
        }
      })

      this.enrollAddForm.reset()
      this.enrollVisible = false
    }
  }
  // Delete the enroll list with the particular row in to the grid
  enrollDelete(data) {
    this.docdata = data.id
    const data1 = {
      id: data.id,
    }
    this.dataService.post(apis.deleteEnroll, data1).subscribe((res: any) => {
      console.log(res)
      this.delData = res
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
      this.enrolldatatable.length === 1 ? this.pageNumenroll = this.pageNumenroll - 1 : this.pageNumenroll
      this.enrollTable()
    })
  }

  enrollEditCancel() {
    this.enrollVisible = false
  }

  enrollEdithandleOk() {
    this.enrollVisible = false
  }

  resetEnrolledList() {
    this.enrolledList.reset()
    this.enrollTable()
  }
  // Get Enroll data Method
  enrollTable() {
    let reqBody = {
      pageNum: this.pageNumenroll,
      pageSize: this.pageSizeenroll,
      "createdBy": '',
      "status": '',
      "approvedDate": '',
    }
    this.dataService.post(apis.searchEnroll, reqBody).subscribe((res: any) => {
      this.enrolldatatable = res[0].data
      this.enrolltotalPages = res[0].count
      this.enrolledTableLength = this.enrolldatatable.length
    })
  }
  // Search Enroll with the required fields
  searchEnrolledList() {
    const enrollcreatedBy = this.enrolledList.controls.enrolledCreatedBy.value
    const enrollstatus = this.enrolledList.controls.enrolledStatus.value
    const enrollDate = this.enrolledList.controls.enrolledDate.value
    const enrollapprovedDate = this.datePipe.transform(enrollDate, 'yyyy-MM-dd')

    let reqBody = {
      pageNum: this.pageNumenroll,
      pageSize: this.pageSizeenroll,
      "createdBy": enrollcreatedBy === null || enrollcreatedBy === undefined ? '' : enrollcreatedBy,
      "status": enrollstatus,
      "approvedDate": enrollapprovedDate === null || enrollapprovedDate === undefined ? '' : enrollapprovedDate,
    }
    this.dataService.post(apis.searchEnroll, reqBody).subscribe(res => {
      console.log(res)
      this.records = res[0].count
      this.enrolldatatable = res[0].data
    })
  }
  resetCoureDetails() {
    this.courseDetailsForm.reset()
  }
  searchCourseDetails() {

  }
  // Get Modules to Display the grid
  getModules() {
    const createdDate = this.datePipe.transform(this.moduleSearchForm.get('createdDate').value, 'yyyy-MM-dd')
    const title = this.moduleSearchForm.get('title').value
    const author = this.moduleSearchForm.get('author').value
    const createdBy = this.moduleSearchForm.get('createdBy').value
    let reqBody = {
      "pageNum": this.pageNummodule,
      "pageSize": this.pageSizemodule,
      "mTitle": title === null || title === undefined ? '' : title,
      "author": author === null || author === undefined ? '' : author,
      "createdDate": createdDate === null || createdDate === undefined ? '' : createdDate,
      "createdBy": createdBy === null || createdBy === undefined ? '' : createdBy,
    }
    this.dataService.post(apis.getAllmodules, reqBody).subscribe((res) => {
      this.moduleData = res[0].data;
      this.totalPages = res[0].count;
    })
  }

  openForm(item, type) {
    this.type = type
    this.item = item

    if (type === 'add') {
      this.openModuleForm = true
      this.btnLabel = "Save";
      this.formTitle = "Add Module";
      this.icon = "save";
      this.endPoint = apis.addCoursemodule
    }
    else if (type === 'edit') {
      this.btnLabel = "Update";
      this.formTitle = "Edit Module";
      this.icon = "edit";
      this.endPoint = apis.updateCourseModule
      this.moduleAddUpdateForm.get('moduleTitle').patchValue(this.item.mTitle),
        this.moduleAddUpdateForm.get('estimatedTime').patchValue(this.item.estimatedTime),
        this.moduleAddUpdateForm.get('description').patchValue(this.item.description)
    }
    this.openModuleForm = true
  }
  // Add and update method
  addRUpdateModules() {
    if (this.moduleAddUpdateForm.untouched || this.moduleAddUpdateForm.invalid) {

      this.submitAddModule()
    }

    if (this.moduleAddUpdateForm.valid) {

      let newModule = {
        "estimatedTime": this.moduleAddUpdateForm.controls.estimatedTime.value,
        "createdBy": this.type === 'edit' ? this.item.createdBy : this.userName,
        "createdDate": this.type === 'edit' ? this.item.createdDate : '',
        "author": this.type === 'edit' ? this.item.author : this.userName,
        "modifiedDate": this.type === 'edit' ? this.datePipe.transform(new Date(), 'yyyy-MM-dd') : '',
        "description": this.moduleAddUpdateForm.controls.description.value,
        "mTitle": this.moduleAddUpdateForm.controls.moduleTitle.value,
        "modifiedBy": this.type === 'edit' ? this.userName : '',
        "id": this.type === 'edit' ? this.item.id : '',
      }
      this.dataService.post(this.endPoint, newModule).subscribe((res) => {
        if (this.type === 'add') {
          if (res.hasOwnProperty('success') === true) {
            this.notification.create(
              'success',
              'Successfully Added',
              'Your data has been successfully added',
            )
            this.getModules()
          }

          else {
            this.notification.create('error', 'Failed to Add', 'Your data is failed to Add ')
          }
        }
        else {
          if (res.hasOwnProperty('success') === true) {
            this.notification.create(
              'success',
              'Successfully Updated',
              'Your data has been successfully Updated',
            )
            this.getModules()
          }

          else {
            this.notification.create('error', 'Failed to Updated', 'Your data is failed to Updated ')
          }

        }
      })
      this.openModuleForm = false
      this.moduleAddUpdateForm.reset()
    }
  }
  // Delete module method
  deleteModule(id) {
    let reqBody = {
      "id": id
    }
    this.dataService.post(apis.deleteModule, reqBody).subscribe((res) => {

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
      this.getModules()
    })
  }

  // Get section to display the grid

  getSections() {

    let modId = {
      "moduleId": this.selectedModuleId,
      "pageNum": this.pageNumsection,
      "pageSize": this.pageSizesection
    }
    this.dataService.post(apis.getSections, modId).subscribe((res) => {
      this.sectionData = res[0].data

    })
  }

  // Add and Update the sections
  sectionForm(data, type) {
    this.openSetionForm = true
    this.stype = type
    this.secData = data
    console.log("patch data", this.secData);
    if (this.stype === 'add') {
      this.btnLabel = 'Save';
      this.icon = 'save';
      this.formTitle = 'Add Section';
      this.endPoint = apis.addSection;
    }
    else if (this.stype === 'edit') {
      this.btnLabel = 'Update';
      this.icon = 'edit';
      this.formTitle = 'Edit Section';
      this.endPoint = apis.updateSection
      this.sectionAddUpdateForm.get('seqNo').patchValue(this.secData.seqNo),
        this.sectionAddUpdateForm.get('sectionTitle').patchValue(this.secData.sectionTitle),
        this.sectionAddUpdateForm.get('description').patchValue(this.secData.description),
        this.sectionAddUpdateForm.get('videoLinks').patchValue(this.secData.videoLinks),
        this.sectionAddUpdateForm.get('htmlLinks').patchValue(this.secData.htmlLinks),
        this.sectionAddUpdateForm.get('notes').patchValue(this.secData.notes),
        this.sectionAddUpdateForm.get('estimatedTime').patchValue(this.secData.estimatedTime)
    }
  }
  addRUpdateSection() {

    if (this.sectionAddUpdateForm.untouched || this.sectionAddUpdateForm.invalid) {

      this.submitAddSection()
    }

    if (this.sectionAddUpdateForm.valid) {
      let sectionDetails = {
        "id": this.stype === 'edit' ? this.secData.id : '',
        "moduleId": this.selectedModuleId,
        "estimatedTime": this.sectionAddUpdateForm.controls.estimatedTime.value,
        "author": this.stype === 'edit' ? this.secData.author : this.userName,
        "createdBy": this.stype === 'edit' ? this.secData.createdBy : this.userName,
        "modifiedBy": this.stype === 'edit' ? this.userName : '',
        "seqNo": this.sectionAddUpdateForm.controls.seqNo.value,
        "sectionTitle": this.sectionAddUpdateForm.controls.sectionTitle.value,
        "description": this.sectionAddUpdateForm.controls.description.value,
        "videoLinks": this.sectionAddUpdateForm.controls.videoLinks.value,
        "htmlLinks": this.sectionAddUpdateForm.controls.htmlLinks.value,
        "notes": this.sectionAddUpdateForm.controls.notes.value,
      }
      this.dataService.post(this.endPoint, sectionDetails).subscribe((res) => {
        this.responseSections = res

        if (this.stype == 'add') {
          if (this.responseSections.hasOwnProperty('success') === true) {
            this.notification.create(
              'success',
              'Successfully Added',
              'Your data has been successfully Added',
            )
            this.getSections()
          }

          else {
            this.notification.create('error', 'Failed to Add', 'Your data is failed to Add ')
          }
        }
        else {

          if (this.responseSections.hasOwnProperty('success') === true) {
            this.notification.create(
              'success',
              'Successfully Updated',
              'Your data has been successfully updated',
            )
            this.getSections()
          }

          else {
            this.notification.create('error', 'Failed to updated', 'Your data is failed to updated ')
          }

        }
      })
      this.openSetionForm = false
      this.sectionAddUpdateForm.reset()
    }
  }

  // Delete the sections

  deleteSection(id) {
    let secId = {
      "id": id
    }
    this.dataService.post(apis.deleteSection, secId).subscribe((res) => {

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
      this.getSections()

    })
  }

  cancel() {
    this.openModuleForm = false
    this.moduleAddUpdateForm.reset()
    this.moduleSearchForm.reset()
    this.openSetionForm = false
    this.sectionAddUpdateForm.reset()
    this.getModules()
    this.getSections()
  }
  getStatusEnrollList() {
    this.http.get(apis.statusEnrollList).subscribe(res => {
      this.enrollStatusList = res
    })

  }
  statusoption = {
    C: 'Request for Approval',
    H: 'HR Approval',
    M: 'Manager Approval',
    R: 'Rejected',
    W: 'With Drawn',
  }
  // Get the my schedule data to display the grid
  myshedulegettabledata() {
    const body = {
      "pageNum": this.pageNummyshedule,
      "pageSize": this.pageSizemyshedule,
      "attendeeId": this.userName,
    }
    this.dataService.post(apis.mysheduleGetData, body).subscribe((res: any) => {
      console.log('responcess', res)
      this.mysheduletableData = res[0].data
      this.mysheduletotalPages = res[0].count;
      console.log('Get myshedule data...', this.mysheduletableData)
      this.mysheduletablelength = this.mysheduletableData.length

    })
  }
  resetMyshedule() {
    this.mysheduleform.reset()
    this.myshedulegettabledata()
  }
  // Search the my schedule
  mysheduleSearch() {

    const cTitle = this.mysheduleform.get('myschedulectitle').value
    const Instructor = this.mysheduleform.get('myscheduleinstructor').value
    const sDate = this.mysheduleform.controls.myschedulestartdate.value
    const Startdate = this.datePipe.transform(sDate, 'yyyy-MM-dd')
    let reqBody = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      "attendeeId": this.userName,
      "cTitle": cTitle === null || cTitle === undefined ? '' : cTitle,
      "instructor": Instructor === null || Instructor === undefined ? '' : Instructor,
      "startDate": Startdate
    }
    console.log(reqBody)
    this.dataService.post(apis.mysheduleSearch, reqBody).subscribe(res => {
      console.log(res)

      this.mysheduletableData = res[0].data
    })

  }
  submitAddModule(): void {
    for (const i in this.moduleAddUpdateForm.controls) {
      this.moduleAddUpdateForm.controls[i].markAsTouched()
      this.moduleAddUpdateForm.controls[i].updateValueAndValidity()
    }
  }
  submitAddSection(): void {
    for (const i in this.sectionAddUpdateForm.controls) {
      this.sectionAddUpdateForm.controls[i].markAsTouched()
      this.sectionAddUpdateForm.controls[i].updateValueAndValidity()
    }
  }
  submitAddSchedule(): void {
    for (const i in this.scheduleForm.controls) {

      this.scheduleForm.controls[i].markAsTouched()
      this.scheduleForm.controls[i].updateValueAndValidity()

    }

  }
  submitEditSchedule(): void {
    for (const i in this.scheduleForm.controls) {
      this.scheduleForm.controls[i].markAsTouched()
      this.scheduleForm.controls[i].updateValueAndValidity()
    }
  }
  submitAddEnroll(): void {
    for (const i in this.enrollAddForm.controls) {
      this.enrollAddForm.controls[i].markAsTouched()
      this.enrollAddForm.controls[i].updateValueAndValidity()
    }
  }
  submitEditEnroll(): void {
    for (const i in this.enrollAddForm.controls) {
      this.enrollAddForm.controls[i].markAsTouched()
      this.enrollAddForm.controls[i].updateValueAndValidity()
    }
  }
  // click on the video link to open the new tab
  videoLink(Link) {
    window.open(Link)
  }
  onStartTime(date: Date): void {
    console.log("date", date)
    const time: any = this.scheduleForm.controls.value;
    console.log("time", time)
  }
}



