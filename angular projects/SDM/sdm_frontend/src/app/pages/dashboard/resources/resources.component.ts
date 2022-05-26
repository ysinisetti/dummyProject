import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { Router } from '@angular/router'

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

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit {
  // dataItem: DataItem = new DataItem();
  searchTerm
  type = [
    { label: 'Internal', value: 'R' },
    { label: 'External', value: 'E' },
    { label: 'Client', value: 'C' },
  ]
  resourceType = [
    { label: 'Internal Primary', value: 'I' },
    { label: 'Internal Shadow', value: 'N' },
    { label: 'External Primary', value: 'E' },
    { label: 'External Shadow', value: 'X' },
    { label: 'Client Primary', value: 'C' },
    { label: 'Client Shadow', value: 'L' },
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
  prjForm: FormGroup
  searchValue = ''
  data1: any
  sortName = null
  sortValue = null
  isVisible = false
  isVisible1 = false
  addResourceForm: FormGroup
  editResourceForm: FormGroup
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
  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key
    this.sortValue = sort.value
    this.search()
  }
  listOfData: any = []
  i = 0
  listOfDisplayData = [...this.listOfData]
  editId: string | null = null

  constructor(private fb: FormBuilder, private dataService: DataService, private route: Router) {}

  ngOnInit(): void {
    this.prjForm = this.fb.group({
      cName: [null],
      pName: [null],
    })
    this.addResourceForm = this.fb.group({
      fName: [null, [Validators.required]],
      lName: [null, [Validators.required]],
      role: [null, [Validators.required]],
      sDate: new Date(),
      eDate: [null, [Validators.required]],
      type: [null, [Validators.required]],
      resourceType: [null, [Validators.required]],
    })
    this.editResourceForm = this.fb.group({
      fName2: [null, [Validators.required]],
      lName2: [null],
      role2: [null],
      sDate2: [null],
      eDate2: [null],
      type2: [null],
      resourceType1: [null],
    })
    let projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.cName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.pName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName

    console.log('id', projectId)
    this.getAllResources()
    this.duplicateAry = this.listOfData
    this.ProjectName = sessionStorage.getItem('pName')
  }
  getAllResources() {
    this.dataService.get(apis.resource).subscribe((res: any) => {
      this.listOfData = res
      this.records = res.length
      console.log('gridData', this.listOfData)
    })
  }

  search1(): void {
    this.listOfDisplayData = this.listOfData.filter(
      (data: DataItem) => data.fName.indexOf(this.searchValue) !== -1,
    )
  }

  onCurrentPageDataChange(data) {
    console.log(data)
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex)
  }

  search(): void {
    /** sort data **/
    if (this.sortName) {
      const data = this.listOfData.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName] > b[this.sortName]
            ? 1
            : -1
          : b[this.sortName] > a[this.sortName]
          ? 1
          : -1,
      )
      // this.displayData = [...data]
    } else {
      // this.displayData = this.listOfData;
    }
  }
  addRow(): void {
    this.isVisible = true
  }
  editRow(values): void {
    this.isVisible1 = true
    this.id = values.id
    console.log('id=====>', this.id)
    // this.editResourceForm.get('fName2').patchValue(values.resourceTitle)
    this.editResourceForm.get('fName2').patchValue(values.resourceName)
    this.editResourceForm.get('sDate2').patchValue(values.startDate)
    this.editResourceForm.get('eDate2').patchValue(values.endDate)
    // this.editResourceForm.get('type2').patchValue(values.objectType)
    this.editResourceForm.get('role2').patchValue(values.resourceTitle)
    this.editResourceForm.get('resourceType1').patchValue(values.resourceType)
  }

  Save() {
    console.log(this.addResourceForm.value)
    const dataToAPI = {
      resourceName: this.addResourceForm.value.fName,
      resourceTitle: this.addResourceForm.value.role,
      startDate: this.addResourceForm.value.sDate,
      endDate: this.addResourceForm.value.eDate,
      // objectType: this.addResourceForm.value.type,
      resourceType: this.addResourceForm.controls.resourceType.value,
    }
    console.log('--->data to table', dataToAPI)
    this.dataService.postResource(apis.resourceAdd, dataToAPI).subscribe((res: any) => {
      console.log(res)
      this.getAllResources()
      this.isVisible = false
      this.addResourceForm.reset()
    })
  }

  Update(): void {
    console.log('--->data to table update')
    console.log(this.editResourceForm.controls.fName2.value)
    console.log(this.editResourceForm.controls.role2.value)
    console.log(this.editResourceForm.get('eDate2').value)
    // console.log(this.editResourceForm.controls.resourceType1.value)
    console.log(this.editResourceForm.controls.type2.value)

    let updated = {
      id: this.id,
      resourceName: this.editResourceForm.controls.fName2.value,
      startDate: this.editResourceForm.controls.sDate2.value,
      endDate: this.editResourceForm.controls.eDate2.value,
      resourceTitle: this.editResourceForm.controls.role2.value,
      objectType: this.editResourceForm.controls.type2.value,
      resourceType: this.editResourceForm.controls.resourceType1.value,
    }
    console.log('--->data to table', updated)
    this.dataService.updateResource(apis.resourceUpdate, updated).subscribe((res: any) => {
      console.log(res)
      this.getAllResources()
    })

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
      console.log(res)
      this.getAllResources()
    })
  }
  UpdateCancel(): void {
    console.log('Update Button cancel clicked!')
    this.isVisible1 = false
  }

  Cancel(): void {
    console.log('Button cancel clicked!')
    this.isVisible = false
  }

  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
