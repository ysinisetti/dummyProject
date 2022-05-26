import { Component, OnInit, HostListener } from '@angular/core';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { Router } from '@angular/router'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzButtonSize } from 'ng-zorro-antd/button';

interface ColumnItem {
  name: string
  width: string

}

@Component({
  selector: 'app-review-exam',
  templateUrl: './review-exam.component.html',
  styleUrls: ['./review-exam.component.scss']
})
export class ReviewExamComponent implements OnInit {
  // ---------------- Holds Page Number To Get Data Of Specified Page ---------------------------------------
  pageNum: number = 1;
  // ----------------- Holds Page Size To Display The Required No Of Records Per Page ----------------------------------------
  pageSize: number = 10;

  size: NzButtonSize = 'large';
  record: any;
  totalPages: number = 20;
  Data: any;
  // ------------------------- Holds Length Of The Questions Array -----------------------------
  length: number;
  correctAnswer: any;
  // ------------------------ PerForms On Load Data Fetching Method On Pressing Enter ------------------------
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getTable(), (this.pageNum = 1)
    }
  }

// ------------------------------ Holds Column Titles ------------------------------------------
  listOfColumns: ColumnItem[] = [
    {
      name: '#',
      width: '60px',
    },
    {
      name: 'Candidate Name',
      width: '100px',
    },
    {
      name: 'Exam Name',
      width: '90px',
    },
    {
      name: 'Date Taken',
      width: '90px',
    },
    {
      name: 'Total Questions',
      width: '100px',
    },
    {
      name: 'Attempted Questions',
      width: '100px',
    },
    {
      name: 'Marks',
      width: '80px',
    },
    {
      name: 'Percentage(%)',
      width: '120px',
    },
    {
      name: 'Status',
      width: '80px',
    },
    {
      name: 'Review',
      width: '100px',
    },
  ]
// --------------------------- Holds Index Of The Current Question Reviewed -----------------------------
  currentIndex: number = 0
  // -------------------------- Holds The Question List Data Fetched OnLoad ----------------------
  quizlist = [];
  // --------------------------- Holds The Options Of A Specific Indexed Quesiton ------------------
  options = [];
  // --------------------------- Holds Current Quesiton ---------------------
  question
  // ---------------------------- Used To Disable Next Button --------------------------------
  subBTn: boolean;
  // --------------------------- Holds The Option Selected By The User --------------------------
  selectedOption: any;
  // -------------------------- Used To Search An Exam To Be Reviewed --------------------------------------
  resultSearchForm: FormGroup;
  // --------------------------- Alters The View Between ExamsGrid and Exam Review -------------------------------
  changeView: boolean = false;
  // ---------------------------------- Holds Question Number Of Current Question -----------------------
  qno: number = 1;
  // ------------------- Holds Candidate Answer --------------------------------------------------
  answer: string
  // ------------------------------------ Holds Explanation Of A Specific Question --------------------
  Explanation: string
  // ----------------------------------- Holds OnLoad Data --------------------------------------
  tableData: Object;

  constructor(private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private notification: NzNotificationService,) { }

  ngOnInit(): void {
    this.resultSearchForm = this.fb.group({
      examName: [null],
      Status: [null],
      SubmittedDate: [null]
    })

    this.getTable()
  }

  // -------------------------------- Fetches Data OnLoad ------------------------------------------- 

  getTable() {
    const examName = this.resultSearchForm.controls.examName.value
    const dateSubmitted = this.resultSearchForm.controls.SubmittedDate.value
    const examStatus = this.resultSearchForm.controls.Status.value

    const requestBody = {

      examName: examName === null || examName === undefined ? '' : examName,
      dateSubmitted: dateSubmitted === null || dateSubmitted === undefined ? '' : dateSubmitted,
      examStatus: examStatus === null || examStatus === undefined ? '' : examStatus,
      pageSize: this.pageSize,
      pageNum: this.pageNum

    }
    this.dataService.post(apis.getResults, requestBody).subscribe(res => {
      this.tableData = res[0].data
      this.record = res[0].count
      this.totalPages = res[0].count
      console.log('count.....', this.record)


    })
  }
// -------------------------------------- Used To Reset The Search Form ------------------------------------
  reset() {
    this.resultSearchForm.reset()
    this.getTable()
  }
// --------------------------------- On Change In Page Number, Corresponiding Data Is Retrivied From The BackEnd ---------------------------------------------

  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getTable()
  }
  // -------------------------------- On Page Size Change, Changes The No Of Records Per Page ---------------------
  onPageSizeChange(data) {
    this.pageSize = data
    this.getTable()
  }


//-------------------- Bread Crumb Navigation ---------------------------------
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  // --------------------- Moves To Next Question --------------------------
  next() {
    ++this.currentIndex;
    ++this.qno
    this.question = this.quizlist[this.currentIndex].question
    this.options = this.quizlist[this.currentIndex].options
    this.answer = this.quizlist[this.currentIndex].candidateAnswer
    this.correctAnswer = this.quizlist[this.currentIndex].answerOption
    this.Explanation = this.quizlist[this.currentIndex].explanation
    if (this.currentIndex === this.length - 1) {
      this.subBTn = true
      return
    }
  }

  // -------------------- Switches To Previous Question ---------------------------

  previous() {
    this.subBTn = false
    --this.currentIndex;
    --this.qno
    this.question = this.quizlist[this.currentIndex].question
    this.options = this.quizlist[this.currentIndex].options
    this.answer = this.quizlist[this.currentIndex].candidateAnswer
    this.correctAnswer = this.quizlist[this.currentIndex].answerOption
    this.Explanation = this.quizlist[this.currentIndex].explanation

  }

  // --------------- Changes The View Between Grid And Exam Review --------------------------------------

  uiChange(empId, examName) {
    this.changeView = !this.changeView
    this.questionDisplay(empId, examName)

  }

  // --------------------------- To Fetch Data When An Exam Is Clicked --------------------------------
  questionDisplay(empId, examName) {
    const requestBody =
    {

      "examName": examName,
      "empId": empId

    }
    console.log('.........', requestBody)
    this.dataService.post(apis.ExamReview, requestBody).subscribe((res: any) => {
      this.quizlist = res
      this.length = this.quizlist.length
      this.question = this.quizlist[this.currentIndex].question
      this.options = this.quizlist[this.currentIndex].options
      this.answer = this.quizlist[this.currentIndex].candidateAnswer
      this.correctAnswer = this.quizlist[this.currentIndex].answerOption
      console.log('c', this.quizlist)
    })

  }

  // --------------------- Changes Question On Pressing A Specific Question ---------------------------------
  onQuestionChange(id) {
    this.currentIndex = id
    this.qno = id + 1
    this.question = this.quizlist[this.currentIndex].question
    this.options = this.quizlist[this.currentIndex].options
    this.answer = this.quizlist[this.currentIndex].candidateAnswer
    this.correctAnswer = this.quizlist[this.currentIndex].answerOption
    this.Explanation = this.quizlist[this.currentIndex].explanation
    if (this.currentIndex === this.length - 1) {
      this.subBTn = true
      return
    }
    this.subBTn = false
  }
}
