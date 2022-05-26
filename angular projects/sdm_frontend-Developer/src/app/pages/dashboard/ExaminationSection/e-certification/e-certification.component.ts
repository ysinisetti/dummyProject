import { filter } from 'rxjs/operators'
import { Component, ViewChild, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { DatePipe } from '@angular/common'
import * as moment from 'moment'

@Component({
  selector: 'app-e-certification',
  templateUrl: './e-certification.component.html',
  styleUrls: ['./e-certification.component.scss'],
  providers: [DatePipe],
})
export class ECertificationComponent implements OnInit {
  keyEnterform: FormGroup
  topicForm: FormGroup
  openKeyEnterForm: boolean
  Questionpage: boolean
  instructions: boolean
  startExamForm: boolean
  obtainedMarks: boolean
  examStatus: boolean
  showPrevButton: boolean
  showNextButton: boolean
  afterSubmitForm: boolean
  resultPage: boolean
  topicCard = true
  practice: any
  topic: any
  Colors = []
  ////////////Sample data********************
  remainingQuestion: number
  remainingTime: any
  questions: any
  i: number
  currentQuestionSet: any
  validatorkey: Object
  keyvalid: Object
  loginId = JSON.parse(sessionStorage.getItem('loginData')).Id
  practiceName: any
  topicName: any
  answers = []
  selectedOption: any
  minutes: any
  hours: any
  seconds: any
  domainName = JSON.parse(sessionStorage.getItem('loginData')).LoginId
  optionsList: any
  result: Object
  tick = 1000
  countDown: any
  numberOfQuestions: any
  minimumMarks: any
  quesnLength: any
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private datePipe: DatePipe,
  ) {}
  ngOnInit(): void {
    this.i = 0
    ///Practice DropDown
    this.dataService.get(apis.practiceDD).subscribe(res => {
      this.practice = res
    })
    this.topicForm = this.fb.group({
      practice: [null, [Validators.required]],
      topic: [null, [Validators.required]],
    })
    this.keyEnterform = this.fb.group({
      examKey: [null, [Validators.required]],
    })
  }
  selectTopic(event) {
    ///////select topic based on practice
    this.dataService.getAssetsById(apis.topic, event).subscribe(res => {
      this.topic = res
    })
  }
  afterEnterKey() {
    let reqBody = {
      validatorKey: this.keyEnterform.controls.examKey.value,
      topicName: this.topicForm.controls.topic.value,
    }
    this.dataService.post(apis.keyValidator, reqBody).subscribe(res => {
      this.validatorkey = res
    })
  }
  startExam() {
    if (this.topicForm.untouched) {
      this.submitAdd()
    } else if (this.topicForm.valid) {
      this.Questionpage = false
      this.openKeyEnterForm = true
    }
  }
  submitAdd() {
    /////////to validate the forms
    for (const i in this.topicForm.controls) {
      this.topicForm.controls[i].markAsTouched()
      this.topicForm.controls[i].updateValueAndValidity()
    }
    for (const j in this.keyEnterform.controls) {
      this.keyEnterform.controls[j].markAsTouched()
      this.keyEnterform.controls[j].updateValueAndValidity()
    }
  }
  enablePrevNextButtons() {
    //////////enable or disable next and previous buttons
    if (this.i === 0) {
      this.showPrevButton = false
    } else {
      this.showPrevButton = true
    }
    if (this.i === this.quesnLength - 1) {
      this.showNextButton = false
    } else {
      this.showNextButton = true
    }
  }
  submit() {
    this.afterSubmitForm = true
  }
  saveKey() {
    if (this.keyEnterform.untouched) {
      this.submitAdd()
    } else if (this.keyEnterform.valid) {
      const key = {
        validatorKey: this.keyEnterform.controls.examKey.value,
        topicId: this.topicForm.controls.topic.value,
      }
      this.dataService.post(apis.keyValidator, key).subscribe(res => {
        if (res.hasOwnProperty('Not Valid') === true) {
          this.openKeyEnterForm = true
          this.topicCard = true
          this.instructions = false
          this.notification.create('Invalid Key', 'Failed to Start Exam', 'Enter Valid Key')
        } else {
          console.log(res);

          this.keyvalid = res
          this.remainingTime = this.keyvalid['duration']
          this.instructions = true
          this.topicCard = false
          this.openKeyEnterForm = false
          this.instructions = true
          this.numberOfQuestions = this.keyvalid['noOfQuestions']
          this.minimumMarks = this.keyvalid['minMarks']
          this.practiceName = this.practice.filter(
            x => x.id === this.topicForm.controls.practice.value,
          )[0].DomainName
          this.topicName = this.topic.filter(
            x => x.id === this.topicForm.controls.topic.value,
          )[0].TopicName
        }
      })
    }
  }
  getTimeFromMins(mins) {
    ///////////timer functionality
    const num = mins
    let hours = num / 60
    let rhours = Math.floor(hours)
    let minutes = (hours - rhours) * 60
    let rminutes = Math.round(minutes)
    let result = `${rhours}:${rminutes}:00`
    return `${rhours}:${rminutes}:00`
  }
  timeCountDown() {
    let a = this.remainingTime.toString().split(':')
    this.seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
    // this.countDown = this.dataService.getCounter(this.tick).subscribe(() => {
    //   this.seconds--
    //   if (this.seconds === 0) {
    //     console.log(this.seconds)
    //     this.countDown.unsubscribe()
    //     this.submitExam()
    //   }
    // })
    console.log(this.seconds)
    console.log(this.countDown)
  }
  startExamFinal() {
    ////////////////instructions page start exam
    this.remainingTime = this.getTimeFromMins(this.remainingTime)
    this.timeCountDown()
    const key = this.keyEnterform.controls.examKey.value
    const domainId = this.topicForm.controls.practice.value
    const topicId = this.topicForm.controls.topic.value
    const createdDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    const questionCount = this.keyvalid['noOfQuestions']
    let reqBody = {
      empId: this.loginId,
      domainId: domainId === null || domainId === undefined ? '' : domainId,
      topicId: topicId === null || topicId === undefined ? '' : topicId,
      createdDate: createdDate === null || createdDate === undefined ? '' : createdDate,
      questionCount: questionCount === null || questionCount === undefined ? '' : questionCount,
      vkey: key === null || key === undefined ? '' : key,
    }
    this.dataService.post(apis.questions, reqBody).subscribe(res => {
      this.seconds--
      this.questions = res
      this.quesnLength = this.questions.length
      this.remainingQuestion = this.questions.length
      this.questions = this.questions.map(function(el, index) {
        var o = Object.assign({}, el)
        o.selectedOption = ''
        o.qNumber = index + 1
        o.isVisited = false
        return o
      })
      this.questions.forEach(element => {
        const initialValues = {
          id: element.id,
          empAnswer: 0,
          subTopicId: element.subTopicId,
        }
        this.answers.push(initialValues)
      })
      this.i = 0
      this.questions[this.i].isVisited = true
      this.currentQuestionSet = this.questions[this.i]
      this.optionsList = this.currentQuestionSet.options
      this.Colors[this.i] = 'red'
      this.minutes = this.keyvalid['duration']
    })
    this.instructions = false
    this.startExamForm = false
    this.topicCard = false
    this.topicForm.reset()
    this.Questionpage = true
    this.enablePrevNextButtons()
  }

  changeQuestion(event) {
    //////Redirect to specific question
    this.i = event
    this.questions[event].isVisited = true
    this.currentQuestionSet = this.questions[event]
    this.optionsList = this.currentQuestionSet.options
    this.enablePrevNextButtons()
  }
  next() {
    /////////next button
    this.i++
    this.enablePrevNextButtons()
    this.questions[this.i].isVisited = true
    this.currentQuestionSet = this.questions[this.i]
    this.optionsList = this.currentQuestionSet.options
  }
  previous() {
    ///////////previous button
    this.i--
    this.enablePrevNextButtons()
    this.questions[this.i].isVisited = true
    this.currentQuestionSet = this.questions[this.i]
    this.optionsList = this.currentQuestionSet.options
  }
  selectOption(data) {
    //////////selecting option for the question
    const dummy = []
    this.selectedOption = parseInt(data)
    const isExist = this.answers.filter(answer => answer.id === this.currentQuestionSet.id)
    if (isExist.length && this.answers.length) {
      this.answers.forEach(element => {
        if (element.id === this.currentQuestionSet.id) {
          element.empAnswer = this.selectedOption
        }
        if (element.empAnswer === 0) {
        } else {
          dummy.push(element.empAnswer)
          console.log(dummy);
        }
      })
    }
    console.log(this.answers, dummy)
    // this.answers.forEach(element => {
    //   console.log(element)
    //   if (element.empAnswer === 0) {
    //   } else {
    //     dummy.push(element)
    //   }
    // })
    this.remainingQuestion = this.questions.length - dummy.length
  }
  submitExam() {
    ////final submit method
    let reqBody = {
      empId: parseInt(this.loginId),
      examKeyId: this.keyvalid['validatorKey'],
      minMarks: parseInt(this.keyvalid['minMarks']),
      empDomainName: this.domainName,
      answers: this.answers,
    }
    console.log(reqBody);

    this.dataService.post(apis.submitAnswers, reqBody).subscribe(res => {
      this.result = res[0]
      console.log(this.result);
      this.obtainedMarks = this.result['MarksObtained']
      this.examStatus = this.result['Exam Status']
      this.afterSubmitForm = false
      this.Questionpage = false
      this.resultPage = true
      this.topicCard = true
    })
  }

  gotoHome() {
    ////////breadcrumbs
    this.router.navigate(['/dashboard/allProjects'])
  }

  Cancel() {
    this.openKeyEnterForm = false
    this.keyEnterform.reset()
    this.startExamForm = false
    this.afterSubmitForm = false
    this.resultPage = false
  }
}
