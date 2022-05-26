import { DataService } from 'src/app/data.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzMessageService } from 'ng-zorro-antd/message'
import { Component, OnInit, HostListener } from '@angular/core'
import { apis } from 'src/app/api'

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss'],
})
export class ExamListComponent implements OnInit {
  header = 'Search'
  searchExamListForm: FormGroup
  addEditExamListForm: FormGroup
  openAddEditForm: boolean
  records: any
  allExams: any
  pageSize = 5
  pageNum = 1
  totalPages: any
  title
  icon
  btnLabel
  status: any
  type: any
  allDomain: any
  endPoint: string
  loginId = JSON.parse(sessionStorage.getItem('loginData')).LoginId
  newPractice: { Label: HTMLInputElement; Value: string }
  topicId: any
  selectedDomain: any
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.allExamsList()
      this.pageNum = 1
    }
  }
  // listOfItem = ['jack', 'lucy']
  index = 0
  // addItem(input: HTMLInputElement): void {
  //   const value = input.value
  //   if (this.listOfItem.indexOf(value) === -1) {
  //     this.listOfItem = [...this.listOfItem, input.value || `New item ${this.index++}`]
  //   }
  // }
  constructor(private router: Router, private fb: FormBuilder, private dataService: DataService, private notification: NzNotificationService) { }
  ngOnInit(): void {

    ///////////////StatusDropdown//////////

    this.dataService.get(apis.statusDropDown).subscribe(res => {
      this.status = res
    })
    this.searchExamListForm = this.fb.group({
      practiceName: [null, Validators.required],
      topicName: [null, Validators.required,],
    })
    this.addEditExamListForm = this.fb.group({
      practiceName: [null,Validators.required],
      topicName: [null,Validators.required],
      status: [null,Validators.required],
    })
    this.allExamsList()
    this.getAllDomains()
  }

  submitAdd() {                                                       /////////to validate the forms
    for (const i in this.addEditExamListForm.controls) {
      this.addEditExamListForm.controls[i].markAsTouched()
      this.addEditExamListForm.controls[i].updateValueAndValidity()
    }
  }

  //////////////To get the exising domains

  getAllDomains() {
    this.dataService.get(apis.domainNames).subscribe((res: any) => {
      this.allDomain = res
    })
  }

  //////////////To add a new domain in exiting dropdown

  addDomain(input: HTMLInputElement): void {
    this.newPractice = { Label: input, Value: '' }
    var nobj = [...this.allDomain, this.newPractice]
    this.allDomain = nobj
    let reqBody = { "domainName": this.newPractice.Label }
    this.dataService.post(apis.newDomainDropdown, reqBody).subscribe((res) => {
      this.getAllDomains()
    })
  }

  ///////////////////// To get all the Topics and Searching ///////////////
  allExamsList() {
    const domainName = this.searchExamListForm.controls.practiceName.value
    const topicName = this.searchExamListForm.controls.topicName.value
    let reqBody = {
      topicName: topicName === null || topicName === undefined ? '' : topicName,
      domainName: domainName === null || domainName === undefined ? '' : domainName,
      pagenum: this.pageNum,
      pagesize: this.pageSize,
    }
    this.dataService.post(apis.getExamList, reqBody).subscribe(res => {
      this.allExams = res[0].data
      this.totalPages = res[0].count
    })
  }
  addOrEdit(data, type) {
    this.type = type
    this.openAddEditForm = true
    if (this.type === 'A') {
      this.title = 'Add Topic';
      this.btnLabel = 'Save';
      this.icon = 'save';
      this.endPoint = apis.postExamList
      this.addEditExamListForm.enable()
    } else if (this.type === 'E') {
      this.topicId = data.topicId
      this.title = 'Edit Topic';
      this.btnLabel = 'Update';
      this.icon = 'edit';
      this.endPoint = apis.updateExamList
      console.log(this.allDomain);
      console.log(data.domainId);
      console.log(this.allDomain.filter(x => x.Value === data.domainId)[0].Label);
      this.addEditExamListForm.get('practiceName').patchValue(
        data.domainId === null || data.domainId === '' || data.domainId === undefined ? null : this.allDomain.filter(x => x.Value === data.domainId)[0].Label)
      this.addEditExamListForm.get('topicName').patchValue(data.topicName)
      this.addEditExamListForm.get('status').patchValue(data.topicStatus === null || data.topicStatus === '' || data.topicStatus === undefined
        ? null : this.status.filter(x => x.Value === data.topicStatus)[0].Value)
    }
  }

  //////////////////////// To Add or Update a  Topic //////////////////////////

  addOrUpdateList() {
    if (this.addEditExamListForm.untouched) {
      this.submitAdd()
    }
    else if(this.addEditExamListForm.valid){
    this.selectedDomain = this.addEditExamListForm.controls.practiceName.value
    if (this.type === "A") {
      let addReqBody = {
        "status": this.addEditExamListForm.controls.status.value,
        "topicName": this.addEditExamListForm.controls.topicName.value,
        "id": this.selectedDomain.Value,
        "createdBy": this.loginId
      }
      this.dataService.post(apis.addTopic, addReqBody).subscribe(res => {
        this.allExamsList()
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
        }
      })
    }
    else if (this.type === "E") {
      let editReqBody = {
        status: this.addEditExamListForm.controls.status.value,
        id: this.topicId,
        modifiedBy: this.loginId
      }
      this.dataService.post(apis.updateTopic, editReqBody).subscribe(res => {
        this.allExamsList()
        if (res.hasOwnProperty('success') === true) {
          this.notification.create('success', 'Successfully Updated', 'Record Updated successfully')
          this.router.navigate(['/dashboard/defects'])
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to update')
        }
      })
    }
    this.openAddEditForm = false
    this.addEditExamListForm.reset()
  }
}

  ////////////////////Navigate to authors or questions page /////////////////

  GoTo(data, type) {
    sessionStorage.setItem('ExamList', JSON.stringify(data))
    if (type === 'A') {
      this.router.navigate(['/dashboard/author-SubTopic'])
    } else if (type === 'Q') {
      this.router.navigate(['/dashboard/questions'])
    }
  }

  //////////////////////////Pagination///////////////////////

  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.allExamsList()
  }
  onPageSizeChange(data) {
    this.pageSize = data
    this.pageNum = 1
    this.allExamsList()
  }

  ////////////////////Breadcrumb navigation//////////////////

  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }

  cancel() {
    this.addEditExamListForm.reset()
    this.searchExamListForm.reset()
    this.allExamsList()
    this.openAddEditForm = false
  }
}
