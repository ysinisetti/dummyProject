import { Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
  dropDownList = []
  allIssues = []
  pageNum: any
  pageSize: any
  totalPages: any
  listOfColumn = [
    {
      title: 'Name',
      compare: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name),
    },
    {
      title: 'Chinese Score',
      compare: (a: DataItem, b: DataItem) => a.chinese - b.chinese,
      priority: 3,
    },
    {
      title: 'Math Score',
      compare: (a: DataItem, b: DataItem) => a.math - b.math,
      priority: 3,
    },
    {
      title: 'English Score',
      compare: (a: DataItem, b: DataItem) => a.english - b.english,
      // priority: 3
    },
  ]
  listOfData: DataItem[] = [
    {
      name: 'John Brown',
      chinese: 98,
      math: 60,
      english: 70,
    },
    {
      name: 'Jim Green',
      chinese: 98,
      math: 66,
      english: 89,
    },
    {
      name: 'Joe Black',
      chinese: 98,
      math: 90,
      english: 70,
    },
    {
      name: 'Jim Red',
      chinese: 88,
      math: 99,
      english: 89,
    },
  ]
  courseForm: FormGroup
  ProjectName: any
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName

    this.courseForm = this.fb.group({
      courseNo: [null],
      title: [null],
      type: [null],
      skillSet: [null],
      duration: [null],
      lastModified: [null],
      author: [null],
    })
  }
  editIssue() {}
  onCurrentPageDataChange(evnt) {
    console.log(evnt)
  }
  onPageSizeChange(evnt) {
    console.log(evnt)
  }

  //////////////BreadCrumb/////////////
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }

  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
interface DataItem {
  name: string
  chinese: number
  math: number
  english: number
}
