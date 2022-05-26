import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { Router } from '@angular/router'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import { HostListener } from '@angular/core'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzMessageService } from 'ng-zorro-antd/message'
///////////////Dashboard///////////
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js'
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from 'ng2-charts'
import { Color } from 'ng2-charts'

@Component({
  selector: 'app-defects',
  templateUrl: './defects.component.html',
  styleUrls: ['./defects.component.scss'],
  providers: [DatePipe],
})
export class DefectsComponent implements OnInit {
  //dashboards///
  public pieChartOptions = this.createOptions('Total Ticket Count grouped by Bucket')
  public pieChartOptions1 = this.createOptions('Total Ticket Count Grouped by Resources')
  public pieChartOptions2 = this.createOptions('Total Ticket Count Grouped by Status')
  public pieChartOptions3 = this.createOptions('Total Ticket Count Grouped by Priority')
  public pieChartOptions4 = this.createOptions('Total Ticket Count Grouped by Severity')
  public pieChartOptions5 = this.createOptions('Total Ticket Count Grouped by Category')
  public pieChartOptions6 = this.createOptions('Total Ticket Count Grouped by Component')

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
        // labels: {
        //   render: function(args) {
        //     return args.value + '%'
        //   },
        // },
      },
    }
  }

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
  public pieChartLabel3 = ['Low   ', 'Medium     ', 'High']
  public pieChartLabel4 = ['Critical', 'Major', 'Moderate', 'Minor', 'Cosmetic']
  public pieChartLabel5 = ['FrontEnd', 'MiddleWare', 'Network', 'Firewall', 'Systems']
  public pieChartLabel6 = ['Issues', 'Service', 'Risk']
  public pieChartData = [40, 30, 10, 20]
  public pieChartData1 = [10, 40, 6, 13, 18, 10, 15]
  public pieChartData2 = [20, 10, 30, 40]
  public pieChartData3 = [20, 30, 10]
  public pieChartData4 = [22, 27, 17, 19, 20]
  public pieChartData5 = [21, 18, 22, 6, 4, 13]
  public pieChartData6 = [26, 24, 13]

  // public pieChartLabels: Label[] = ['Download Sales', ['In', 'Store', 'Sales'], 'Mail Sales']
  // public pieChartData: SingleDataSet = [300, 500, 100]
  public pieChartType: ChartType = 'pie'
  public pieChartLegend = true
  public pieChartPlugins = []

  searchTerm
  pageNum: number
  pageSize: number
  noOfRecords: number
  totalPages: number
  projectid: any
  type: any
  title: any
  rowdata: any
  description: any
  taskId: any
  releaseId: any
  targetDate: any
  resolvedDate: any
  severity: any
  createdBy: any
  modifiedDate: any
  modifiedBy: any
  tableData = []
  size: NzSelectSizeType = 'default'
  addForm: boolean
  addData: FormGroup
  editForm: boolean = false
  editData: FormGroup
  perData: any
  header = 'Search'

  customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
  ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
  projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
  private notification: NzNotificationService
  /////search/////
  searchForm: FormGroup
  sTitle: string
  sStatus: string
  sPriority: string
  sAssignedTo: string
  sRequestedBy: string
  sStartDate: string
  sEndDate: string
  editstartdate: Date
  allIssues: Object
  listOfResources: any
  status: any[]
  priority: any[]
  records: any
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getBySearch(), (this.pageNum = 1)
    }
  }

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private route: Router,
    private datePipe: DatePipe,
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
      console.log('Dropdowns', IAType, IBType, ITType, ICType, IRType, SIType, IsType, IpType)
      this.status = IsType
      this.priority = IpType
      console.log('checkind=g dd', this.status)
    })
  }

  ngOnInit(): void {
    this.pageSize = 5
    this.pageNum = 1
    this.totalPages = 10
    this.searchForm = this.fb.group({
      sTitle: [null],
      sStatus: [null],
      sPriority: [null],
      sAssignedTo: [null],
      sRequestedBy: [null],
      sStartDate: [null],
      sEndDate: [null],
    })

    this.getBySearch()
  }
  addUpdateScreen() {
    this.route.navigate(['/dashboard/addIssues'])
  }

  //////////////////////////DropDowns///////////////////////////////
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

  //////////////////////////Get ALL Issues/////////////////////////

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
      title: title === null || title === undefined ? '' : title,
      uxStatus: status === null || status === undefined ? '' : status,
      uxPriority: priority === null || priority === undefined ? '' : priority,
      closedDate: closeDate === null || closeDate === undefined ? '' : closeDate,
      createdDate: creatDate === null || creatDate === undefined ? '' : creatDate,
      assignedTo: assignTo === null || assignTo === undefined ? '' : assignTo,
      createdBy: createBy === null || createBy === undefined ? '' : createBy,
    }
    this.dataService.post(apis.getIssues, reqBody).subscribe(res => {
      this.allIssues = res[0].data
      this.records = res[0].count
      console.log(res)
    })
  }

  reset() {
    this.searchForm.reset()
    this.getBySearch()
  }

  addRow(): void {
    this.addForm = true
  }

  editIssue(id) {
    this.route.navigate(['/dashboard/updateIssues', id])
  }

  deleteRow(id) {
    let dId = {
      id: id,
    }
    this.dataService.post(apis.deleteIssues, dId).subscribe(res => {
      this.getBySearch()
      if (res.hasOwnProperty('Result') === true) {
        setTimeout(() => {
          this.notification.create('success', 'Successfully Deleted', 'Record Deleted successfully')
          // this.message.success(`${res.success}`);
        }, 1000)
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
      }
      this.getBySearch()
    })
  }

  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageNum = 1
    this.pageSize = data
    this.getBySearch()
  }
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getBySearch()
  }
  backNavigate() {
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }

  //////////////////////Breadcrumb//////////////////

  gotoHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }

  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }

  //line charts

  lineChartLabels: Label[] = ['9/26/20', '9/25/20', '9/24/20']
  lineChartLegend = true
  lineChartData: ChartDataSets[] = [
    {
      data: [1, 2, 3, 2, 5, 10, 9, 2, 5, 5],
      label: 'Created',
      backgroundColor: ['rgba(213, 137, 93, 0.6)'],
      fill: false,
    },
    {
      data: [4, 9, 1, 1, 6, 3, 9, 1, 8, 1],
      label: 'Resolved',
      backgroundColor: ['rgba(213, 93, 169, 0.6)'],
      fill: false,
    },
    {
      data: [3, 6, 1, 9, 4, 7, 1, 0, 3, 1],
      label: 'Deployed',
      backgroundColor: ['rgba(55, 154, 160, 0.56)'],
      fill: false,
    },
  ]

  public lineChartOptions: ChartOptions = {
    legend: {
      display: true,
      labels: {
        boxWidth: 6,
      },
    },
    responsive: true,
    title: {
      display: true,
      text: 'Tickets Status',
      position: 'bottom',
    },
  }

  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ]
  // public lineChartLegend = true
  public lineChartType = 'line'
  public lineChartPlugins = []

  //bar charts

  public barChartOptions: ChartOptions = {
    legend: {
      display: true,
      labels: {
        boxWidth: 6,
      },
    },
    responsive: true,
    title: {
      display: true,
      text: 'Resource Allocation',
      position: 'bottom',
    },
  }

  // public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012']
  public barChartType = 'bar'
  // public barChartLegend = true
  public barChartPlugins = []
  public barChartLabels: Label[] = ['9/26/20', '9/25/20', '9/24/20']
  public barChartLegend = true
  public barChartData: ChartDataSets[] = [
    { data: [45, 37, 60], label: 'Estimated' },
    { data: [10, 66, 96], label: 'Aavailable' },
    { data: [100, 12, 20], label: 'Cosumed' },
  ]

  // public barChartData: ChartDataSets[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
  // ]
}
