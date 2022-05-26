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
 ThemeService,
} from 'ng2-charts'
import { Color } from 'ng2-charts'



@Component({
 selector: 'app-defects',
 templateUrl: './defects.component.html',
 styleUrls: ['./defects.component.scss'],
 providers: [DatePipe],
})
export class DefectsComponent implements OnInit {
 listOfData:any;

 //dashboards///
  pieChartOptions = this.createOptions('Total Ticket Count grouped by Bucket')
  pieChartOptions1 = this.createOptions('Total Ticket Count Grouped by Resources')
  pieChartOptions2 = this.createOptions('Total Ticket Count Grouped by Status')
  pieChartOptions3 = this.createOptions('Total Ticket Count Grouped by Priority')
  pieChartOptions4 = this.createOptions('Total Ticket Count Grouped by Severity')
  pieChartOptions5 = this.createOptions('Total Ticket Count Grouped by Category')
  pieChartOptions6 = this.createOptions('Total Ticket Count Grouped by Component')
  issueTypeDropDown: any[]
  severityDropDown: any[]
  bucketDropDown: any[]
  resulationTypeDropDown: any[]
  categoryDropDown: any[]
  typeDropDown: any[]
  lineCharts: any[]
  lineChartData1: any

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

  pieChartLabel = [ 'Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel1 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel2 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel3 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel4 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel5 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartLabel6 = ['Under Review ', 'Planned', 'In Progress', 'Completed']
  pieChartData = [ 40, 30, 10, 20]
  pieChartData1 = [40, 30, 10, 20]
  pieChartData2 = [40, 30, 10, 20]
  pieChartData3 = [40, 30, 10, 20]
  pieChartData4 = [40, 30, 10, 20]
  pieChartData5 = [40, 30, 10, 20]
  pieChartData6 = [40, 30, 10, 20]
  pieChartType: ChartType = 'pie'
  pieChartLegend = true
  pieChartPlugins = []

 searchTerm
 pageNum=1
 pageSize=5
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
 dashboardForm:FormGroup
 searchForm: FormGroup
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
 this.issueTypeDropDown = ITType
 this.severityDropDown = SIType
 this.bucketDropDown = IBType
 this.categoryDropDown = ICType
 this.resulationTypeDropDown = IRType
 this.status = IsType
this.typeDropDown=IAType
 })
 }
 ngOnInit(): void {
   /////////////////Priority Dropdown
  this.dataService.get(apis.issuesPriority).subscribe((res)=>{
    this.priority=res
    })
  ////////////Severity DropDown
  this.dataService.get(apis.issuesSeverity).subscribe((res)=>{
    this.severity=res;
    })
 this.totalPages = 10
 this.dashboardForm=this.fb.group({
  startDateBucket: [new Date(new Date().setDate(new Date().getDate() - 30))],
  endDateBucket: [new Date()]
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
groupedByBucket(){
  const startDateBucket = this.datePipe.transform(this.dashboardForm.get('startDateBucket').value,'yyyy-MM-dd')
  const endDateBucket = this.datePipe.transform(this.dashboardForm.get('endDateBucket').value,'yyyy-MM-dd')
  let reqBody = {
    "projectId":this.projectId,
    "createdDate":startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
    "closedDate":endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
  this.dataService.post(apis.pieChartData,reqBody).subscribe((res:any) => {
    this.pieChartLabel=[]
    this.pieChartData=[]
    res.forEach(element => {
      this.pieChartData.push(element.count)
      this.pieChartLabel.push(this.bucketDropDown.filter(x=>x.optionKey === element.UxBucket)[0].optionValue )
    });

    });
 }
groupedByStatus(){
  const startDateBucket = this.datePipe.transform(this.dashboardForm.get('startDateBucket').value,'yyyy-MM-dd')
  const endDateBucket = this.datePipe.transform(this.dashboardForm.get('endDateBucket').value,'yyyy-MM-dd')
  let reqBody = {
    "projectId":this.projectId,
    "createdDate":startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
    "closedDate":endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
  this.dataService.post(apis.pieChartData2,reqBody).subscribe((res:any) => {
     this.pieChartData2=[]
     this.pieChartLabel2=[]
     res.forEach(element => {
       this.pieChartData2.push(element.count)
       this.pieChartLabel2.push(this.status.filter(x=>x.optionKey === element.uxStatus)[0].optionValue)
     });
     });
 }
groupedByPriority(){
  const startDateBucket = this.datePipe.transform(this.dashboardForm.get('startDateBucket').value,'yyyy-MM-dd')
  const endDateBucket = this.datePipe.transform(this.dashboardForm.get('endDateBucket').value,'yyyy-MM-dd')
  let reqBody = {
    "projectId":this.projectId,
    "createdDate":startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
    "closedDate":endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
  this.dataService.post(apis.pieChartData3,reqBody).subscribe((res:any) => {
    this.pieChartData3=[]
    this.pieChartLabel3=[]
     res.forEach(element => {
       this.pieChartData3.push(element.count)
       this.pieChartLabel3.push(this.priority.filter(x=>x.optionKey === element.uxPriority)[0].optionValue)
     });
     });
 }
groupedBySeverity(){
  const startDateBucket = this.datePipe.transform(this.dashboardForm.get('startDateBucket').value,'yyyy-MM-dd')
  const endDateBucket = this.datePipe.transform(this.dashboardForm.get('endDateBucket').value,'yyyy-MM-dd')
  let reqBody = {
    "projectId":this.projectId,
    "createdDate":startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
    "closedDate":endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
  this.dataService.post(apis.pieChartData4,reqBody).subscribe((res:any) => {
    this.pieChartData4=[]
    this.pieChartLabel4=[]
    res.forEach(element => {
      this.pieChartData4.push(element.count)
      this.pieChartLabel4.push(this.severityDropDown.filter(x=>x.optionKey === element.uxSeverity)[0].optionValue)
    });
    });
 }
groupedByCategory(){
  const startDateBucket = this.datePipe.transform(this.dashboardForm.get('startDateBucket').value,'yyyy-MM-dd')
  const endDateBucket = this.datePipe.transform(this.dashboardForm.get('endDateBucket').value,'yyyy-MM-dd')
  let reqBody = {
    "projectId":this.projectId,
    "createdDate":startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
    "closedDate":endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
  this.dataService.post(apis.pieChartData5,reqBody).subscribe((res:any) => {
    this.pieChartData5=[]
    this.pieChartLabel5=[]
    res.forEach(element => {
      this.pieChartData5.push(element.count)
      this.pieChartLabel5.push(this.categoryDropDown.filter(x=>x.optionKey === element.UxCategory)[0].optionValue)

    });
    });
 }
 groupedByComponent(){
  const startDateBucket = this.datePipe.transform(this.dashboardForm.get('startDateBucket').value,'yyyy-MM-dd')
  const endDateBucket = this.datePipe.transform(this.dashboardForm.get('endDateBucket').value,'yyyy-MM-dd')
  let reqBody = {
    "projectId":this.projectId,
    "createdDate":startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
    "closedDate":endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    }
  this.dataService.post(apis.pieChartData6,reqBody).subscribe((res:any) => {
    this.pieChartData6=[]
    this.pieChartLabel6=[]
    res.forEach(element => {
      this.pieChartData6.push(element.count)
      // this.pieChartLabel6.push(this.resulationTypeDropDown.filter(x=>x.optionKey === element.uxType)[0].optionValue)

    });
    });
 }
 groupedByLineChart(){
  const startDateBucket = this.datePipe.transform(this.dashboardForm.get('startDateBucket').value,'yyyy-MM-dd')
  const endDateBucket = this.datePipe.transform(this.dashboardForm.get('endDateBucket').value,'yyyy-MM-dd')
  let reqBody ={
    "closedDate":endDateBucket === null || endDateBucket === undefined ? '' : endDateBucket,
    "createdDate":startDateBucket === null || startDateBucket === undefined ? '' : startDateBucket,
    "projectId":this.projectId,
}
   this.dataService.post(apis.linecharts,reqBody).subscribe((res:any)=>{
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

 //////////////////////////DropDowns///////////////////////////////

 tStatus = {
  A: 'Assigned',
  I: 'In progress',
  R: 'Resolved',
  F: 'Closed',
  E: 'Estimated',
  D : 'Deployed',
  C: 'Created',
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
 this.dataService.post(apis.getIssues, reqBody).subscribe(res => {
 this.allIssues = res[0].data
 this.listOfData = res[0].data
 this.records = res[0].count
 this.totalPages = res[0].count
 })
 this.groupedByBucket()
 this.groupedByPriority()
 this.groupedByStatus()
 this.groupedBySeverity()
 this.groupedByCategory()
 this.groupedByComponent()
this.groupedByLineChart()
 }

  ////////////Redirect to add Defect Form /////////////

 addDefect() {
  this.route.navigate(['/dashboard/addIssues'])
  }

 ////////////Redirect to edit Defect Form /////////////

 editIssue(id) {
 this.route.navigate(['/dashboard/updateIssues', id])
 }

 //////////Delete a defect /////////////////

 deleteRow(id) {
 let dId = {
 id: id,
 }
 this.dataService.post(apis.deleteIssues, dId).subscribe(res => {
 this.getBySearch()
 this.listOfData.length === 1 ? this.pageNum = this.pageNum -1 : this.pageNum
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


 reset() {
  this.searchForm.reset()
  this.getBySearch()
  }
 //////////////Pagination/////////////

 onPageSizeChange(data) {
 this.pageSize = data
 this.getBySearch()
 }
 onCurrentPageDataChange(data) {
 this.pageNum = data
 this.getBySearch()
 }

 //////////////////////Breadcrumb//////////////////
 gotoHome() {
 this.route.navigate(['/dashboard/allProjects'])
 }
 details() {
 this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
 }

 /////////////////////// Line charts

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
  lineChartType = 'line'
  lineChartPlugins = []

 //bar charts

  barChartOptions: ChartOptions = {
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
  barChartType = 'bar'
  barChartPlugins = []
  barChartLabels: Label[] = ['9/26/20', '9/25/20', '9/24/20']
  barChartLegend = true
  barChartData: ChartDataSets[] = [
 { data: [45, 37, 60], label: 'Estimated' },
 { data: [10, 66, 96], label: 'Aavailable' },
 { data: [100, 12, 20], label: 'Cosumed' },
 ]
}
















// interface DataItem{
//   assignedDate: string
//   uxCategory: string
//   closedBy: string
//   components: string
//   references: string
//   environments: string
//   description: string
//   consumedTime: number
//   title: string
//   assignedTo: string
//   releaseId: number
//   uxType: string
//   rootCause: string
//   deployedDate: string
//   modifiedBy: string
//   id: number
//   uxSeverity: string
//   resolvedDate: string
//   uxPriority: string
//   estimatedTime: number
//   uxApproval: string
//   targetDate: string
//   deployedBy: string
//   fixedVersions: string
//   labels: string
//   createdDate: string
//   closedDate: string
//   createdBy: string
//   percentageComplete: number
//   modifiedDate: string
//   uxResolution: string
//   uxBucket: string
//   resolutionNote: string
//   affectedVersions: string
//   projectId: number
//   uxStatus: string
//   taskId: number
//  }
