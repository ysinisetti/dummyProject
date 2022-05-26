import { DataService } from 'src/app/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { apis } from 'src/app/api';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  searchQuestionForm: FormGroup
  addEditQuestionForm: FormGroup
  header = 'Search';
  allQuestions: any;
  pageNum = 1
  totalPages: any
  pageSize = 5
  status: any;
  subTopics: any
  type: any;
  openAddEditForm: boolean
  selectedList = JSON.parse(sessionStorage.getItem('ExamList'))
  loggedUserId = JSON.parse(sessionStorage.getItem('loginData')).LoginId
  title: string;
  btnLabel: string;
  icon: string;
  endPoint: string;
  selectedId: any;
  constructor(private router: Router, private fb: FormBuilder, private dataService: DataService) { }
  ngOnInit(): void {

    //////////Status Dropdown

    this.dataService.get(apis.statusDropDown).subscribe(res => {
      this.status = res
    })

    ///////////subTopicsDropDown

    this.dataService.getAssetsById(apis.getSubTopics, this.selectedList.topicId).subscribe((res) => {
      this.subTopics = res
    })

    this.searchQuestionForm = this.fb.group({
      question: [null],
      createdBy: [null],
      subTopic: [null],
    })
    this.addEditQuestionForm = this.fb.group({
      subTopic: [null,[Validators.required]],
      question: [null, [Validators.required]],
      option1: [null, [Validators.required]],
      option2: [null, [Validators.required]],
      option3: [null, [Validators.required]],
      option4: [null, [Validators.required]],
      answer: [null, [Validators.required]],
      description: [null],
      status: [null]
    })
    this.getAllQuestions();
  }


  //////////////////To get all the existing Questions ///////////////

  getAllQuestions() {
    const question = this.searchQuestionForm.controls.question.value;
    const createdBy = this.searchQuestionForm.controls.createdBy.value;
    const subTopicId = this.searchQuestionForm.controls.subTopic.value;
    let reqBody = {
      "pageNum": this.pageNum,
      "pageSize": this.pageSize,
      "subTopicId": subTopicId === null || subTopicId === undefined ? '' : subTopicId,
      "createdBy": createdBy === null || createdBy === undefined ? '' : createdBy,
      "question": question === null || question === undefined ? '' : question,
    }
    this.dataService.post(apis.getAllQuestions, reqBody).subscribe((res) => {
      this.allQuestions = res[0].data;
      this.totalPages = res[0].count;
    })
  }

  //////////////////?To patch the values to form field ///////////

  addOrEdit(data, type) {
    this.type = type;
    this.selectedId = data.id
    this.openAddEditForm = true
    if (this.type === 'A') {
      this.title = "Add";
      this.btnLabel = "Save";
      this.icon = "save";
      this.openAddEditForm = true
    }
    else if (this.type === 'E') {
      console.log(data);

      console.log(this.subTopics);
      console.log(data.subTopicId);
      console.log(this.status);
      console.log(data.status);

      this.title = "Edit";
      this.btnLabel = "Update";
      this.icon = "edit";
      this.addEditQuestionForm.get('question').patchValue(data.question)
      this.addEditQuestionForm.get('option1').patchValue(data.option1)
      this.addEditQuestionForm.get('option2').patchValue(data.option2)
      this.addEditQuestionForm.get('option3').patchValue(data.option3)
      this.addEditQuestionForm.get('option4').patchValue(data.option4)
      this.addEditQuestionForm.get('answer').patchValue(data.answerOption)
      this.addEditQuestionForm.get('description').patchValue(data.explanation)
      this.addEditQuestionForm.get('status').patchValue(data.status === null || data.status === '' || data.status === undefined ? null : this.status.filter(x => x.Value === data.status)[0].Value)
      this.addEditQuestionForm.get('subTopic').patchValue(data.subTopicId === null || data.subTopicId === '' || data.subTopicId === undefined ? null : this.subTopics.filter(x => x.Value === data.subTopicId)[0].Value)
      this.openAddEditForm = true
    }
  }

  ////////////////////////Addor update a question /////////////

  saveOrModify() {
    if (this.addEditQuestionForm.untouched) {
      this.submitAdd()
    }
    else if(this.addEditQuestionForm.valid){
    if (this.type === 'A') {
      let reqBody = {
        "subTopicId": this.addEditQuestionForm.controls.subTopic.value,
        "question": this.addEditQuestionForm.controls.question.value,
        "explanation": this.addEditQuestionForm.controls.description.value,
        "topicId": this.selectedList.topicId,
        "createdBy": this.loggedUserId,
        "option1": this.addEditQuestionForm.controls.option1.value,
        "option2": this.addEditQuestionForm.controls.option2.value,
        "option3": this.addEditQuestionForm.controls.option3.value,
        "option4": this.addEditQuestionForm.controls.option4.value,
        "answerOption": this.addEditQuestionForm.controls.answer.value,
        "status": this.addEditQuestionForm.controls.status.value
      }
      this.dataService.post(apis.postQuestion, reqBody).subscribe((res) => {
        this.getAllQuestions();
      })
    }
    else if (this.type === 'E') {
      let reqBody = {
        "subTopicId": this.addEditQuestionForm.controls.subTopic.value,
        "question": this.addEditQuestionForm.controls.question.value,
        "explanation": this.addEditQuestionForm.controls.description.value,
        "topicId": this.selectedList.topicId,
        "option1": this.addEditQuestionForm.controls.option1.value,
        "option2": this.addEditQuestionForm.controls.option2.value,
        "option3": this.addEditQuestionForm.controls.option3.value,
        "option4": this.addEditQuestionForm.controls.option4.value,
        "answerOption": this.addEditQuestionForm.controls.answer.value,
        "status": this.addEditQuestionForm.controls.status.value,
        "modifiedBy": this.loggedUserId,
        "id": this.selectedId,
      }
      console.log(reqBody);

      this.dataService.post(apis.updateQuestion, reqBody).subscribe((res) => {
        this.getAllQuestions();
      })
    }
    this.openAddEditForm = false
    this.addEditQuestionForm.reset()
  }
}

  /////////////////////////////////// Delete a Question //////////////////

  deleteQuestion(id) {
    let reqBody = {
      "id": id
    }
    this.dataService.post(apis.deleteQuestion, reqBody).subscribe((res) => {
      this.getAllQuestions();
    })
  }

  ////////////////////////Validating a Form ///////////////////////////

  submitAdd() {
    for (const i in this.addEditQuestionForm.controls) {
      this.addEditQuestionForm.controls[i].markAsTouched()
      this.addEditQuestionForm.controls[i].updateValueAndValidity()
    }
  }

  ///////////////////// Pagination ///////////////////////

  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllQuestions()
  }
  onPageSizeChange(data) {
    this.pageSize = data
    this.pageNum = 1
    this.getAllQuestions()
  }

  ////////////////////Navigate to Home /////////////////

  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  cancel() {
    this.getAllQuestions()
    this.addEditQuestionForm.reset()
    this.openAddEditForm = false
    this.searchQuestionForm.reset()
  }

}

