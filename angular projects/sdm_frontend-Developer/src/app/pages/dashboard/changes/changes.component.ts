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
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip,} from 'ng2-charts'
import { Color } from 'ng2-charts'
@Component({
  selector: 'app-changes',
  templateUrl: './changes.component.html',
  styleUrls: ['./changes.component.scss'],
  providers: [DatePipe],
})
export class ChangesComponent implements OnInit {
   //dashboards///
   public pieChartOptions = this.createOptions('Total Ticket Count grouped by Bucket')
   public pieChartOptions1 = this.createOptions('Total Ticket Count Grouped by Resources')
   public pieChartOptions2 = this.createOptions('Total Ticket Count Grouped by Status')
   public pieChartOptions3 = this.createOptions('Total Ticket Count Grouped by Priority')
   public pieChartOptions4 = this.createOptions('Total Ticket Count Grouped by Severity')
   public pieChartOptions5 = this.createOptions('Total Ticket Count Grouped by Category')
   public pieChartOptions6 = this.createOptions('Total Ticket Count Grouped by Component')
  statusDropDown: any[]
  priorityDropDown: any[]
  bucketDropDown: any[]
  resolutionDropDown: any[]
  severityDropDown: any[]
  changeTypeDropDown: any[]
  allChanges: any
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
   public pieChartType: ChartType = 'pie'
   public pieChartLegend = true
   public pieChartPlugins = []

   pageNum=1
   pageSize=5
   totalPages: number
   type: any
   size: NzSelectSizeType = 'default'
   dashboardForm:FormGroup
   header = 'Search'
   customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
   ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
   projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
   private notification: NzNotificationService
   searchForm: FormGroup
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
    this.getPriorities()
     monkeyPatchChartJsTooltip()
     monkeyPatchChartJsLegend()
     this.dataService.get(apis.issueDropDown).subscribe((res: any) => {
       const data = res
       const IAType = []
       const IBType = []
       const IsType = []
       const ITType = []
       const ICType = []
       const IPType = []
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
         } else if (element.optionType === 'IP') {
           IPType.push(element)
         }
       })
       this.status = IsType
       this.statusDropDown = IsType
       this.priorityDropDown = IPType
       this.bucketDropDown = IBType
       this.severityDropDown = SIType
       this.resolutionDropDown = IRType
       this.changeTypeDropDown = ICType
     })
   }
   ngOnInit(): void {
     this.totalPages = 10
     this.dashboardForm = this.fb.group({
      startDate: [new Date(new Date().setDate(new Date().getDate() - 30))],
      endDate: [new Date()],
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
    this.dataService.getIssuesById(apis.allResources, this.projectId).subscribe((res: any) => {
      this.listOfResources = res
      this.listOfResources.forEach(x => {
        children.push({ label: x.resourceName, value: x.resourceName })
      })
      this.listOfResources = children
    })
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
   groupedByBucket() {
    const startDateBucket = this.datePipe.transform(
      this.dashboardForm.get('startDate').value,
      'yyyy-MM-dd',
    )
    const endDateBucket = this.datePipe.transform(
      this.dashboardForm.get('endDate').value,
      'yyyy-MM-dd',
    )
    let reqBody = {
      projectId: this.projectId,
      createdDate: startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
      closedDate: endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,

    }
    this.dataService.post(apis.dataBucket, reqBody).subscribe((res: any) => {
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
  groupedByStatus() {
    const startDateStatus = this.datePipe.transform(
      this.dashboardForm.get('startDate').value,
      'yyyy-MM-dd',
    )
    const endDateStatus = this.datePipe.transform(
      this.dashboardForm.get('endDate').value,
      'yyyy-MM-dd',
    )
    let reqBody = {
      projectId: this.projectId,
      createdDate: startDateStatus === null || startDateStatus === undefined ? '' : startDateStatus,
      closedDate: endDateStatus === null || endDateStatus === undefined ? '' : endDateStatus,
    }
    this.dataService.post(apis. dataStatus, reqBody).subscribe((res: any) => {
      this.pieChartData1 = []
      this.pieChartLabel1 = []
      res.forEach(element => {
        this.pieChartData1.push(element.count)
        this.pieChartLabel1.push(
          this.statusDropDown.filter(x => x.optionKey === element.uxStatus)[0].optionValue,
        )
      })
    })
  }
  groupedByPriority() {
    const startDatePriority = this.datePipe.transform(
      this.dashboardForm.get('startDate').value,
      'yyyy-MM-dd',
    )
    const endDatePriority = this.datePipe.transform(
      this.dashboardForm.get('endDate').value,
      'yyyy-MM-dd',
    )
    let reqBody = {
      projectId: this.projectId,
      createdDate:
        startDatePriority === null || startDatePriority === undefined ? '' : startDatePriority,
      closedDate: endDatePriority === null || endDatePriority === undefined ? '' : endDatePriority,
    }
    this.dataService.post(apis.datapPiority, reqBody).subscribe((res: any) => {
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
  groupedBySeverity(){
  const startDateSeverity = this.datePipe.transform(this.dashboardForm.get('startDate').value,'yyyy-MM-dd')
  const endDateSeverity = this.datePipe.transform(this.dashboardForm.get('endDate').value,'yyyy-MM-dd')
  let reqBody = {
    "projectId":this.projectId,
    "createdDate":startDateSeverity === null || startDateSeverity === undefined ? '' : startDateSeverity,
    "closedDate":endDateSeverity === null || endDateSeverity === undefined ? '' : endDateSeverity,
    }
  this.dataService.post(apis.dataSeverity,reqBody).subscribe((res:any) => {
    this.pieChartData3=[]
    this.pieChartLabel3=[]
    res.forEach(element => {
      this.pieChartData3.push(element.count)
      this.pieChartLabel3.push(this.severityDropDown.filter(x=>x.optionKey === element.uxSeverity)[0].optionValue)
    });
    });
  }
  groupedByChangeType(){
  const startDateCategory = this.datePipe.transform(this.dashboardForm.get('startDate').value,'yyyy-MM-dd')
  const endDateCategory = this.datePipe.transform(this.dashboardForm.get('endDate').value,'yyyy-MM-dd')
  let reqBody = {
    "projectId":this.projectId,
    "createdDate":startDateCategory === null || startDateCategory === undefined ? '' : startDateCategory,
    "closedDate":endDateCategory === null || endDateCategory === undefined ? '' : endDateCategory,
    }
  this.dataService.post(apis. dataType,reqBody).subscribe((res:any) => {
    this.pieChartData4=[]
    this.pieChartLabel4=[]
    res.forEach(element => {
      this.pieChartData4.push(element.count)
      this.pieChartLabel4.push(this.changeTypeDropDown.filter(x=>x.optionKey === element.uxType)[0].optionValue)

    });
    });
  }
  groupedByResolution(){
  const startDateComponent = this.datePipe.transform(this.dashboardForm.get('startDate').value,'yyyy-MM-dd')
  const endDateComponent = this.datePipe.transform(this.dashboardForm.get('endDate').value,'yyyy-MM-dd')
  let reqBody = {
    "projectId":this.projectId,
    "createdDate":startDateComponent === null || startDateComponent === undefined ? '' : startDateComponent,
    "closedDate":endDateComponent === null || endDateComponent === undefined ? '' : endDateComponent,
    }
  this.dataService.post(apis.dataResolution,reqBody).subscribe((res:any) => {
    this.pieChartData6=[]
    this.pieChartLabel6=[]
    res.forEach(element => {
      this.pieChartData6.push(element.count)
      this.pieChartLabel6.push(this.resolutionDropDown.filter(x=>x.optionKey === element.UxResolution)[0].optionValue)
    });
    });
  }
  dataByLinChart(){
  const startDateBucket = this.datePipe.transform(this.dashboardForm.get('startDate').value,'yyyy-MM-dd')
  const endDateBucket = this.datePipe.transform(this.dashboardForm.get('endDate').value,'yyyy-MM-dd')
  let reqBody = {
  "projectId":this.projectId,
  "createdDate":startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
  "closedDate":endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
  }
  this.dataService.post(apis.dataLineChart,reqBody).subscribe((res:any) => {
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
      pageNum: this.pageNum,
      pageSize: this.pageSize,
       projectId: this.projectId,
       title: title === null || title === undefined ? '' : title,
       uxStatus: status === null || status === undefined ? '' : status,
       uxPriority: priority === null || priority === undefined ? '' : priority,
       closedDate: closeDate === null || closeDate === undefined ? '' : closeDate,
       createdDate: creatDate === null || creatDate === undefined ? '' : creatDate,
       assignedTo: assignTo === null || assignTo === undefined ? '' : assignTo,
       createdBy: createBy === null || createBy === undefined ? '' : createBy,
     }
     this.dataService.post(apis.getChanges, reqBody).subscribe(res => {
       this.totalPages = res[0].count
       this.allChanges = res[0].data
       this.records = res[0].count
     })
     this.groupedByBucket()
    this. groupedByStatus()
    this.groupedByPriority()
    this.groupedBySeverity()
    this.groupedByChangeType()
   this.groupedByResolution()
   this.dataByLinChart()
   }
   reset() {
     this.searchForm.reset()
     this.getBySearch()
   }
   getPriorities(){
    this.dataService.get(apis.issuesPriority).subscribe((res)=>{
    this.priority=res
    })
   }
   addUpdateScreen() {
    this.route.navigate(['/dashboard/addChanges'])
  }
   editIssue(id) {
     this.route.navigate(['/dashboard/updateChanges', id])
   }
   deleteRow(id) {
     let dId = {
       "id": id,
     }
     this.dataService.post(apis.deleteChanges, dId).subscribe(res => {
       this.getBySearch()
       this.allChanges.length === 1 ? this.pageNum = this.pageNum -1 : this.pageNum
       if (res.hasOwnProperty('Result') === true) {
         setTimeout(() => {
           this.notification.create('success', 'Successfully Deleted', 'Record Deleted successfully')
         }, 1000)
       } else {
         this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
       }
       this.getBySearch()
     })
   }

   onPageSizeChange(data) {
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

   public barChartType = 'bar'
   public barChartPlugins = []
   public barChartLabels: Label[] = ['9/26/20', '9/25/20', '9/24/20']
   public barChartLegend = true
   public barChartData: ChartDataSets[] = [
     { data: [45, 37, 60], label: 'Estimated' },
     { data: [10, 66, 96], label: 'Aavailable' },
     { data: [100, 12, 20], label: 'Cosumed' },
   ]
 }
