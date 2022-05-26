import { DataService } from './../../../data.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { NzUploadChangeParam } from 'ng-zorro-antd/upload'
import { NzMessageService } from 'ng-zorro-antd'
// import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-screen',
  templateUrl: './add-screen.component.html',
  styleUrls: ['./add-screen.component.scss'],
})
export class AddScreenComponent implements OnInit {
  userAddForm: FormGroup
  inputValue?: string
  options: string[] = []
  optionList = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' },
  ]
  listOfOption = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]
  lookUpData: any
  countryData: any
  stateData: any
  // dropdownSettings: IDropdownSettings = {
  //   singleSelection: false,
  //   idField: 'code',
  //   textField: 'name',
  //   selectAllText: 'Select All',
  //   unSelectAllText: 'UnSelect All',
  //   itemsShowLimit: 3,
  //   allowSearchFilter: false
  // }
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.userAddForm = this.fb.group({
      name: [null, Validators.required],
      date: [null, Validators.required],
      status: [null, Validators.required],
      phone: [null, Validators.required],
      multiSelect: [null, Validators.required],
      chooseFile: [''],
      checkbox: [''],
      radioData: [],
      country: [],
      state: [],
      textArea: [null, Validators.required],
      autoCompleteData: [null, Validators.required],
      timeData: [null, Validators.required],
    })
    this.dataService.get('assets/staticLookUp/lookUp.json').subscribe((res: any) => {
      this.lookUpData = res
      console.log(this.lookUpData)
      this.countryData = this.lookUpData.countries
    })
  }
  countryBasedState(data) {
    console.log(data)
    if (data.value === 'India') {
      this.stateData = this.lookUpData.indStates
    } else if (data.value === 'USA') {
      this.stateData = this.lookUpData.usaStates
    }
  }
  submitForm() {
    if (this.userAddForm.invalid) {
      for (const i in this.userAddForm.controls) {
        this.userAddForm.controls[i].markAsTouched()
      }
    } else {
      console.log(this.userAddForm.value)
    }
  }
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.options = value ? [value, value + value, value + value + value] : []
  }
  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`)
    }
  }
  onItemSelect(data) {
    console.log(data)
  }
  onSelectAll(data) {
    console.log(data)
  }
  getCheckboxData(data) {
    console.log(data)
  }
  getRadioData(data) {
    console.log(data)
  }
}
