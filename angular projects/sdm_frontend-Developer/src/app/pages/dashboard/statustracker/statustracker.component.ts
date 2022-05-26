import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators} from '@angular/forms'
import { Router } from '@angular/router'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { DatePipe } from '@angular/common'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
interface ColumnItem {
  name: string
  width: string
  }
@Component({
  selector: 'app-statustracker',
  templateUrl: './statustracker.component.html',
  styleUrls: ['./statustracker.component.scss'],
  providers: [DatePipe],
})
export class StatustrackerComponent implements OnInit {
  searchForm: FormGroup
  addForm: FormGroup
  editForm: FormGroup
  addpopupForm:FormGroup
  listOfData: any = []
  statusTypeDropDown = []
  objectTypeDropDown = []
  records: any
  pageNum: Number
  pageSize: Number
  totalPages: Number
  Addpopup: boolean
  Editpopup: boolean
  data: any
  addResponse: any
  deleteResponse: Object
  status = []
    id: any
  day: string
  btnDisabled: boolean
  listOfColumns: ColumnItem[] = [
    {name: '#', width: '20px', },
    {name: 'Created Date', width: '60px', },
    { name: 'StatusReport Date', width: '80px', },
    {name: 'Title', width: '100px', },
    {name: 'Status', width: '60px', }, 
    { name: 'Action', width: '60px', },
    ]
  Addstatus: boolean
  goback: boolean
  reportdate: any
  editReportData: any
  deltId: number
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private route: Router,
    private datePipe: DatePipe,
  ) { }
  header = 'Search'
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      sDate: [null],
      eDate:[null],
    })
    this.addpopupForm = this.fb.group({
      pDate: [null],
    })
    this.addForm = this.fb.group({
      cDate: [null],
      sDate: [null],
      title: [null, [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],],
      sType: [null, [Validators.required]],
      oType: [null, [Validators.required]],
      description: [null, [Validators.maxLength(255)]],
    })
    this.editForm = this.fb.group({
      cDate: [null],
      sDate: [null],
      title: [null, [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],],
      sType: [null, [Validators.required]],
      oType: [null, [Validators.required]],
      description: [null, [Validators.maxLength(255)]],
    })
    let date = new Date();
    date.setDate(date.getDate() - 1);
    console.log(date.toString());
    this.day=date.toString()
    console.log(this.day);
     // <------StatusType DropDown------->
    this.dataService.get(apis.statusTypeDropdown).subscribe((res: any) => {
      this.statusTypeDropDown = res
      this.statusTypeDropDown.forEach(x=>{
          this.status[x.Value]=x.Label
          })     
      console.log('statusTypeDropDown', this.statusTypeDropDown, this.status)
    })
// <------objectType dropdown ------->
    this.dataService.get(apis.objectTypeDropdown).subscribe((res: any) => {
      this.objectTypeDropDown = res
      console.log('objectTypeDropDown', this.objectTypeDropDown)
    })
    this.pageNum = 1
    this.pageSize = 10
    this.totalPages = 20
    this.getAllData();
  }
// <------Navigate to Status Report screen------->
  Addreport(data) {
    sessionStorage.setItem('statusReportDate',JSON.stringify(data.statusReportDate))
    sessionStorage.setItem('id',JSON.stringify(data.id))
    this.route.navigate(['dashboard/statusreport/'])
  }
   // <------Routing to All projects------->
  dashboard() {
    this.route.navigate(['/dashboard/allProjects'])
  }
 // <------Date Validation------->
  disabledStartDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0
  }
  disabledEndDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0
  }
   // <------Reset Method------->
  reset() {
    this.searchForm.reset()
    this.getAllData()
  }
   // <-----Table data and serach integration------->
  getAllData() {
    const sDate =this.datePipe.transform(this.searchForm.get('sDate').value,'yyyy-MM-dd', )
      const eDate =this.datePipe.transform(this.searchForm.get('eDate').value, 'yyyy-MM-dd',)
    const data = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      contactId: 1,
      objectType:
        "C",
        startDate: sDate === null || sDate === undefined ? this.datePipe.transform(this.reportdate, 'yyyy-MM-dd') :sDate,
      endDate:eDate === null || eDate === undefined ? '': new Date(eDate).toISOString().substring(0, 10),
      createdDate:sDate != null || sDate!=undefined||eDate != null || 
      eDate!=undefined || this.reportdate != null || this.reportdate != undefined ? '':
       this.datePipe.transform(this.day, 'yyyy-MM-dd') ,
    }
    console.log('-----------', data)
    this.dataService.post(apis.statusreport, data).subscribe((res: any) => {
      console.log('-----------', res)
      if(this.reportdate)
      {
        this.editReportData = res[0].data
        this.reportdate = null
        console.log(this.editReportData)
        this.patchReportData()
        return
      }
      this.listOfData = res[0].data
      this.records = res[0].count
      this.totalPages = res[0].count
    })
  }
 // <------Edit patch Value in Add pop up------->
  patchReportData(){
console.log(this.statusTypeDropDown.filter( x => x.Value === (this.editReportData[0].statusReportStatus)))
this.editForm.controls.cDate.patchValue(this.editReportData[0].createdDate)
this.editForm.controls.sDate.patchValue(this.editReportData[0].statusReportDate)
this.editForm.controls.title.patchValue(this.editReportData[0].title)
this.editForm.controls.sType.patchValue(this.statusTypeDropDown.filter( x => x.Value === this.editReportData[0].statusReportStatus)[0].Value);
this.editForm.controls.oType.patchValue(this.editReportData[0].ObjectType);
this.editForm.controls.description.patchValue(this.editReportData[0].description);
 }
//<------Pagination------->
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllData()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.pageNum = 1
    this.getAllData()
  }
   // <------Delete Table Row------->
  deleteRow(id: number): void {
    this.deltId=id
    console.log('delete iddd', this.deltId)
    const body = {
      id: id,
    }
    console.log('delete body', id, body)
    this.dataService.post(apis.statustrackerDelete, body).subscribe(res => {
      console.log('delete statu tracker', res)
      this.deleteResponse = res
      if (this.deleteResponse.hasOwnProperty('Result') === true) {
        this.notification.create(
          'success',
          'Successfully Deleted',
          'Your data has been successfully deleted',
        )
      } else {
        this.notification.create('error', 'Failed to delete', 'Data is not deleted ')
      }
      this.getAllData()
    })
    this.listOfData = this.listOfData.filter(d => d.id !== id)
  }
 // <------Add Popup Method------->
  addRow(): void {
    this.Addstatus = true
    this.addpopupForm.controls.pDate.patchValue(new Date);
  }
// <------Go Method in To checkstatus popup------->
  go(){
    this.Editpopup = true
    this.goback=false
  }
  // <------cancel Method in To checkstatus popup------->
  Addbackcancel(){
    this.goback=false
  }
 // <------proceed  Method in To AddstatusTracker popup------->
    proceed() {
    const data = {
      statusReportDate:this.addpopupForm.value.pDate,
      }
      console.log('-----------', data)
      this.dataService.post(apis.statuspopup, data).subscribe((res: any) => {
        console.log('-----------', res)
        if (res.Blocked){
          this.reportdate=data.statusReportDate
          this.goback=true
          this.Addstatus = false
          this.getAllData()
        }
        else{
          this.Addpopup = true 
          this.Addstatus = false
        }
      })
      this.addpopupForm.reset()
    this.addForm.reset()
    this.addForm.controls.cDate.patchValue(new Date);
    this.addForm.controls.sType.patchValue("C");
    }
 // <------cancel Method in AddstatusTracker popup------->
  Addstatuscancel(){
    this.Addstatus = false
    this.addpopupForm.reset()
  }
   // <------cancel Method in Addstatus popup------->
  Addcancel() {
    this.Addpopup = false
    this.addForm.reset();
  } 
   // <------Save Method in Addstatus popup------->
  AddSave() {
    this.btnDisabled = true;
setTimeout(() => {
this.btnDisabled = false
}, 5000);
    if (this.addForm.untouched || this.addForm.invalid) {
      this.Addpopup = true
      this.submitAddForm()
    }
    if (this.addForm.valid) {
      let body = {
        contactId: 1,
        objectType: this.addForm.value.oType,
        statusReportDate: this.addForm.value.sDate,
        title: this.addForm.value.title,
        statusReportStatus: this.addForm.value.sType,
        description: this.addForm.value.description
      }
      console.log('+++++++++++++++++++++++', body)
      this.dataService.post(apis.statustrackerAdd, body).subscribe((res: any) => {
        console.log('addmilstone res', res)
        this.addResponse = res
        if (this.addResponse.hasOwnProperty('success') === true) {
          this.getAllData()
          this.notification.create(
            'success',
            'Successfully Added',
            'Your data has been successfully added',
          )
        } else {
          this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
        }
       })
      this.Addpopup = false
    }
  }
   // <------Edit Popup------->
  RowEdit(values): void {
    this.Editpopup = true;
    console.log('editttt idd', this.id)
    console.log('editttt', values)
    this.editForm.get('cDate').patchValue(values.createdDate)
    this.editForm.get('sDate').patchValue(values.statusReportDate)
    this.editForm.get('title').patchValue(values.title)
    this.editForm.get('sType').patchValue(values.statusReportStatus)
    this.editForm.get('oType').patchValue(values.ObjectType)
    this.editForm.get('description').patchValue(values.description)
  }
  EditSave() {
    this.Editpopup = false
    if (this.editForm.invalid) {
      this.submitForm()
      this.Editpopup = true
    }
    if (this.editForm.valid) {
      let updated = {
      contactId: 1,
      objectType: this.editForm.value.oType,
      statusReportDate: this.editForm.value.sDate,
      title: this.editForm.value.title,
      statusReportStatus: this.editForm.value.sType,
      description: this.editForm.value.description,
    }
    console.log('--->data to table', updated)
    this.dataService.updateStatus(apis.statustrackerEdit, updated).subscribe((res: any) => {
      console.log('Updated data', res)
      this.getAllData()
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update')
      }
    })
    this.Editpopup = false;
  }
  }
   // <------Edit cancel Method in EditstatusTracker popup------->
  Editcancel() {
    console.log('Button cancel clicked!')
    this.Editpopup = false;
    this.editForm.reset()
  }
   // <------Date validation------->
  startValue: Date | null = null
  endValue: Date | null = null
  endOpen = false
  current = new Date()
  actualDate = new Date(this.current.getTime() - 24 * 60 * 60 * 1000)
  onStartChange(date: Date): void {
    this.startValue = date
  }
  onEndChange(date: Date): void {
    this.endValue = date
  }
   // <------submitt form------->
  submitAddForm(): void {
    for (const i in this.addForm.controls) {
      this.addForm.controls[i].markAsTouched()
      this.addForm.controls[i].updateValueAndValidity()
    }
  }
  submitForm(): void {
    for (const i in this.editForm.controls) {
      this.editForm.controls[i].markAsDirty()
      this.editForm.controls[i].updateValueAndValidity()
    }
  }
}