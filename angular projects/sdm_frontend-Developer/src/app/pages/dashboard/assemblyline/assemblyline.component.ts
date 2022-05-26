import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { apis } from 'src/app/api';
import { DataService } from 'src/app/data.service';
interface ColumnItem {
  name: string
  width: string
}
@Component({
  selector: 'app-assemblyline',
  templateUrl: './assemblyline.component.html',
  styleUrls: ['./assemblyline.component.scss']
})
export class AssemblylineComponent implements OnInit {
  addAsmblyLineForm: FormGroup
  searchForm: FormGroup
  statusType = []
  listOfData: any
  pageNum: number
  pageSize: number
  totalPages: number
  addAssemblyLineVisible: boolean;
  id: any;
  header = 'Search'
  statusLabel = []
  listOfColumns: ColumnItem[] = [
    {
      name: '#',
      width: '30px',
    },
    {
      name: 'Assembly Line Title',
      width: '90px',
    },
    {
      name: 'Status',
      width: '80px',
    },
    {
      name: 'Description',
      width: '100px',
    },
    {
      name: 'Action',
      width: '60px',
    },
  ]
  records: number;
  createdBy: any;
  btnDisabled: boolean;

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
  if (event.key === 'Enter') {
  this.getAssemblyLines()
  }
  }
  constructor(private fb: FormBuilder, private route: Router,
    private notification: NzNotificationService, private dataService: DataService,) { }
  ngOnInit(): void {
    this.pageSize = 5;
    this.pageNum = 1;
  
    this.searchForm = this.fb.group({
      ASLtitle: [null],
      status: [null],
    })
    this.addAsmblyLineForm = this.fb.group({
      ASLtitle: [null, [Validators.required, Validators.maxLength(20)]],
      status: [null],
      description: [null],
    })
    this.createdBy = JSON.parse(sessionStorage.getItem('loginData')).LoginId 
    this.getStatusDropdown()
    this.getAssemblyLines()
  }

  // drop down integrations //
 getStatusDropdown(){
  this.dataService.get(apis.statusDropDown).subscribe((res: any) => {
    this.statusType = res
    this.statusType.forEach(x=>{
    this.statusLabel[x.Values]=x.Label
    })
    console.log('status type dropdown', this.statusType)
  })
 }
  resetSearch() {              // to reset asssembly lines search
    this.searchForm.reset()
    this.getAssemblyLines()
  }
  addAssemblyLine() {          // open add asssembly lines popup
    this.addAssemblyLineVisible = true;
    this.addAsmblyLineForm.reset()
  }
  assemblyLineCancel() {      // cancel add asssembly lines popup
    this.addAssemblyLineVisible = false;
  }

  // get and search  assembly line data //
  getAssemblyLines() {
    const assemblylineTitle = this.searchForm.controls.ASLtitle.value
    let reqBody = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      title: assemblylineTitle === null || assemblylineTitle === undefined ? '' : assemblylineTitle,
    }
    console.log(reqBody)
    this.dataService.post(apis.getAssemblyLineTitle, reqBody).subscribe(res => {
      console.log(res)
      this.listOfData = res[0].data
      this.records = res[0].count
      this.totalPages = this.records
      console.log('gridData', this.listOfData)
    })
  }
 
  assemblyLineSave() {            // to add assembly line record  
    if (this.addAsmblyLineForm.untouched) {
      this.addAssemblyLineVisible = true
      this.submitAdd()
    }
    if (this.addAsmblyLineForm.valid) {
      console.log(this.addAsmblyLineForm.value)
      let dataToAPI = {
        "title": this.addAsmblyLineForm.value.ASLtitle,
        "description": this.addAsmblyLineForm.value.description,
        "status": this.addAsmblyLineForm.value.status,
        "createdBy": this.createdBy,
      }
      console.log('--->data to table', dataToAPI)
      this.dataService.post(apis.assemblyLinesAdd, dataToAPI).subscribe(res => {
        this.btnDisabled = true;    
        console.log(res, "skills inserted");
        if (res.hasOwnProperty('success') === true) {
          this.getAssemblyLines()         
          this.notification.create('success', 'Successfully Added', 'Record inserted successfully')    
          setTimeout(() => {
            this.btnDisabled = false
            }, 3000);         
        } else {
          this.notification.create('error', 'Failed to add ', 'Your data is failed to add')
        }
      })
      this.addAssemblyLineVisible = false
    }
  }
  editAssemblyLine(data) {         // edit asssembly line routing 
    this.route.navigate(['/dashboard/assemblySkills', data.id])
  }
  deleteRow(data) {               // delete assembly line 
    this.id = data.id
    console.log('id======>', this.id)
    const data1 = {
      id: data.id,
    }
    console.log('data1', data1)
    this.dataService.post(apis.assemblyLinesDelete, data1).subscribe((res: any) => {
      this.listOfData.length === 1 ? this.pageNum = this.pageNum - 1 : this.pageNum
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('error', 'Failed to delete', 'Failed to delete')
      } else {
        this.notification.create('success', 'Successfully Deleted', 'Record deleted successfully')
      }
      this.getAssemblyLines()
    })
  }

// pagination// 
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAssemblyLines()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.getAssemblyLines()
  }
  gotoHome() {                     // home routing  
    this.route.navigate(['/dashboard/allProjects'])
  }
  submitAdd(): void {               // to  restrict form based on validation
    for (const i in this.addAsmblyLineForm.controls) {
      this.addAsmblyLineForm.controls[i].markAsTouched()
      this.addAsmblyLineForm.controls[i].updateValueAndValidity()
    }
  }
}
