import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { apis } from 'src/app/api';
import { DataService } from 'src/app/data.service';
import { Router } from '@angular/router'
import { NzNotificationService } from 'ng-zorro-antd/notification'


@Component({
  selector: 'app-editenablement',
  templateUrl: './editenablement.component.html',
  styleUrls: ['./editenablement.component.scss']
})
export class EditenablementComponent implements OnInit {

  editForm: FormGroup
  pageNum: any
  pageSize: any
  totalPages: any
  skillsetList = []
  courseDownLists = []
  addResponse: any;
  cusName: any;
  data: any;

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router, private notification: NzNotificationService) {
  }

  ngOnInit(): void {
    this.pageSize = 5
    this.pageNum = 1
    this.totalPages = 10
    console.log(JSON.parse(sessionStorage.getItem('editdata')))
    this.data = JSON.parse(sessionStorage.getItem('editdata'))
    this.dataService.get(apis.skillsetdrop).subscribe(res => {
      this.skillsetList = res;
      console.log('skillset drop down', this.skillsetList);
    })

    this.dataService.get(apis.coursedrop).subscribe(res => {
      this.courseDownLists = res;
      console.log('course drop down', this.courseDownLists);
    })
    this.editForm = this.fb.group({
      courseNo: [null],
      title: [null],
      type: [null],
      skillSet: [null],
      Date: [null],
      createdby: [null],
    })
    this.editForm.get('courseNo').patchValue(this.data.cNo)
    this.editForm.get('title').patchValue(this.data.cTitle)
    this.editForm.get('type').patchValue(this.data.uxCourseType)
    this.editForm.get('skillSet').patchValue(this.data.skillSet)
    this.editForm.get('Date').patchValue(this.data.createdDate)
    this.editForm.get('createdby').patchValue(this.data.createdBy)
  }

  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }

  resets() {
    this.editForm.reset()

  }

  save() {


    let body = {
      "id": this.data.id,
      "estimatedTime": 120,
      "createdBy": this.editForm.get('createdby').value,
      "author": "John",
      "skillSet": this.editForm.get('skillSet').value,
      "modifiedDate": this.editForm.get('Date').value,
      "description": "description",
      "cTitle": this.editForm.get('title').value,
      "modifiedBy": "jahnavi",
      "cNo": this.editForm.get('courseNo').value,
      "uxRoleType": "S",
      "uxCourseType": this.editForm.get('type').value,
      "crsReferences": "Edition"
    }

    console.log('Insert data', body)
    this.dataService.post(apis.uploadenablemnt, body).subscribe((res: any) => {
      console.log('update res.........', res)
      this.addResponse = res
      console.log('updated.........', res)


      if (this.addResponse.hasOwnProperty('success') === true) {
        this.notification.create(
          'success',
          'Successfully Updated',
          'Your data has been successfully Updated',
        )
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
      }

    })
  }
}
