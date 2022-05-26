import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { apis } from 'src/app/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartOptions, ChartDataSets } from 'chart.js'
import { Label } from 'ng2-charts'
import { Color } from 'ng2-charts'
@Component({
  selector: 'app-myreviews',
  templateUrl: './myreviews.component.html',
  styleUrls: ['./myreviews.component.scss']
})
export class MyreviewsComponent implements OnInit {

  header = 'Individual Reviews'
  logData: any;
  Image: any;
  rating: FormGroup;
  loginName: any;
  resourceInfo: any;
  Name: any;
  projectType: any;
  scope: any;
  individualRating: any;
  technical: any;
  arr: any;
  star5: Number;
  star4: Number;
  star3: Number;
  star2: Number;
  star1: Number;
  analytical: any;
  testing: any;
  communication: any;
  documentation: any;
  ratingResponse: any;
  overAllRatingValue: any;
  analytic: number;
  technic: number;
  communicate: number;
  document: number;
  test: number;
  Role: any;
  techarray: { label: string; value: any; }[];

  constructor(private router: Router, private dataService: DataService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.logData = JSON.parse(sessionStorage.getItem('loginData'))
    this.Image = this.logData === null || this.logData === undefined ? '' : this.logData.Image
    this.loginName = JSON.parse(sessionStorage.getItem('loginData')).LoginId
    this.rating = this.fb.group({
      average: [null],
      technical1: [null],
      communication1: [null],
      analytical1: [null],
      documentation1: [null],
      testing1: [null],
      ratingsoverall: [null]
    })
    //Request Body
    const resourcename = this.loginName
    const data = {
      resourceName: resourcename === null || resourcename === undefined ? '' : resourcename,
    }
    //Getting resource information
    this.dataService.getSubprojects(apis.getResourceInfo, data).subscribe((res: any) => {
      this.resourceInfo = res
      this.Name = res.name
      this.Role = res.rolePlayed
      this.projectType = res.projectType
      this.scope = res.scope
      console.log('resourceInfo', res)
    })
    //Getting individual ratings and reviews
    this.dataService.getSubprojects(apis.getIndividualRating, data).subscribe((res: any) => {
      this.individualRating = res
    })
    //Getting Technical bar
    this.dataService.getSubprojects(apis.getTechnical, data).subscribe((res: any) => {
      this.technical = res
      console.log(res)
      let star5
      for (let i = 0; i <= this.technical.length; i++) {
        console.log(this.technical[i].count+'\n')
        if (this.technical[i].technical == '5 Star') {
          star5 = this.technical[i].count
        }
        else if (this.technical[i].technical == '4 Star') {
          this.star4 = this.technical[i].count
        }
        else if (this.technical[i].technical == '3 Star') {
          this.star3 = this.technical[i].count
        }
        else if (this.technical[i].technical == '2 Star') {
          this.star2 = this.technical[i].count
        }
        else if (this.technical[i].technical == '1 Star') {
          this.star1 = this.technical[i].count
        }
      }
      console.log(star5)
      this.techarray = [
        { label:'5 Star',value:this.star5 },{ label:'4 Star',value:this.star4 },{ label:'3 Star',value:this.star3 },
        { label:'2 Star',value:this.star2 },{ label:'1 Star',value:this.star1 },
      ]
    
  
      console.log(this.techarray)
    })
    //Getting Analytical bar
    this.dataService.getSubprojects(apis.getAnalytical, data).subscribe((res: any) => {
      this.analytical = res
      console.log('analytical', res)
    })
    //Getting Testing bar
    this.dataService.getSubprojects(apis.getTesting, data).subscribe((res: any) => {
      this.testing = res
      console.log('testing', res)
    })
    //Getting Communication bar
    this.dataService.getSubprojects(apis.getCommunication, data).subscribe((res: any) => {
      this.communication = res
      console.log('communication', res)
    })
    //Getting Documentation bar
    this.dataService.getSubprojects(apis.getDocumentation, data).subscribe((res: any) => {
      this.documentation = res
      console.log('documentation', res)
    })
    //Getting overall rating
    this.getOverallRating()
  }
  //Routing to project list
  proj() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  //Routing to project details
  dashboard() {
    this.router.navigate(['/dashboard/projectDetails/ProjectName'])
  }
  //Getting Overall Rating service
  getOverallRating() {
    console.log('loginid', this.loginName)
    const resourcename = this.loginName
    const data = {
      resourceName: resourcename === null || resourcename === undefined ? '' : resourcename,
    }

    this.dataService.getSubprojects(apis.getOverallRating, data).subscribe((res: any) => {
      this.ratingResponse = res
      this.overAllRatingValue = Math.floor(res.overallratings)
      console.log(this.ratingResponse)
      this.analytic = Math.floor(this.ratingResponse.analytical)
      this.technic = Math.floor(this.ratingResponse.technical)
      this.communicate = Math.floor(this.ratingResponse.communication)
      this.document = Math.floor(this.ratingResponse.documentation)
      this.test = Math.floor(this.ratingResponse.testing)
      this.rating.controls.ratingsoverall.patchValue(this.ratingResponse.overallratings)
    })
  }
  //Array of line chart
  lineChartLabels: Label[] = ['9/26/20', '9/27/20', '9/28/20']
  lineChartLegend = true
  lineChartData: ChartDataSets[] = [
    {
      data: [1, 2, 3, 2, 5, 10, 9, 2, 5, 5],
      label: 'Technical',
      backgroundColor: ['rgba(213, 137, 93, 0.6)'],
      fill: false,
    },
    {
      data: [4, 9, 1, 1, 6, 3, 9, 1, 8, 1],
      label: 'Analytical',
      backgroundColor: ['rgba(213, 93, 169, 0.6)'],
      fill: false,
    },
    {
      data: [3, 6, 1, 9, 4, 7, 1, 0, 3, 1],
      label: 'Communication',
      backgroundColor: ['rgba(55, 154, 160, 0.56)'],
      fill: false,
    },
    {
      data: [0, 2, 3, 2, 5, 8, 7, 2, 5, 0],
      label: 'Documentation',
      backgroundColor: ['rgba(213, 137, 93, 0.6)'],
      fill: false,
    },
    {
      data: [2, 2, 3, 2, 5, 10, 9, 2, 5, 3],
      label: 'Testing',
      backgroundColor: ['rgba(152, 227, 53, 1)'],
      fill: false,
    },
  ]

  lineChartOptions: ChartOptions = {
    legend: {
      display: true,
      labels: {
        boxWidth: 15,
      },
    },
    responsive: true,
    title: {
      display: true,
      text: 'Values',
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



  formatOne = (percent: number) => `${percent} `;
  formatTwo = () => `Done`;

  //Role Drop down
  role = {
    A: "UxDesigner",
    B: "UxDeveloperAngular",
    C: "UxDashboardsReports",
    D: "UxMenuSecurity",
    E: "UxQualityEngineer",
    F: "UxChatBots",
    G: "BxIntegrator",
    H: "BxTLDeveloper",
    I: "BxFilesWebSocketsS3Excel",
    J: "BxMQStreams",
    k: "BxAleertsEmailPdfLogs",
    L: "BxDotNet",
    M: "BxNodeJs",
    N: "BxDB",
    O: "BxScheduler",
    P: "BxAPIGateway",
    Q: "UxVisualAnalytics",
    R: "IxDevOps",
    S: "IxCloud",
    T: "IxSecurity",
    U: "IxNetworks",
    V: "IxDataScientist",
    X: "SAP Basis",
    Y: "SAP ABAP",
    Z: "SAP Functional",
    // SAP PI/PO,

    a1: "HR Manager",
    b1: "Management",
    c1: "ProjectManager",
    d: "Sales",
    e1: "Recruiter",
    f1: "Marketing",
    g1: "Finance",
    h1: "Immigration"


  }


}
