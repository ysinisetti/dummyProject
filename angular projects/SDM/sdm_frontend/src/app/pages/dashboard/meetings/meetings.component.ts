import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { Router } from '@angular/router'
@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss'],
})
export class MeetingsComponent implements OnInit {
  createvisible = false
  tableData1 = [{ pName: 'Scoop Text', cName: 'Internal', pDuration: '60 Days', status: 'Active' }]
  timeHours = [
    { t: '0 hour' },
    { t: '1 hour' },
    { t: '2 hours' },
    { t: '3 hours' },
    { t: '4 hours' },
    { t: '5 hours' },
    { t: '6 hours' },
    { t: '7 hours' },
    { t: '8 hours' },
    { t: '9 hours' },
    { t: '10 hours' },
    { t: '11 hours' },
    { t: '12 hours' },
    { t: '13 hours' },
    { t: '14 hours' },
    { t: '15 hours' },
    { t: '16 hours' },
    { t: '17 hours' },
    { t: '18 hours' },
    { t: '19 hours' },
    { t: '20 hours' },
    { t: '21 hours' },
    { t: '22 hours' },
    { t: '23hours' },
    { t: '24 hours' },
  ]

  timeMiutes = [{ m: '0 minute' }, { m: '15 minutes' }, { m: '30 minutes' }, { m: '45 minutes' }]
  radioValue
  selectedProject
  selectedTimeZone
  date
  time
  selectedTime
  selectedTimeMin
  selectedLocation
  createMeetingForm: FormGroup
  panels = [
    {
      active: false,
      disabled: false,
      name: 'Today meetings',
      icon: 'double-right',
      customStyle: {
        background: '#111',

        color: '#FFFFFF',

        'border-radius': '0px',
        'margin-bottom': '5px',
        border: '0px',
      },
    },
    {
      active: false,
      disabled: true,
      name: 'UpComing  Meetings',
      icon: 'double-right',
      customStyle: {
        background: '#00AAE7',
        'border-radius': '0px',
        'margin-bottom': '5px',

        border: '0px',
      },
    },
    {
      active: false,
      disabled: false,
      name: 'Recently Completed',
      icon: 'double-right',
      customStyle: {
        background: '#EF4048',
        'border-radius': '0px',
        'margin-bottom': '5px',

        border: '0px',
      },
    },
  ]
  optionList1 = [
    { label: 'All', value: 'All' },
    { label: 'Scoop Text', value: 'Scoop Text' },
    { label: 'Hubble', value: 'Hubble' },
    { label: 'Request Management', value: 'Request Management' },
    { label: 'Task Managment', value: 'Task Managment' },
    { label: 'Risk Managementll', value: 'Risk Management' },
    { label: 'Project Manager', value: 'Project Manager' },
    { label: 'BPM', value: 'BPM' },
    { label: 'Meeting Manager', value: 'Meeting Manager' },
    { label: 'Gentex Inc', value: 'Gentex Inc' },
  ]

  listDataMap = {}
  ProjectName: string

  deleteRow() {}
  addRow() {}
  selectChange(select: Date): void {
    this.createvisible = true
    console.log(`Select value: ${select}`)
  }
  getMonthData(date: Date): number | null {
    if (date.getMonth() === 8) {
      return 1394
    }
    return null
  }
  create() {
    this.createvisible = true
  }

  constructor(private fb: FormBuilder, private route: Router) {}
  ngOnInit(): void {
    const children: Array<{ label: string; value: string }> = []
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i })
    }

    this.createMeetingForm = this.fb.group({
      meetingType: [null, [Validators.required]],
      selectedTitle: [null, [Validators.required]],
      name: [null, [Validators.required]],
      address: [null, [Validators.required]],
      selectedTimeZone: [null, [Validators.required]],
      attendees: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      duration1: [null, [Validators.required]],
      duration2: [null, [Validators.required]],
      conferenceType: [null, [Validators.required]],
      location: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
    })
    this.ProjectName = sessionStorage.getItem('pName')
  }
  handleOk() {
    this.createvisible = false
  }

  handleCancel() {
    this.createvisible = false
  }

  listOfOption = ['Ram', 'Robert', 'Rahim', 'Anthony']
  listOfSelectedValue: string[] = []

  isNotSelected(value: string): boolean {
    // console.log("this is index ===>",this.listOfSelectedValue.indexOf(value))
    return this.listOfSelectedValue.indexOf(value) === -1
  }

  submitData() {
    if (this.createMeetingForm.untouched || this.createMeetingForm.invalid) {
      this.submitForm()
    } else {
      console.log('FormData========>', this.createMeetingForm.value)
      console.log('date, time', this.date, this.time)
    }
  }

  submitForm(): void {
    for (const i in this.createMeetingForm.controls) {
      this.createMeetingForm.controls[i].markAsDirty()
      this.createMeetingForm.controls[i].updateValueAndValidity()
    }
  }
  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
