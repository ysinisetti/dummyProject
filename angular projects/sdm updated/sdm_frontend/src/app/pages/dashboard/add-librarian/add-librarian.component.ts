import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { Router } from '@angular/router'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import { HostListener } from '@angular/core'
@Component({
  selector: 'app-add-librarian',
  templateUrl: './add-librarian.component.html',
  styleUrls: ['./add-librarian.component.scss'],
  providers: [DatePipe],
})
export class AddLibrarianComponent implements OnInit {
  pageNum: number
  pageSize: number
  totalPages: number
  gridData: any
  libraryAssectForm: FormGroup
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
    this.libraryAssectForm = this.fb.group({
      skillSet: [null],
      assetTitle: [null],
      assetType: [null],
      author: [null],
      status: [null],
      description: [null],
    })
  }
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }

  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  resetLibaryAssectDetails() {
    this.libraryAssectForm.reset()
  }
  searchLibraryAssectDetails() {}
  clickOnAdd() {
    this.router.navigate(['/dashboard/LibrarianAssectDetails'])
  }
  editIssue() {}
  deleteRow() {}
  onPageSizeChange(evnt) {
    console.log(evnt)
  }
  onCurrentPageDataChange(evnt) {
    console.log(evnt)
  }
}
