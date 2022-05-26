import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { Router } from '@angular/router'
import { HostListener } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'

import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table'
import { DatePipe } from '@angular/common'

class DataItem {
  id: number
  fName: string
  lName: string
  role: string
  sDate: string
  eDate: string
  type: string
  resourceType: string
}
interface ColumnItem {
  sortOrder?: NzTableSortOrder
  sortFn?: NzTableSortFn
  listOfFilter?: NzTableFilterList
  filterFn?: NzTableFilterFn
}

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  providers: [DatePipe],
})
export class ResourcesComponent implements OnInit {
  type = [
    { label: 'Internal', value: 'R' },
    { label: 'External', value: 'E' },
    { label: 'Client', value: 'C' },
  ]
  header = 'Search'
  resourceType = [
    //   { label: 'Internal Primary', value: 'I' },
    //   { label: 'Internal Shadow', value: 'N' },
    //   { label: 'External Primary', value: 'E' },
    //   { label: 'External Shadow', value: 'X' },
    //   { label: 'Client Primary', value: 'C' },
    //   { label: 'Client Shadow', value: 'L' },
  ]
  type2 = [
    { label: 'Internal', value: 'R' },
    { label: 'External', value: 'E' },
    { label: 'Client', value: 'C' },
  ]
  resourceType1 = [
    { label: 'Internal Primary', value: 'I' },
    { label: 'Internal Shadow', value: 'N' },
    { label: 'External Primary', value: 'E' },
    { label: 'External Shadow', value: 'X' },
    { label: 'Client Primary', value: 'C' },
    { label: 'Client Shadow', value: 'L' },
  ]
  Resource = {
    N: ' Internal Shadow',
    I: ' Internal Primary',
    X: 'External Shadow',
    L: 'Client Shadow',
    E: 'External Primary',
    C: 'Client Primary',
  }
  Type = {
    R: 'Internal',
    E: 'External',
    C: 'Client',
  }
  startDate: string
  endDate: string
  pageNum: number
  pageSize: number
  noOfRecords: number
  totalPages: number
  projectId: any

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getAllResources()
      this.pageNum = 1
    }
  }

  prjForm: FormGroup
  searchValue = ''
  data: any
  sortName = null
  sortValue = null
  isVisible = false
  isVisible1 = false
  addResourceForm: FormGroup
  editResourceForm: FormGroup
  searchForm: FormGroup
  arr: DataItem[]
  duplicateAry: DataItem[]
  filtered: DataItem[]
  date: any
  gridData: any = []
  id: any
  delData: any
  logData: any
  cName: any
  pName: any
  records: any
  accountId: any
  ProjectName: string
  listOfData: any = []
  i = 0
  listOfDisplayData = [...this.listOfData]
  editId: string | null = null
  searchNameList = []
  searchAddressList = []
  newstartdate: Date

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private route: Router,
    private datepipe: DatePipe,
    private notification: NzNotificationService,
    private message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.dataService.get(apis.resourceDropdown).subscribe((res: any) => {
      this.resourceType = res
      console.log('resourceType dropdown', this.resourceType)
    })
    // resourceDropdown
    this.prjForm = this.fb.group({
      cName: [null],
      pName: [null],
    })
    this.addResourceForm = this.fb.group({
      fName: [null, [Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      lName: [null, [Validators.required]],
      role: [null, [Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      sDate: [null, [Validators.required]],
      eDate: [null, [Validators.required]],
      type: [null, [Validators.required]],
      resourceType: [null, [Validators.required]],
    })
    this.editResourceForm = this.fb.group({
      fName2: [null, [Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      lName2: [null, [Validators.required]],
      role2: [null, [Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      sDate2: [null, [Validators.required]],
      eDate2: [null, [Validators.required]],
      type2: [null, [Validators.required]],
      resourceType1: [null, [Validators.required]],
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

    console.log('id', this.projectId)
    this.pageSize = 10
    this.pageNum = 1
    this.totalPages = 20
    this.getAllResources()
    this.duplicateAry = this.listOfData
    this.ProjectName = sessionStorage.getItem('pName')
  }
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
    // const startDate = this.startDate;
    // const endDate = this.endDate;
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
      this.totalPages = res[0].count
      this.listOfData = res[0].data
      this.records = res[0].count
      console.log('gridData', this.listOfData)
    })
  }

  search1(): void {
    this.listOfDisplayData = this.listOfData.filter(
      (data: DataItem) => data.fName.indexOf(this.searchValue) !== -1,
    )
  }

  startValue: Date | null = null
  endValue: Date | null = null
  endOpen = false

  current = new Date()
  actualDate = new Date(this.current.getTime() - 24 * 60 * 60 * 1000)
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue) {
      return false
    }
    return startValue.getTime() < this.actualDate.getTime()
  }
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false
    }
    return endValue.getTime() <= this.startValue.getTime()
  }

  onStartChange(date: Date): void {
    this.startValue = date
  }

  onEndChange(date: Date): void {
    this.endValue = date
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log(open)
    this.endOpen = open
  }
  startValue1: Date | null = null
  endValue1: Date | null = null
  endOpen1 = false

  disabledStartDate1 = (startValue: Date): boolean => {
    if (!startValue) {
      return false
    }
    return startValue.getTime() < this.newstartdate.getTime()
  }

  disabledEndDate1 = (endValue: Date): boolean => {
    if (!endValue || !this.startValue1) {
      return false
    }
    return endValue.getTime() <= this.startValue1.getTime()
  }

  onStartChange1(date: Date): void {
    this.startValue1 = date
    console.log('t', this.startValue1)
  }

  onEndChange1(date: Date): void {
    this.endValue1 = date
  }

  handleStartOpenChange1(open: boolean): void {
    if (!open) {
      this.endOpen1 = true
    }
    console.log('handleStartOpenChange', open, this.endOpen1)
  }

  handleEndOpenChange1(open: boolean): void {
    console.log(open)
    this.endOpen1 = open
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex)
  }

  addRow(): void {
    this.isVisible = true
  }
  editRow(values): void {
    this.newstartdate = new Date(values.startDate)
    this.isVisible1 = true
    this.editId = values.id
    console.log('id=====>', this.id)
    this.editResourceForm.get('fName2').patchValue(values.resourceName)
    this.editResourceForm.get('sDate2').patchValue(values.startDate)
    this.editResourceForm.get('eDate2').patchValue(values.endDate)
    // this.editResourceForm.get('type2').patchValue(values.objectType)
    this.editResourceForm.get('role2').patchValue(values.resourceTitle)
    this.editResourceForm.get('resourceType1').patchValue(values.resourceType)
  }

  Save() {
    // if (this.addResourceForm.invalid) {
    //   for (const i in this.addResourceForm.controls) {
    //     this.addResourceForm.controls[i].markAsTouched()
    //   }
    // } else {
    console.log(this.addResourceForm.value)
    // console.log(this.addResourceForm.value)
    let dataToAPI = {
      projectId: this.projectId,
      resourceName: this.addResourceForm.value.fName,
      resourceTitle: this.addResourceForm.value.role,
      startDate: this.datepipe.transform(this.addResourceForm.get('sDate').value, 'yyyy-dd-MM'),
      endDate: this.datepipe.transform(this.addResourceForm.get('eDate').value, 'yyyy-dd-MM'),
      resourceType: this.addResourceForm.value.resourceType,
    }
    console.log('--->data to table', dataToAPI)
    this.dataService.postResource(apis.resourceAdd, dataToAPI).subscribe(res => {
      if (res.hasOwnProperty('success') === true) {
        this.getAllResources()
        this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
        // this.message.success(${res.success}); //for error .error
      } else {
        this.notification.create('error', 'Failed to add ', 'Your data is failed to add')
      }
    })
    this.isVisible = false
  }

  Update(): void {
    for (const i in this.editResourceForm.controls) {
      this.editResourceForm.controls[i].markAsTouched()
    }
    console.log('--->data to table update')
    console.log(this.editResourceForm.controls.fName2.value)
    console.log(this.editResourceForm.controls.role2.value)
    console.log(this.editResourceForm.get('eDate2').value)
    console.log(this.editResourceForm.controls.resourceType1.value)
    // console.log(this.editResourceForm.controls.type2.value)

    let updated = {
      id: this.editId,
      resourceName: this.editResourceForm.controls.fName2.value,
      startDate: this.datepipe.transform(this.editResourceForm.controls.sDate2.value, 'yyyy-MM-dd'),
      endDate: this.datepipe.transform(this.editResourceForm.controls.eDate2.value, 'yyyy-MM-dd'),
      resourceTitle: this.editResourceForm.controls.role2.value,
      projectId: this.projectId,
      resourceType: this.editResourceForm.controls.resourceType1.value,
    }
    console.log('--->data to table', updated)
    this.dataService.updateResource(apis.resourceUpdate, updated).subscribe((res: any) => {
      if (res.hasOwnProperty('success') === true) {
        this.getAllResources()
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')

        // this.message.success(${res.success}); //for error .error
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update')
      }
    })
    // console.log(res)
    this.isVisible1 = false
  }
  deleteRow(data) {
    this.id = data.id
    console.log('id======>', this.id)
    const data1 = {
      id: data.id,
    }
    console.log('data1', data1)
    this.dataService.post(apis.resourceDelete, data1).subscribe((res: any) => {
      if (res.hasOwnProperty('success') === true) {
        // this.getAllResources()
        this.notification.create('error', 'Failed to delete', 'Failed to delete')
        // this.message.success(${res.success}); //for error .error
      } else {
        this.notification.create('success', 'Successfully Deleted', 'Record deleted successfully')
      }
      // console.log(res)
      this.getAllResources()
    })
  }
  UpdateCancel(): void {
    console.log('Update Button cancel clicked!')
    this.isVisible1 = false
    this.editResourceForm.reset()
  }

  Cancel(): void {
    console.log('Button cancel clicked!')
    this.isVisible = false
    this.addResourceForm.reset()
  }

  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }

  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllResources()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.pageNum = 1
    this.getAllResources()
  }
  gotoHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }

  details1() {
    // this.projectname = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.pName])
  }

  resetSearchFields() {
    this.searchForm.reset()
    this.getAllResources()
  }
}
