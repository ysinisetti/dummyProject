import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { Router, provideRoutes } from '@angular/router'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import { HostListener } from '@angular/core'
import { DatePipe } from '@angular/common'

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
  dropDown = []
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      // this.getBySearch(),
      this.pageNum = 1
    }
  }
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private datePipe: DatePipe,
  ) {}
  ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
  projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
  ngOnInit(): void {
    this.pageSize = 5
    this.pageNum = 1
    this.totalPages = 10
    this.enabelementForm = this.fb.group({
      title: [null],
      skillSet: [null],
      courseType: [null],
      courseNo: [null],
      startDate: [null],
      endDate: [null],
    })
  }
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }

  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  reset() {}
  Search() {}
  clickOnAdd() {
    this.router.navigate(['/dashboard/courseDetails'])
  }
  editIssue() {}
  onPageSizeChange(evnt) {
    console.log(evnt)
  }
  onCurrentPageDataChange(evnt) {
    console.log(evnt)
  }
}
