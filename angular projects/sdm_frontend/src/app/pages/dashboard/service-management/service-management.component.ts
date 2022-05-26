import { DataService } from './../../../data.service'
import { DatePipe } from '@angular/common'
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js'
import { HostListener } from '@angular/core'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { apis } from 'src/app/api'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from 'ng2-charts'
import { Color } from 'ng2-charts'

@Component({
  selector: 'app-service-management',
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.scss'],
  providers: [DatePipe],
})
export class ServiceManagementComponent implements OnInit {
  header = 'Search'
  ProjectName: string
  customerName: any
  projectId: any
  openAddSmForm = false
  openEditSmform = false
  addSmForm: FormGroup
  searchForm: FormGroup
  editSmForm: FormGroup
  size: NzSelectSizeType = 'default'
  id: any
  loginPerson: any
  assignedDate: any
  allSm: any
  listOfResources: any
  pageNum: number = 1
  pageSize: number = 10
  assignedTo: any
  searchTerm: any
  sStatus: String
  sIssue: String
  sDate: any
  status: any[]
  priority: any[]
  today = new Date()
  searchDate: string
  searchStatus: any
  searchIssue: any
  noOfRecords: any
  totalPages: any
  records: any

  //dashboards///
  public pieChartOptions: ChartOptions = {
    responsive: true,
  }
  // public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales']
  // public pieChartData: SingleDataSet = [300, 500, 100]

  public pieChartLabel = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  public pieChartLabel1 = [
    'Integration ',
    'B2B',
    'Edge',
    'Data SAP',
    'Devops',
    'Security',
    'Infrastructure',
  ]
  public pieChartLabel2 = ['Open', 'Pending', 'Investigating', 'Resolved']
  public pieChartLabel3 = ['Major Enhancement Hrs', 'Minor Enhancement Hrs', 'Change Requests']
  public pieChartData = [40, 30, 10, 20]
  public pieChartData1 = [10, 40, 6, 13, 18, 10, 15]
  public pieChartData2 = [20, 10, 30, 40]
  public pieChartData3 = [50, 30, 30]

  public pieChartOptions1 = this.createOptions('Total Ticket Count grouped by Bucket')
  public pieChartOptions2 = this.createOptions('Total Ticket Count Grouped by Resources')
  public pieChartOptions3 = this.createOptions('Total Ticket Count Grouped by Status')
  public pieChartOptions4 = this.createOptions('Total Ticket Count Grouped by Status')

  private createOptions(title): ChartOptions {
    return {
      legend: {
        display: true,
        position: 'right',
        labels: {
          boxWidth: 6,
        },
      },
      title: {
        display: true,
        text: title,
        position: 'bottom',
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        display: false,
      },
    }
  }

  public pieChartType: ChartType = 'pie'
  public pieChartLegend = true
  public pieChartPlugins = []

  table1Data = [
    {
      status: 'Approved',
      hours: 12,
    },
    {
      status: 'Under Estimation',
      hours: 22,
    },
    {
      status: 'Closed',
      hours: 31,
    },
  ]

  table2Data = [
    {
      status: 'Approved',
      hours: 32,
      request: 'Mounika',
    },
    {
      status: 'Under Estimation',
      hours: 42,
      request: 'Ravali',
    },
    {
      status: 'Closed',
      hours: 32,
      request: 'Sudheer',
    },
  ]

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private route: Router,
    private dataService: DataService,
  ) {
    monkeyPatchChartJsTooltip()
    monkeyPatchChartJsLegend()
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
      this.status = IsType
      this.priority = IpType
    })
  }

  ngOnInit(): void {
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.loginPerson = JSON.parse(sessionStorage.getItem('loginData')).FName
    this.searchForm = this.fb.group({
      sTitle: [null],
      sStatus: [null],
      sPriority: [null],
      sAssignedTo: [null],
      sRequestedBy: [null],
      sStartDate: [null],
      sEndDate: [null],
    })
    ;(this.pageNum = 1), (this.pageSize = 10), this.getBySearch()
  }

  ///////////////////Disabling Past Dates///////////
  disabledDate = (current: Date): boolean => {
    return (
      differenceInCalendarDays(current, this.today) < 0 ||
      differenceInCalendarDays(current, this.today) > 0
    )
  }
  disabledDate1 = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0
  }

  ///////////////////////////DropDowns////////////////////////////////////////////

  dStatus: any = [
    { label: 'Opened', value: 'O' },
    { label: 'Assigned', value: 'A' },
    { label: 'In progress', value: 'I' },
    { label: 'Resolved', value: 'R' },
    { label: 'Closed', value: 'C' },
  ]
  dPriority: any = [
    { label: 'Low', value: 'L' },
    { label: 'Medium', value: 'M' },
    { label: 'High', value: 'H' },
  ]
  dIssuetype: any = [
    { label: 'Suggestion', value: 'S' },
    { label: 'Bug', value: 'B' },
    { label: 'Enhancement', value: 'E' },
  ]

  tStatus = {
O: 'Opened',
A: 'Assigned',
I: 'In progress',
R: 'Resolved',
F: 'Closed',
E: 'Estimated',
D : 'Deployed',
C: 'Created',
G: 'Generated'
}
  tPriority = {
    L: 'Low',
    M: 'Medium',
    H: 'High',
  }
  tIssuetype = {
    S: 'Suggestion',
    B: 'Bug',
    E: 'Enhancement',
  }

  addScreen() {
    this.route.navigate(['/dashboard/serviceAdd'])
  }

  ///////////////////////////////////Get All Records///////////////////////////////
  getBySearch() {
    const title = this.searchForm.controls.sTitle.value
    const status = this.searchForm.controls.sStatus.value
    const priority = this.searchForm.controls.sPriority.value
    const assignTo = this.searchForm.controls.sAssignedTo.value
    const createBy = this.searchForm.controls.sRequestedBy.value

    const closeDate = this.datePipe.transform(this.searchForm.get('sEndDate').value, 'yyyy-MM-dd')
    const creatDate = this.datePipe.transform(this.searchForm.get('sStartDate').value, 'yyyy-MM-dd')
    let reqBody = {
      pageNum: 1,
      pageSize: 10,
      projectId: this.projectId,
      assignedTo: assignTo === null || assignTo === undefined ? '' : assignTo,
      createdDate: creatDate === null || creatDate === undefined ? '' : creatDate,
      closedDate: closeDate === null || closeDate === undefined ? '' : closeDate,
      uxStatus: status === null || status === undefined ? '' : status,
      uxPriority: priority === null || priority === undefined ? '' : priority,
      createdBy: createBy === null || createBy === undefined ? '' : createBy,
      title: title === null || title === undefined ? '' : title,
    }
    this.dataService.post(apis.getServiceManagement, reqBody).subscribe(res => {
      this.allSm = res[0].data
      this.records = res[0].count
      this.totalPages = this.records
    })
  }

  /////////////////////////////////Searching/////////////////////////////////////
  reset() {
    this.sStatus = null
    this.sDate = null
    this.sIssue = null
    this.getBySearch()
  }
  /////////////////////////////////Post New Records///////////////////////////////
  addSm() {
    this.openAddSmForm = true
  }

  ////////////////////////////////Update SM Records////////////////////////////////
  editSm(data) {
    console.log(data)
    this.route.navigate(['/dashboard/serviceUpdate', data])
  }

  /////////////////////////////////// Delete SM /////////////////////////////////

  deleteRow(id) {
    let dId = {
      id: id,
    }
    this.dataService.post(apis.deleteServiceManagement, dId).subscribe(res => {
      console.log(res)
      this.getBySearch()
    })
    this.getBySearch()
  }
  /////////////////////////////////////////////////////////////////////////////////
  cancel() {
    this.openAddSmForm = false
    // this.addSmForm.reset()
    this.openEditSmform = false
    this.editSmForm.reset()
  }

  /////////////////////////BreadCrumbs/////////////////////////////////////////////
  gotoHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }

  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  //line charts

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ]
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  public lineChartOptions: ChartOptions = {
    responsive: true,
  }
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ]
  public lineChartLegend = true
  public lineChartType = 'line'
  public lineChartPlugins = []

  //bar charts

  public barChartOptions: ChartOptions = {
    responsive: true,
  }
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012']
  public barChartType = 'bar'
  public barChartLegend = true
  public barChartPlugins = []

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
  ]
}
