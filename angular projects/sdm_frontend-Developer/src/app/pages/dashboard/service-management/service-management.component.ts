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
  projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
  customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
  ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
  loginPerson = JSON.parse(sessionStorage.getItem('loginData')).FName
  pieSearchForm: FormGroup
  searchForm: FormGroup
  size: NzSelectSizeType = 'default'
  id: any
  allSm: any
  listOfResources: any
  pageNum = 1
  pageSize = 5
  status: any[]
  priority: any[]
  today = new Date()
  totalPages: number
  records: any
  issueTypeDropDown: any[]
  severityDropDown: any[]
  bucketDropDown: any[]
  resulationTypeDropDown: any[]
  categoryDropDown: any[]
  typeDropDown: any[]
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getBySearch(), (this.pageNum = 1)
    }
  }
  pieChartLabel = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel1 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel2 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel3 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel4 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel5 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel6 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel7 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel8 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartData = [40, 30, 10, 20]
  pieChartData1 = [40, 30, 10, 20]
  pieChartData2 = [40, 30, 10, 20]
  pieChartData3 = [40, 30, 10, 20]
  pieChartData4 = [40, 30, 10, 20]
  pieChartData5 = [40, 30, 10, 20]
  pieChartData6 = [40, 30, 10, 20]
  pieChartData7 = [40, 30, 10, 20]

  public pieChartOptions = this.createOptions('Total Ticket Count grouped by Bucket')
  public pieChartOptions1 = this.createOptions('Total Ticket Count grouped by Status')
  public pieChartOptions2 = this.createOptions('Total Ticket Count Grouped by Priority')
  public pieChartOptions3 = this.createOptions('Total Ticket Count Grouped by Severity')
  public pieChartOptions4 = this.createOptions('Total Ticket Count Grouped by Category')
  public pieChartOptions5 = this.createOptions('Total Ticket Count Grouped by Approval')
  public pieChartOptions6 = this.createOptions('Total Ticket Count Grouped by Resolution')
  public pieChartOptions7 = this.createOptions('Total Ticket Count Grouped by Type')
  approvalType: any[]
  private createOptions(title): ChartOptions {
    return {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 6,
        },
      },
      responsive: true,
      maintainAspectRatio: true,
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
      this.approvalType = IAType
      this.issueTypeDropDown = ITType
      this.severityDropDown = SIType
      this.bucketDropDown = IBType
      this.categoryDropDown = ICType
      this.resulationTypeDropDown = IRType
    })
  }
  ngOnInit(): void {

    ////////////////////////Priorities dropdown///////////////////

    this.dataService.get(apis.issuesPriority).subscribe(res => {
      this.priority = res
    })

    this.pieSearchForm = this.fb.group({
      startDateBucket: [new Date(new Date().setDate(new Date().getDate() - 30))],
      endDateBucket: [new Date()],
    })
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
    this.getContacts()
  }

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
  ///////////////////////////DropDowns///////////////////////////////////////////
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
    D: 'Deployed',
    C: 'Created',
    G: 'Generated',
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

  ////////////Redirect to ad service request form ////////////////
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
      pageNum: this.pageNum,
      pageSize: this.pageSize,
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
      this.totalPages = res[0].count
    })
    this.dataByBucket()
    this.dataByStatus()
    this.dataBySeverity()
    this.dataByPriority()
    this.dataByApproval()
    this.dataByCategory()
    this.dataByResolution()
    this.dataByType()
    this.dataByLinChart();
  }

///////////////Pagination/////////////////////

  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getBySearch()
  }
  onPageSizeChange(data) {
    this.pageSize = data
    this.getBySearch()
  }
/////////////////////////////////Searching/////////////////////////////////////
  reset() {
    this.getBySearch()
    this.searchForm.reset()
  }

///////////////////////////////// Gets Bucket Data /////////////////////////////////

  dataByBucket() {
    const startDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('startDateBucket').value,
      'yyyy-MM-dd',
    )
    const endDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('endDateBucket').value,
      'yyyy-MM-dd',
    )
    let reqBody = {
      projectId: this.projectId,
      createdDate: startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
      closedDate: endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
    this.dataService.post(apis.bucketData, reqBody).subscribe((res: any) => {
      this.pieChartLabel = []
      this.pieChartData = []
      res.forEach(element => {
        this.pieChartData.push(element.count)
        this.pieChartLabel.push(
          this.bucketDropDown.filter(x => x.optionKey === element.UxBucket)[0].optionValue,
        )
      })
    })
  }

  ///////////////////////////////// Gets Status Data /////////////////////////////////

  dataByStatus() {
    const startDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('startDateBucket').value,
      'yyyy-MM-dd',
    )
    const endDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('endDateBucket').value,
      'yyyy-MM-dd',
    )
    let reqBody = {
      projectId: this.projectId,
      createdDate: startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
      closedDate: endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
    this.dataService.post(apis.dataByStatus, reqBody).subscribe((res: any) => {
      this.pieChartData1 = []
      this.pieChartLabel1 = []
      res.forEach(element => {
        this.pieChartData1.push(element.count)
        this.pieChartLabel1.push(
          this.status.filter(x => x.optionKey === element.uxStatus)[0].optionValue,
        )
      })
    })
  }

  ///////////////////////////////// Gets Priority Data /////////////////////////////////

  dataByPriority() {
    const startDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('startDateBucket').value,
      'yyyy-MM-dd',
    )
    const endDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('endDateBucket').value,
      'yyyy-MM-dd',
    )
    let reqBody = {
      projectId: this.projectId,
      createdDate: startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
      closedDate: endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
    this.dataService.post(apis.dataByPriority, reqBody).subscribe((res: any) => {
      this.pieChartData2 = []
      this.pieChartLabel2 = []
      res.forEach(element => {
        this.pieChartData2.push(element.count)
        this.pieChartLabel2.push(
          this.priority.filter(x => x.optionKey === element.uxPriority)[0].optionValue,
        )
      })
    })
  }

  ///////////////////////////////// Gets Severity Data /////////////////////////////////

  dataBySeverity() {
    const startDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('startDateBucket').value,
      'yyyy-MM-dd',
    )
    const endDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('endDateBucket').value,
      'yyyy-MM-dd',
    )
    let reqBody = {
      projectId: this.projectId,
      createdDate: startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
      closedDate: endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
    this.dataService.post(apis.dataBySeverity, reqBody).subscribe((res: any) => {
      this.pieChartData3 = []
      this.pieChartLabel3 = []
      res.forEach(element => {
        this.pieChartData3.push(element.count)
        this.pieChartLabel3.push(
          this.severityDropDown.filter(x => x.optionKey === element.uxSeverity)[0].optionValue,
        )
      })
    })
  }

  ///////////////////////////////// Gets Category Data /////////////////////////////////

  dataByCategory() {
    const startDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('startDateBucket').value,
      'yyyy-MM-dd',
    )
    const endDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('endDateBucket').value,
      'yyyy-MM-dd',
    )
    let reqBody = {
      projectId: this.projectId,
      createdDate: startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
      closedDate: endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
    this.dataService.post(apis.dataBycategory, reqBody).subscribe((res: any) => {
      this.pieChartData4 = []
      this.pieChartLabel4 = []
      res.forEach(element => {
        this.pieChartData4.push(element.count)
        this.pieChartLabel4.push(
          this.categoryDropDown.filter(x => x.optionKey === element.UxCategory)[0].optionValue,
        )
      })
    })
  }

  ///////////////////////////////// Gets Approval Data /////////////////////////////////

  dataByApproval() {
    const startDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('startDateBucket').value,
      'yyyy-MM-dd',
    )
    const endDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('endDateBucket').value,
      'yyyy-MM-dd',
    )
    let reqBody = {
      projectId: this.projectId,
      createdDate: startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
      closedDate: endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
    this.dataService.post(apis.dataByApproval, reqBody).subscribe((res: any) => {
      this.pieChartData5 = []
      this.pieChartLabel5 = []
      res.forEach(element => {
        this.pieChartData5.push(element.count)
        this.pieChartLabel5.push(
          this.approvalType.filter(x => x.optionKey === element.UxApproval)[0].optionValue,
        )
      })
    })
  }

  ///////////////////////////////// Gets Resolution Data /////////////////////////////////

  dataByResolution() {
    const startDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('startDateBucket').value,
      'yyyy-MM-dd',
    )
    const endDateBucket = this.datePipe.transform(
      this.pieSearchForm.get('endDateBucket').value,
      'yyyy-MM-dd',
    )
    let reqBody = {
      projectId: this.projectId,
      createdDate: startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
      closedDate: endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
    this.dataService.post(apis.dataByResolution, reqBody).subscribe((res: any) => {
      this.pieChartData6 = []
      this.pieChartLabel6 = []
      res.forEach(element => {
        this.pieChartData6.push(element.count)
        this.pieChartLabel6.push(
          this.resulationTypeDropDown.filter(x => x.optionKey === element.UxResolution)[0]
            .optionValue,
        )
      })
    })
  }

///////////////////////////////// Gets Type Data /////////////////////////////////

  dataByType() {
  }


  ///////////////////////////////// Gets LineChart Data /////////////////////////////////

  dataByLinChart(){
   const startDateBucket = this.datePipe.transform(this.pieSearchForm.get('startDateBucket').value,'yyyy-MM-dd')
   const endDateBucket = this.datePipe.transform(this.pieSearchForm.get('endDateBucket').value,'yyyy-MM-dd')
   let reqBody = {
     "projectId":this.projectId,
     "createdDate":startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
     "closedDate":endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
     }
   this.dataService.post(apis.dataByLineChart,reqBody).subscribe((res:any) => {
     this.lineChartData=[]
     this.lineChartLabels=[]
     this.lineChartLabels = res[0].dates

    res[0].data.forEach(x => {
      if(x.uxstatus === 'C')
         {
           const data = {
             data:x.count,
             label:'Created'
           }

           this.lineChartData.push(data)
         }
         if(x.uxstatus === 'R')
         {
           const data = {
             data:x.count,
             label:'Resolved'
           }

           this.lineChartData.push(data)
         }
         if(x.uxstatus === 'D')
         {
           const data = {
             data:x.count,
             label:'Deployed'
           }

           this.lineChartData.push(data)
         }
       });

    });





  //    res[0].forEach(element => {
  //      element.data.forEach(x => {
  //        if(x.uxstatus === 'c')
  //        {
  //          const data = {
  //            data:x.count,
  //            label:'Created'
  //          }
  //          this.lineChartLabels.push(element.dates)
  //          this.lineChartData.push(data)
  //        }
  //        if(x.uxstatus === 'R')
  //        {
  //          const data = {
  //            data:x.count,
  //            label:'Resolved'
  //          }
  //          this.lineChartLabels.push(element.dates)
  //          this.lineChartData.push(data)
  //        }
  //        if(x.uxstatus === 'D')
  //        {
  //          const data = {
  //            data:x.count,
  //            label:'Deployed'
  //          }
  //          this.lineChartLabels.push(element.dates)
  //          this.lineChartData.push(data)
  //        }
  //      });
  // });

  }

  ////////////////////////////////Update SM Records////////////////////////////////
  editSm(data) {
    this.route.navigate(['/dashboard/serviceUpdate', data])
  }

  /////////////////////////////////// Delete SM /////////////////////////////////

  deleteRow(id) {
    let dId = {
      id: id,
    }
    this.dataService.post(apis.deleteServiceManagement, dId).subscribe(res => {
      this.getBySearch()
      this.allSm.length === 1 ? this.pageNum = this.pageNum -1 : this.pageNum
    })
    this.getBySearch()
  }
  /////////////////////////BreadCrumbs/////////////////////////////////////////////
  gotoHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }

  details() {
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }


//line charts

lineChartLabels: Label[] = ['9/26/20', '9/26/20', '9/25/20']
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

 lineChartOptions: ChartOptions = {
legend: {
display: true,
labels: {
boxWidth: 6,
},
},
responsive: true,
title: {
display: true,
text: 'Number of Tickets',
position: 'left',
},
}

 lineChartColors: Color[] = [
{
borderColor: 'black',
backgroundColor: 'rgba(255,0,0,0.3)',
},
]
//  lineChartLegend = true
 lineChartType = 'line'
 lineChartPlugins = []
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
  listOfColumn = []
}
