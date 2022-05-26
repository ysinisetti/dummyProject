import { DatePipe } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { apis } from 'src/app/api';
import { DataService } from 'src/app/data.service';
interface ColumnItem {
  name: string
  width: string
}
@Component({
  selector: 'app-create-keys',
  templateUrl: './create-keys.component.html',
  styleUrls: ['./create-keys.component.scss'],
  providers: [DatePipe],
})

export class CreateKeysComponent implements OnInit {
  header = 'Search'
  practiceDropDown = []
  topicDropDown=[]
  topicId;
  topic=[]
  listOfColumns: ColumnItem[] = [
    {
      name: '#',
      width: '30px',
    },
    {
      name: 'Exam Key',
      width: '90px',
    },
    {
      name: 'Exam Name',
      width: '90px',
    },
    {
      name: 'No.Of Questions',
      width: '90px',
    },
    {
      name: 'Duration(Mins)',
      width: '90px',
    },
    {
      name: 'Created Date',
      width: '80px',
    },
    {
      name: 'CreatedBy',
      width: '90px',
    },

  ]
  searchForm: FormGroup;
  createKeysForm: FormGroup;
  KeysReportForm: FormGroup;
  pageNum: any;
  pageSize: any;
  listOfData: any = []
  createKeysVisible: boolean;
  records: any;
  totalPages: any;
  startDate: string;
  endDate: string;
  btnDisabled: boolean;
  id: number;
  dropdownDisabled: boolean=true;
  addTopicid: any;
  adddropdownDisabled: boolean=true;
  reportdropdownDisabled : boolean =true;
  generatetopicId: number;
  searchtopicId: number;

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
  if (event.key === 'Enter') {
  this.getKeysList()
  }
  }
  constructor(  private fb: FormBuilder, private datepipe: DatePipe,
    private dataService: DataService,  private notification: NzNotificationService,
    private route: Router) { }

  ngOnInit(): void {
    this.pageSize=10;
    this.pageNum=1;

    this.searchForm = this.fb.group({
      searchPractice: [null],
      searchTopic: [null],
      searchStartDate: [null],
      searchEndDate: [null],
    })
    this.createKeysForm = this.fb.group({
      practice: [null],
      topic: [null],
      questions: [null],
      duration: [null],
      minMarks: [null],
      keys:[null],
    })
    this.KeysReportForm = this.fb.group({
      reportPractice: [null],
      reportTopic: [null],
      createdDate: [null],
    })
    this.getPractice()
    this.getTopicValues()
    this.getKeysList()
  }

getPractice(){               // practice dropdown
  this.dataService.get(apis.practiceDropdown).subscribe((res: any) => {
    this.practiceDropDown = res
    console.log('practice dropdown', res)
  })
}
getTopics(id ) {     // topic drop down values based on practice (search)
 console.log( 'event reached', id)
  this.dataService.get(apis.topicDropdown + '/' + id).subscribe((res: any) => {
    this.topicDropDown = res
    console.log("topic dropdown",  this.topicDropDown);
    this.searchForm.controls.searchTopic.patchValue('');
    this.dropdownDisabled =false;
  })
}
getTopicId(id){        //  to know topic id value (search)
  console.log("type",typeof(id))
this.searchtopicId = id;
console.log("search topic id", this.searchtopicId);
}

reportgetTopics(id){        // topic drop down values based on practice ( generate report popup)
  console.log( 'event reached', id)
  this.dataService.get(apis.topicDropdown + '/' + id).subscribe((res: any) => {
    this.topicDropDown = res
    console.log("topic dropdown",  this.topicDropDown);
    this.KeysReportForm.controls.reportTopic.patchValue('');
    this.reportdropdownDisabled =false;
  })
}
addGetTopics(id){     // topic drop down values based on practice (add popup)
  console.log( 'event reached', id)
  this.addTopicid = id
  console.log("practice add topic id", this.addTopicid);
   this.dataService.get(apis.topicDropdown + '/' + id).subscribe((res: any) => {
     this.topicDropDown = res
    this.createKeysForm.controls.topic.patchValue('');
     this.adddropdownDisabled =false;
   })
}
addgetTopicId(id){            //  to know topic id value (add pop up)
  console.log("type",typeof(id))
  this.topicId = id;
  console.log("add topic id", this.topicId);
}
getTopicValues() {           // topic dropdown
  this.dataService.get(apis.topicDropdown).subscribe((res: any) => {
    this.topicDropDown = res
    this.topicDropDown.forEach(x=>{
      this.topic[x.id]=x.TopicName
      console.log("insideeeeeeeeeeeeeeee",x,this.topic)
    })
      console.log("topic dropdown",  this.topicDropDown,this.topic);
  })
}
reportgetTopicId(id){      //  to know topic id value (generate report pop up)
  console.log("type",typeof(id))
  this.generatetopicId = id;
  console.log("generate topic id", this.topicId);
}
  resetSearchFields() {          // reset search fields
    this.searchForm.reset()
    this.getKeysList()
    this.dropdownDisabled = true;
  }
getKeysList(){            // search and display keys list
  if (this.searchForm.get('searchStartDate').value) {
    this.startDate = new Date(this.searchForm.get('searchStartDate').value)
      .toISOString()
      .substring(0, 10)
  }
  if (this.searchForm.get('searchEndDate').value) {
    this.endDate = new Date(this.searchForm.get('searchEndDate').value)
      .toISOString()
      .substring(0, 10)
  }
 const reqBody= {
    "pageNum":this.pageNum,
    "pageSize":this.pageSize,
    "topicId": this.searchtopicId,
    "startDate": this.startDate === null || this.startDate === undefined ? '' : this.startDate,
    "endDate": this.endDate === null || this.endDate === undefined ? '' : this.endDate,
    "vKey":"",
}
console.log(reqBody)
this.dataService.post(apis.getKeyList, reqBody).subscribe(res => {
  console.log(res)
  this.listOfData = res[0].data
  this.records = res[0].count
  this.totalPages=this.records
  console.log('gridData', this.listOfData)
})
}
  addRow(): void {            // open create keys popup
   this.createKeysVisible=true;
   this.createKeysForm.reset()
  }
  addCancel(){                // close create keys popup
    this.createKeysVisible=false;
  }
 saveCreateKeys(){           // to add keys and display in grid
  if (this.createKeysForm.untouched){
    this.createKeysVisible = true
    this.submitAdd()
  }
 if (this.createKeysForm.valid ) {
  console.log(this.createKeysForm.value)
  const createdDate = this.datepipe.transform(
    new Date(),
    'yyyy-MM-dd',
  )
  let dataToAPI = {
    "duration": Number(this.createKeysForm.controls.duration.value),
    "topicId": this.topicId ,
    "createdDate": createdDate,
    "noOfQuestions": Number(this.createKeysForm.controls.questions.value),
    "createdBy": JSON.parse(sessionStorage.getItem('loginData')).LoginId,
    "modifiedDate": createdDate,
    "modifiedBy":JSON.parse(sessionStorage.getItem('loginData')).LoginId,
    "minMarks":Number(this.createKeysForm.controls.minMarks.value),
    "status": "Active",
    "noOfKeys":this.createKeysForm.controls.keys.value,
  }
  console.log('--->data to table', dataToAPI)
  this.dataService.postResource(apis.addKeys, dataToAPI).subscribe(res => {
    if (res.hasOwnProperty('success') === true) {
      this.getKeysList()
      this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
    } else {
      this.notification.create('error', 'Failed to add ', 'Your data is failed to add')
    }
  })
  this.createKeysVisible = false
}
  }
  generateExcels(){      //to generate excel report
    const topicId = this.KeysReportForm.get('reportTopic').value
    const date =  this.datepipe.transform( new Date(), 'yyyy-MM-dd')
    window.open(apis.generateExcel + '?' + 'topicid=' + topicId + '&' + 'date=' + date)
    this.KeysReportForm.reset()
  }

// pagination //
onCurrentPageDataChange(data) {
  this.pageNum = data
  this.getKeysList()
}
onPageSizeChange(data) {
  console.log('page size change', data)
  this.pageSize = data
  this.getKeysList()
}
gotoHome() {                    // home routing
  this.route.navigate(['/dashboard/allProjects'])
}
submitAdd() : void {             // to  restrict form based on validation
  for (const i in this.createKeysForm.controls){
    this.createKeysForm.controls[i].markAsTouched()
    this.createKeysForm.controls[i].updateValueAndValidity()
  }
}
}
