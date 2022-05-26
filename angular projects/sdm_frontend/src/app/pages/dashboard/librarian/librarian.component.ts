import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { Router } from '@angular/router'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import { HostListener } from '@angular/core'

@Component({
  selector: 'app-librarian',
  templateUrl: './librarian.component.html',
  styleUrls: ['./librarian.component.scss'],
  providers: [DatePipe],
})
export class LibrarianComponent implements OnInit {
  pageNum: number
  pageSize: number
  totalPages: number
  gridData: any
  librarianForm: FormGroup
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
    this.librarianForm = this.fb.group({
      assetTitle: [null],
      skillSet: [null],
      assetType: [null],
      author: [null],
    })
  }
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  resetLibarian() {}
  searchLibrarian() {}
  clickOnAdd() {
    this.router.navigate(['/dashboard/LibrarianAssectDetails'])
  }
  editIssue() {}
  onPageSizeChange(evnt) {
    console.log(evnt)
  }
  onCurrentPageDataChange(evnt) {
    console.log(evnt)
  }
  downloadFile() {}
}
