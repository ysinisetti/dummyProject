import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { NzUploadChangeParam } from 'ng-zorro-antd/upload'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-update-screen',
  templateUrl: './update-screen.component.html',
  styleUrls: ['./update-screen.component.scss'],
})
export class UpdateScreenComponent implements OnInit {
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
  // dropdownSettings: IDropdownSettings = {
  //   singleSelection: false,
  //   idField: 'code',
  //   textField: 'name',
  //   selectAllText: 'Select All',
  //   unSelectAllText: 'UnSelect All',
  //   itemsShowLimit: 3,
  //   allowSearchFilter: false
  // }
  constructor(private fb: FormBuilder, private msg: NzMessageService) {}

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
      textArea: [null, Validators.required],
      autoCompleteData: [null, Validators.required],
      timeData: [null, Validators.required],
    })
  }
  submitForm() {
    for (const i in this.userAddForm.controls) {
      this.userAddForm.controls[i].markAsTouched()
    }
    console.log(this.userAddForm.value)
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
