import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { Router } from '@angular/router'
import { HostListener } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { DatePipe } from '@angular/common'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

interface ColumnItem {
  name: string
  width: string
}
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  providers: [DatePipe],
})
export class ResourcesComponent implements OnInit {
  header = 'Search'
  resourceTypeDropDown = []
  rName=[]
  skillSet=[]
  billableDropDown = [
    { label: "Yes", value:"Y" },
    { label: "No", value:"N" }
  ]
  roleDropDown=[ ]
  startDate: string
  endDate: string
  pageNum: number
  pageSize: number
  totalPages: number
  projectId: any
  addResourceVisible :boolean= false
  editResourceVisible :boolean= false
  addResourceForm: FormGroup
  editResourceForm: FormGroup
  searchForm: FormGroup
  id: any
  cName: any
  pName: any
  records: any
  accountId: any
  ProjectName: string
  listOfData: any = []
  editId: any
  newstartdate: Date
  resourceI: boolean
  resourceE: boolean
  disabledStartDate: (current: Date) => boolean
  startValue: Date
  disabledEndDate: (current: Date) => boolean
  disabledStartDateedit: (current: Date) => boolean
  disabledEndDateedit: (current: Date) => boolean

  listOfColumns: ColumnItem[] = [
    {
      name: '#',
      width: '25px',
    },
    {
      name: 'Resource Name',
      width: '90px',
    },
    {
      name: 'Resource Type',
      width: '90px',
    },
    {
      name: 'Role',
      width: '80px',
    },
    {
      name: 'Start Date',
      width: '90px',
    },
    {
      name: 'End Date',
      width: '80px',
    },
    {
      name: 'Action',
      width: '60px',
    },
  ]
  btnDisabled: boolean
  loginname: any
  resourceLabel={}
  
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getAllResources()
    }
  }

  constructor( private fb: FormBuilder, private dataService: DataService,
    private route: Router, private datepipe: DatePipe,
    private notification: NzNotificationService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.disabledStartDate = (current: Date): boolean => {      // to disable previous values in start date
      return differenceInCalendarDays(current, new Date()) < 0
    }
    this.disabledStartDateedit = (current: Date): boolean => {    // to disable end date based on start date
      return differenceInCalendarDays(current, this.newstartdate) < 0
    }
    this.pageSize=5;
    this.pageNum=1;
    this.addResourceForm = this.fb.group({
      rNameInternal: [null, [ Validators.required]],
      rNameExternal: [null,[Validators.maxLength(80), Validators.required]],
      role: [null],
      sDate: [null],
      eDate: [null],
      resourceType: [null, [Validators.required]],
      mail: [null, [Validators.maxLength(60),Validators.email]],
      skillset : [null],
      billable:[null],
      workPhone:[null ,[Validators.maxLength(15),Validators.minLength(10),Validators.pattern('^[0-9]{1,15}$')]],
      mobilePhone:[null ,[Validators.maxLength(15),Validators.maxLength(10), Validators.pattern('^[0-9]{1,15}$') ]],
      comments :[null ,[Validators.maxLength(1500)]],
    })
    this.editResourceForm = this.fb.group({
      rNameInternal: [null, [ Validators.required]],
      rNameExternal: [null,[Validators.maxLength(80), Validators.required]],
      role: [null],
      sDate: [null],
      eDate: [null],
      resourceType: [null, [Validators.required]],
      mail: [null, [Validators.maxLength(60),Validators.email]],
      skillset : [null],
      billable:[null],
      workPhone:[null ,[Validators.maxLength(15),Validators.minLength(10),Validators.pattern('^[0-9]{1,15}$')]],
      mobilePhone:[null ,[Validators.maxLength(15),Validators.maxLength(10), Validators.pattern('^[0-9]{1,15}$') ]],
      comments :[null ,[Validators.maxLength(1500)]],
    })
    this.searchForm = this.fb.group({
      searchResource: [null],
      searchTitle: [null],
      searchType: [null],
      searchStartDate: [null],
      searchEndDate: [null],
    })

    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.cName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.pName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.loginname = JSON.parse(sessionStorage.getItem('loginData')).LoginId
    console.log('id', this.projectId)
    this.ProjectName = sessionStorage.getItem('pName')
    this.getResourceTypeDropdown()
    this.getResourceNameDropcdown()
    this.getSkillsetDropdown()
    this.getRoleDropdown()
    this.getAllResources()
  }
//  drop down integration  //
  getResourceTypeDropdown(){
  this.dataService.get(apis.resourceDropdown).subscribe((res: any) => {
    this.resourceTypeDropDown = res
    this.resourceTypeDropDown.forEach(x=>{
      this.resourceLabel[x.Value]=x.Label
      })
      console.log('resourceType dropdown', this.resourceTypeDropDown)
  })
}
getResourceNameDropcdown(){
  this.dataService.get(apis.getResource).subscribe((res: any) => {
    this.rName = res
    console.log('getResource name', this.rName)
  })
}
getSkillsetDropdown(){
  this.dataService.get(apis.skillsetDropdown).subscribe((res: any) => {
    this.skillSet = res
    console.log('skillSet dropdown', this.skillSet)
  })
}
getRoleDropdown(){
  this.dataService.get(apis.roleDropDown).subscribe((res: any) => {
    this.roleDropDown = res
    console.log('role dropdown', this.roleDropDown)
  })
}
 //resourcetype drop down condition///
  resType(event) {
    if (event === 'I' || event === 'N') {
      this.resourceI = true;
      this.resourceE = false;
      this.addResourceForm.get('rNameExternal').disable()
      this.addResourceForm.get('mail').disable()
      this.addResourceForm.get('rNameInternal').enable()
    }
  else if(event === 'E' || event === 'X' || event === 'C' || event === 'L') {
    this.resourceI = false;
    this.resourceE = true;
    this.addResourceForm.get('rNameExternal').enable()
    this.addResourceForm.get('mail').enable()
    this.addResourceForm.get('rNameInternal').disable()
  }
}

onStartChange(date: Date): void {
  this.startValue = date
  this.disabledEndDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date(this.startValue)) < 0
  }
}
//  to get table data and search
  getAllResources() {
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
    const resourceName = this.searchForm.controls.searchResource.value
    const resourceTitle = this.searchForm.controls.searchTitle.value
    const resourceType = this.searchForm.controls.searchType.value

    let reqBody = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      projectId: this.projectId,
      resourceName: resourceName === null || resourceName === undefined ? '' : resourceName,
      resourceTitle: resourceTitle === null || resourceTitle === undefined ? '' : resourceTitle,
      startDate: this.startDate === null || this.startDate === undefined ? '' : this.startDate,
      endDate: this.endDate === null || this.endDate === undefined ? '' : this.endDate,
      resourceType: resourceType === null || resourceType === undefined ? '' : resourceType,
    }
    console.log(reqBody)
    this.dataService.post(apis.resource, reqBody).subscribe(res => {
      console.log(res)
      this.listOfData = res[0].data
      this.records = res[0].count
      this.totalPages=this.records
      console.log('gridData', this.listOfData)
    })
  }

  addRow(): void {            // open add resources popup
    this.addResourceVisible = true
    this.addResourceForm.reset()
    this.addResourceForm.get('sDate').patchValue(new Date())
  }
  editRow(values): void {     // open edit resources popup and patching the values
    this.newstartdate = new Date(values.startDate)
    this.editResourceVisible = true
    this.editId = values.id
    this.resType(values.resourceType)
    console.log(this.rName, values.resourceName)
    console.log('id=====>', this.editId, values, this.rName)
    if (values.resourceType === 'I' || values.resourceType === 'N') {
      this.editResourceForm.get('rNameInternal').patchValue
      (this.rName.filter(x => x.UserName === values.resourceName)[0].MailId)
     } else {
      this.editResourceForm.get('rNameExternal').patchValue(values.resourceName)
      this.editResourceForm.get('mail').patchValue(values.email)
     }
    this.editResourceForm.get('sDate').patchValue(values.startDate)
    this.editResourceForm.get('eDate').patchValue(values.endDate)
    this.editResourceForm.get('role').patchValue
    (values.resourceTitle === null || values.resourceTitle === "" ||values.resourceTitle === undefined ?
    null : this.roleDropDown.filter(x => x.Value === values.resourceTitle)[0].Value)
    this.editResourceForm.get('resourceType').patchValue
    (values.resourceType === null || values.resourceType === "" ||values.resourceType === undefined ?
     null : this.resourceTypeDropDown.filter(x => x.Value === values.resourceType)[0].Value)
    this.editResourceForm.get('skillset').patchValue
    (values.skillSet === null || values.skillSet === "" ||values.skillSet === undefined ?
    null : this.skillSet.filter(x => x.optionKey === values.skillSet)[0].optionKey)
    this.editResourceForm.get('billable').patchValue
    (values.billable === null || values.billable === "" ||values.billable === undefined ?
    null : this.billableDropDown.filter(x => x.value === values.billable)[0].value)
    this.editResourceForm.get('workPhone').patchValue(values.workPhone)
    this.editResourceForm.get('mobilePhone').patchValue(values.mobilePhone)
    this.editResourceForm.get('comments').patchValue(values.comments)
  }
  saveResource() {             // to save resources values into table
    if (this.addResourceForm.untouched){
      this.addResourceVisible = true
      this.submitAdd()
    }
   if (this.addResourceForm.valid ) {
    console.log(this.addResourceForm.value)
    const resourceName1=this.addResourceForm.value.rNameInternal
    const resourceType =this.addResourceForm.value.resourceType
    let dataToAPI = {
      projectId: this.projectId,
      resourceName: resourceType === 'N' || resourceType === 'I' ?  this.rName.filter(x => x.MailId === resourceName1)[0].UserName :  this.addResourceForm.value.rNameExternal,
      resourceTitle :this.addResourceForm.controls.role.value,
      startDate: this.datepipe.transform(this.addResourceForm.get('sDate').value, 'yyyy-MM-dd'),
      endDate: this.datepipe.transform(this.addResourceForm.get('eDate').value, 'yyyy-MM-dd'),
      resourceType: this.addResourceForm.value.resourceType,
      email : resourceType === 'N' || resourceType === 'I' ? resourceName1 : this.addResourceForm.value.mail,
      billable:  this.addResourceForm.controls.billable.value,
      workPhone:  Number(this.addResourceForm.controls.workPhone.value),
      mobilePhone : Number(this.addResourceForm.controls.mobilePhone.value),
      skillSet : this.addResourceForm.controls.skillset.value,
      comments :this.addResourceForm.controls.comments.value,
    }
    console.log('--->data to table', dataToAPI)
    this.dataService.postResource(apis.resourceAdd, dataToAPI).subscribe(res => {
      this.btnDisabled = true;
      if (res.hasOwnProperty('success') === true) {
        this.getAllResources()
        setTimeout(() => {
         this.btnDisabled = false
          }, 3000);
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
      } else {
        this.notification.create('error', 'Failed to add ', 'Your data is failed to add')
      }
    })
    this.addResourceVisible = false
  }
}
    updateResource(): void {           //update the resource values
    console.log('--->data to table update')
    console.log(this.editResourceForm.controls.rNameExternal.value)
    console.log(this.editResourceForm.controls.mail.value)
    console.log(this.editResourceForm.get('eDate').value)
    console.log(this.editResourceForm.controls.resourceType.value)
    const resourceName2=this.editResourceForm.controls.rNameInternal.value
    const resourceName3=this.editResourceForm.controls.rNameExternal.value
    const resourceType2 =this.editResourceForm.controls.resourceType.value
    let updated = {
      id: this.editId,
      resourceName:  resourceType2 === 'N' || resourceType2 === 'I' ?  this.rName.filter(
      x => x.MailId === resourceName2)[0].UserName : this.editResourceForm.controls.rNameExternal.value ,
      startDate: this.datepipe.transform(this.editResourceForm.controls.sDate.value, 'yyyy-MM-dd'),
      endDate: this.datepipe.transform(this.editResourceForm.controls.eDate.value, 'yyyy-MM-dd'),
      resourceTitle: this.editResourceForm.controls.role.value,
      projectId: this.projectId,
      resourceType: this.editResourceForm.controls.resourceType.value,
      email : resourceType2 === 'N' || resourceType2 === 'I' ? resourceName2 : this.editResourceForm.controls.mail.value,
      billable: this.editResourceForm.controls.billable.value,
      workPhone: Number(this.editResourceForm.controls.workPhone.value),
      mobilePhone : Number(this.editResourceForm.controls.mobilePhone.value),
      skillSet : this.editResourceForm.controls.skillset.value,
      comments :this.editResourceForm.controls.comments.value,
    }
    console.log('--->data to table', updated)
    this.dataService.updateResource(apis.resourceUpdate, updated).subscribe((res: any) => {
      if (res.hasOwnProperty('success') === true) {
        this.getAllResources()
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update')
      }
    })
    this.editResourceVisible = false
  }

  deleteRow(data) {             // to delete a row from the table
    this.id = data.id
    console.log('id======>', this.id)
    const data1 = {
      id: data.id,
    }
    console.log('data1', data1)
    this.dataService.post(apis.resourceDelete, data1).subscribe((res: any) => {
      this.listOfData.length === 1 ? this.pageNum = this.pageNum -1 : this.pageNum
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('error', 'Failed to delete', 'Failed to delete')
      } else {
        this.notification.create('success', 'Successfully Deleted', 'Record deleted successfully')
      }
      this.getAllResources()
    })
  }
  updateCancel(): void {          // to cancel edit resource popup
    console.log('Update Button cancel clicked!')
    this.editResourceVisible = false
    this.editResourceForm.reset()
  }
  addCancel(): void {             // to cancel add resource popup
    console.log('Button cancel clicked!')
    this.addResourceVisible = false
  }
  addReview(data){              // routing for adding a review for resource
    console.log("dataaa", data);
    sessionStorage.setItem('toBeRated', JSON.stringify(data))
    if (data.resourceName == this.loginname) {
      this.message.info('Sorry! You cannot review yourself');
    } else {
      this.route.navigate(['/dashboard/addreview'])
    }
   }
// pagination //
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllResources()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.getAllResources()
  }
  gotoHome() {                    // home routing
    this.route.navigate(['/dashboard/allProjects'])
  }
  projectDetails() {              // routing to project details
    this.route.navigate(['/dashboard/projectDetails', this.pName])
  }

  resetSearchFields() {          // reset search fields
    this.searchForm.reset()
    this.getAllResources()
  }
  submitAdd() : void {             // to  restrict form based on validation
    for (const i in this.addResourceForm.controls){
      this.addResourceForm.controls[i].markAsTouched()
      this.addResourceForm.controls[i].updateValueAndValidity()
    }
  }

}
