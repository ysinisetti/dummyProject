import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Component, OnInit, HostListener } from '@angular/core'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-author-sub-topic',
  templateUrl: './author-sub-topic.component.html',
  styleUrls: ['./author-sub-topic.component.scss'],
  providers: [DatePipe],
})
export class AuthorSubTopicComponent implements OnInit {
  header = 'Search'
  allAuthors: any
  allSubTopics: any
  authorForm: FormGroup
  subTopicForm: FormGroup
  editSTForm: FormGroup
  selectedList = JSON.parse(sessionStorage.getItem('ExamList'))
  loggedUserId = JSON.parse(sessionStorage.getItem('loginData')).LoginId
  topicName = this.selectedList.topicName
  practiceName = this.selectedList.domainName
  listOfResources: any
  status: any
  openEditSTForm: boolean
  stId: any
  @HostListener('window:keydown', ['$event'])
  keyboardInput1(event: any) {
    if (event.key === 'Enter') {
      this.getAllSubTopics()
      this.getAllAuthors()
    }
  }
  constructor(
    private router: Router,
    private dataService: DataService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {}
  ngOnInit(): void {

    ////Resources dropDown

    this.dataService.get(apis.getResources).subscribe((res: any) => {
      this.listOfResources = res
    })

    /////////Status DropDown

    this.dataService.get(apis.statusDropDown).subscribe(res => {
      this.status = res
    })

    this.authorForm = this.fb.group({
      author: [null,[Validators.required]],
    })
    this.subTopicForm = this.fb.group({
      subTopic: [null,[Validators.required]],
    })
    this.editSTForm = this.fb.group({
      subTopic: [null],
      status: [null],
    })
    this.getAllAuthors()
    this.getAllSubTopics()
  }

 ////////////////////////////get all the Existing authors //////////////

  getAllAuthors() {
    let reqBody = {
      topicId: this.selectedList.topicId,
    }
    this.dataService.post(apis.getAllAuthors, reqBody).subscribe(res => {
      this.allAuthors = res
    })
  }

  ////////////////////////// Add a Author ////////////////

  addAuthor() {
    if (this.authorForm.untouched) {
      this.submitAdd()
    }
    else if(this.authorForm.valid){
    let reqBody = {
      topicId: this.selectedList.topicId,
      createdBy: this.loggedUserId,
      createdDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      authorId: this.authorForm.controls.author.value,
      status: 'Active',
    }
    this.dataService.post(apis.PostAuthor, reqBody).subscribe(res => {
      this.getAllAuthors()
    })
    this.authorForm.reset()
  }
}

///////////////////////// Delete a Author ////////////////////////////////

  deleteAuthor(id) {
    let reqBody = {
      id: id,
    }
    this.dataService.post(apis.deleteAuthor, reqBody).subscribe(res => {
      this.getAllAuthors()
    })
  }

/////////////////////////// To get All the subTopic values //////////////

  getAllSubTopics() {
    let reqBody = {
      topicId: this.selectedList.topicId,
    }
    this.dataService.post(apis.getSubtopics, reqBody).subscribe(res => {
      this.allSubTopics = res
      console.log(this.allSubTopics);
    })
  }

  ///////////////////// To add a New SubTopic ///////////////////////////

  addSubTopic() {
    console.log(this.subTopicForm.controls.subTopic.value);
    if (this.subTopicForm.untouched) {
      this.submitAdd()
    }
    else if(this.subTopicForm.valid){
    let reqBody = {
      topicId: this.selectedList.topicId,
      subTopicName: this.subTopicForm.controls.subTopic.value,
      status: 'Active',
    }
    console.log(reqBody);

    this.dataService.post(apis.postSubTopic, reqBody).subscribe(res => {
      this.getAllSubTopics()
      this.subTopicForm.reset()
    })
  }
}
  ////////////////////////Validating a Form ///////////////////////////

  submitAdd() {
    for (const i in this.subTopicForm.controls) {
      this.subTopicForm.controls[i].markAsTouched()
      this.subTopicForm.controls[i].updateValueAndValidity()
    }
    for (const j in this.authorForm.controls) {
      this.authorForm.controls[j].markAsTouched()
      this.authorForm.controls[j].updateValueAndValidity()
    }
  }

 /////////////////patch the subtopic Form Values

  editST(data) {
    this.openEditSTForm = true
    this.stId = data.id
    this.editSTForm.get('subTopic').patchValue(data.subTopicName)
    this.editSTForm
      .get('status')
      .patchValue(
        data.status === null || data.status === '' || data.status === undefined
          ? null
          : this.status.filter(x => x.Value === data.status)[0].Value,
      )
  }

///////////////////////////////Update a SubTopic //////////////

  modifyST() {
    let reqBody = {
      topicId: this.selectedList.topicId,
      subTopicName: this.editSTForm.controls.subTopic.value,
      status: this.editSTForm.controls.status.value,
      id: this.stId,
    }
    this.dataService.post(apis.updateSubTopic, reqBody).subscribe(res => {
      this.getAllSubTopics()
    })
    this.openEditSTForm = false
  }

  /////////////////// Delete a Subtopic ///////////////////////

  deleteST(id) {
    let reqBody = {
      id: id,
    }
    this.dataService.post(apis.deleteSubTopic, reqBody).subscribe(res => {
      this.getAllSubTopics()
    })
  }
  ////////////////////// Navigate to Home /////////////
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }
    cancel() {
    this.openEditSTForm = false
    this.editSTForm.reset()
  }
}
