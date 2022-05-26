import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { apis } from 'src/app/api'
import { DataService } from './../../../data.service'
import { HostListener } from '@angular/core'
import { NzNotificationService } from 'ng-zorro-antd/notification'

interface ColumnItem {
  name: string
  width: string
}
@Component({
  selector: 'app-assembly-line-workers',
  templateUrl: './assembly-line-workers.component.html',
  styleUrls: ['./assembly-line-workers.component.scss'],
})
export class AssemblyLineWorkersComponent implements OnInit {
  pageNum: number
  pageSize: number
  totalPages: number
  records: any
  listOfData: any
  skillSet = []
  statusType = []
  contactType = []
  roleDropDown = []
  status = {
    A: 'Active',
    I: 'In-Active',
  }
  ctype = {
    B: 'Buyer',
    E: 'Employee',
    V: 'Vendor'
  }
  assemblyId: string
  
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.pageNum = 1
    }
  }
  searchForm: FormGroup
  header = 'Search'
  isVisible: boolean
  editVisible: boolean
  listOfColumns: ColumnItem[] = [
    {
      name: '#',
      width: '25px',
    },
    {
      name: 'Contact Name',
      width: '80px',
    },
    {
      name: 'Contact  Type',
      width: '80px',
    },
    {
      name: 'Created Date',
      width: '80px',
    },
    {
      name: 'Approved Date',
      width: '80px',
    },
    {
      name: 'Status',
      width: '70px',
    },
  ]
  
  constructor(
    private fb: FormBuilder, private route: Router,private notification: NzNotificationService,
    private dataService: DataService,) { }

  ngOnInit(): void {
    this.pageSize = 5;
    this.pageNum = 1;

    this.searchForm = this.fb.group({
      skillset: [null],
      status: [null],
      role: [null],
    })    
  console.log(this.assemblyId = sessionStorage.getItem('assemId'))
    this.getStatusDropdown()
    this.getContactDropdown()
    this.getSkillsetDropdown()
    this.getRoleDropdown()
    this.getAssembly()
  }

  // drop down integration //
  getStatusDropdown() {
    this.dataService.get(apis.statusDropDown).subscribe((res: any) => {
      this.statusType = res
      console.log('status type dropdown', this.statusType)
    })
  }
  getSkillsetDropdown() {
    this.dataService.get(apis.skillsetDropdown).subscribe((res: any) => {
      this.skillSet = res
      console.log('skillSet dropdown', this.skillSet)
    })
  }
  getContactDropdown() {
    this.dataService.get(apis.contactTypeDropdown).subscribe((res: any) => {
      this.contactType = res
      console.log('contactType Dropdown ', this.contactType)
    })
  }
  getRoleDropdown() {
    this.dataService.get(apis.roleDropDown).subscribe((res: any) => {
      this.roleDropDown = res
      console.log('role dropdown', this.roleDropDown)
    })
  }
 
  resetSearch() {     // reset search fields in assembly line workers
    this.searchForm.reset()
    this.getAssembly()
  }

  getAssembly() {       // search and table data  of assembly line workers
    const skillset = this.searchForm.controls.skillset.value
    const status = this.searchForm.controls.status.value
    const roleName = this.searchForm.controls.role.value
    let reqBody = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      skillset: skillset === null || skillset === undefined ? '' : skillset,
      status: status === null || status === undefined ? '' : status,
      roleName: roleName === null || roleName === undefined ? '' : roleName,
    }
    console.log(reqBody)
    this.dataService.post(apis.getassemblyWorkers, reqBody).subscribe(res => {
      console.log(res)
      this.listOfData = res;
      this.listOfData = res[0].data
      this.records = res[0].count
      this.totalPages = this.records
      console.log('gridData', this.listOfData)
    })
  }

   // pagination//
  onCurrentPageDataChange(data) {  
    this.pageNum = data
    this.getAssembly()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.getAssembly()
  }
  gotoHome() {      // routing back to home
    this.route.navigate(['/dashboard/allProjects'])
  }
  assemblyLine() {  // routing  back to assembly lines
    this.route.navigate(['/dashboard/assemblyLines'])
  }
  assemblyRoles() {    //routing  to assembly line roles    
   const id= sessionStorage.getItem("assemblyId")
    this.route.navigate(['/dashboard/assemblySkills', id])
  }  

}
