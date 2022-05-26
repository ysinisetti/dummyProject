import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'app-sla',
  templateUrl: './sla.component.html',
  styleUrls: ['./sla.component.scss'],
})
export class SlaComponent implements OnInit {
  searchTerm
  tableData = [
    {
      pName: 'Response time',
      low: 'Same Bussiness Day',
      normal: 'Same Bussiness Day',
      high: 'With in 2hours',
      urgent: 'With in 2hours',
    },
    {
      pName: 'Resolution time',
      low: 'With in 1-2 weeks(2 sprint cycle)',
      normal: '2-5 working days(1sprint cycle)',
      high: 'With in 24hours',
      urgent: 'With in 2hours',
    },
  ]
  optionList1 = [
    { label: 'Response Time', value: 'Response Time' },
    { label: 'Resolution Time', value: 'Resolution Time' },
    // { pName: 'Request Management', cName: 'DMaas', pDuration: '120 Days', status: 'Active' },
    // { pName: 'Task Managment', cName: 'JBHunt', pDuration: '120 Days', status: 'In-Active' },
    // { pName: 'Risk Management', cName: 'Miracle', pDuration: '60 Days', status: 'Active' },
    // { pName: 'Project Manager', cName: 'Miracle', pDuration: '90 Days', status: 'In-Active' },
    // { pName: 'BPM', cName: 'same bussiness day', pDuration: '45 Days', status: 'In-Active' },
    // { pName: 'Meeting Manager', cName: 'DMaas', pDuration: '30 Days', status: 'Active' },
    // { pName: 'Gentex Inc', cName: 'Internal', pDuration: '60 Days', status: 'Active' },
  ]

  optionList = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' },
  ]
  prjForm: FormGroup
  isVisible: boolean
  addData: FormGroup
  isVisible1: boolean = false
  editData: FormGroup
  ProjectName: string
  constructor(private fb: FormBuilder, private route: Router) {}

  ngOnInit(): void {
    this.addData = this.fb.group({
      low: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      normal: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      high: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      urgent: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
    })
    this.editData = this.fb.group({
      low: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      normal: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      high: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
      urgent: [
        null,
        [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-z]*$')],
      ],
    })
    this.prjForm = this.fb.group({
      cName: [null],
      pName: [null],
    })
    this.prjForm.patchValue({
      cName: 'Internal',
      pName: this.optionList1.filter(x => x.label === 'Hubble')[0],
    })
    this.ProjectName = sessionStorage.getItem('pName')
  }
  onCurrentPageDataChange(data) {
    console.log(data)
  }
  addRow(): void {
    this.isVisible = true
  }
  editRow(values): void {
    this.isVisible1 = true
    this.editData.get('low').patchValue(values.low)
    this.editData.get('normal').patchValue(values.normal)
    this.editData.get('high').patchValue(values.high)
    this.editData.get('urgent').patchValue(values.urgent)
  }
  handleCancel(): void {
    // console.log('Button cancel clicked!');
    this.isVisible = false
    this.isVisible1 = false
  }
  save(): void {
    this.isVisible = true
    this.isVisible1 = true
  }
  handleSubmit1() {
    // console.log(this.addResourceForm.value);
    let dataToAPI = {
      taskName: this.addData.controls.low.value,
      startDate: this.addData.controls.normal.value,
      endDate: this.addData.controls.high.value,
      duration: this.addData.controls.urgent.value,
    }
    console.log('--->data to table', dataToAPI)
    this.isVisible = false
  }
  handleSubmit() {
    let updatedd = {
      taskName: this.editData.controls.taskName.value,
      startDate: this.editData.controls.startDate.value,
      endDate: this.editData.controls.endDate.value,
      duration: this.editData.controls.duration.value,
    }
    console.log('--->data to table', updatedd)
    this.isVisible1 = false
  }

  updateTask() {
    let updated = {
      low: this.editData.value.low,
      normal: this.editData.value.normal,
      high: this.editData.value.high,
      urgent: this.editData.value.urgent,
    }
    console.log('--->data to edit', updated)
    this.isVisible1 = false
  }

  deleteRow(id: string): void {
    this.tableData = this.tableData.filter(d => d.pName !== id)
  }
  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
