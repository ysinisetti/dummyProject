import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-projectmeetings',
  templateUrl: './projectmeetings.component.html',
  styleUrls: ['./projectmeetings.component.scss'],
  providers: [DatePipe],
})
export class ProjectmeetingsComponent implements OnInit {
  createvisible = false
  recurvisible = false
  radioValue

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
  repeat = [
    { label: 'Never', value: 'Never' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' },
  ]
  end1 = [
    { label: 'Never', value: 'Never' },
    { label: 'Until', value: 'Until' },
    { label: 'Count', value: 'Count' },
  ]
  startValue: Date | null = null
  endValue: Date | null = null
  endOpen = false
  selectedValue1 = 'IST'
  selectedValue2 = 'none'
  listDataMap = {
    eight: [
      { type: 'warning', content: '10.30PM-Test' },
      { type: 'success', content: '5.30AM-PDM' },
    ],
    ten: [
      { type: 'warning', content: '2.00AM-Test.' },
      { type: 'success', content: '3.00PM-test' },
      { type: 'error', content: '4.00AM-test' },
    ],
    eleven: [
      { type: 'warning', content: '4.00AM-test' },
      { type: 'success', content: '4.00AM-test' },
      { type: 'error', content: '4.00AM-test.' },
      { type: 'error', content: '4.00AM-test' },
      { type: 'error', content: '4.00AM-test' },
      { type: 'error', content: '4.00AM-test' },
    ],
  }
  //checkbox
  allChecked = false
  indeterminate = true
  checkOptionsOne = [
    { label: 'Sunday', value: 'Sunday', checked: false },
    { label: 'Monday', value: 'Monday', checked: true },
    { label: 'Tuesday', value: 'Tuesday', checked: false },
    { label: 'Wednesday', value: 'Wednesday', checked: true },
    { label: 'Thursday', value: 'Thursday', checked: false },
    { label: 'Friday', value: 'Friday', checked: false },
    { label: 'Saturday', value: 'Saturday', checked: false },
  ]
  attendees = [
    { a: 'plokam' },
    { a: 'pgupta' },
    { a: 'ravali' },
    { a: 'sameer' },
    { a: 'praneeth' },
  ]
  timeMiutes = [{ m: '0 minute' }, { m: '15 minutes' }, { m: '30 minutes' }, { m: '45 minutes' }]
  projects = [{ name: 'Hubble' }, { name: 'DMAAS' }, { name: 'BPM' }, { name: 'B2B' }]
  departments = [{ name: 'Delivery' }, { name: 'Sales' }, { name: 'Marketting' }]
  locations = [{ name: 'MCITY' }, { name: 'Offshore' }, { name: 'Onsite' }]

  selectedProject
  selectedTimeZone
  date
  time
  project: boolean = false
  department: boolean = false
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
        background: '#00AAE7',

        color: '#FFFFFF',

        'border-radius': '0px',
        'margin-bottom': '5px',
        border: '0px',
      },
    },
  ]
  times = [
    { t: '00:00 AM', v: 0 },
    { t: '00:15 AM', v: 15 },
    { t: '00:30 AM', v: 0 },
    { t: '00:45 AM', v: 0 },
    { t: '01:00 AM', v: 0 },
    { t: '01:15 AM', v: 0 },
    { t: '01:30 AM', v: 0 },
    { t: '01:45 AM', v: 0 },
    { t: '02:00 AM', v: 0 },
    { t: '02:15 AM', v: 0 },
    { t: '02:30 AM', v: 0 },
    { t: '02:45 AM', v: 0 },
    { t: '03:00 AM', v: 0 },
    { t: '03:15 AM', v: 0 },
    { t: '03:30 AM', v: 0 },
    { t: '03:45 AM', v: 0 },
    { t: '04:00 AM', v: 0 },
    { t: '04:15 AM', v: 0 },
    { t: '04:30 AM', v: 0 },
    { t: '04:45 AM', v: 0 },
    { t: '05:00 AM', v: 0 },
    { t: '05:15 AM', v: 0 },
    { t: '05:30 AM', v: 0 },
    { t: '05:45 AM', v: 0 },
    { t: '06:00 AM', v: 0 },
    { t: '06:15 AM', v: 0 },
    { t: '06:30 AM', v: 0 },
    { t: '06:45 AM', v: 0 },
    { t: '07:00 AM', v: 0 },
    { t: '07:15 AM', v: 0 },
    { t: '07:30 AM', v: 0 },
    { t: '07:45 AM', v: 0 },
    { t: '08:00 AM', v: 0 },
    { t: '08:15 AM', v: 0 },
    { t: '08:30 AM', v: 0 },
    { t: '08:45 AM', v: 0 },
    { t: '09:00 AM', v: 0 },
    { t: '09:00 AM', v: 0 },
    { t: '09:15 AM', v: 0 },
    { t: '09:30 AM', v: 0 },
    { t: '09:45 AM', v: 0 },
    { t: '10:00 AM', v: 0 },
    { t: '10:15 AM', v: 0 },
    { t: '10:30 AM', v: 0 },
    { t: '10:45 AM', v: 0 },
    { t: '11:00 AM', v: 0 },
    { t: '11:15 AM', v: 0 },
    { t: '11:30 AM', v: 0 },
    { t: '11:45 AM', v: 0 },
    { t: '12:00 PM', v: 0 },
    { t: '12:15 PM', v: 0 },
    { t: '12:30 PM', v: 0 },
    { t: '12:45 PM', v: 0 },
    { t: '01:00 PM', v: 0 },
    { t: '01:15 PM', v: 0 },
    { t: '01:30 PM', v: 0 },
    { t: '01:45 PM', v: 0 },
    { t: '02:00 PM', v: 0 },
    { t: '02:15 PM', v: 0 },
    { t: '02:30 PM', v: 0 },
    { t: '02:45 PM', v: 0 },
    { t: '03:00 PM', v: 0 },
    { t: '03:15 PM', v: 0 },
    { t: '03:30 PM', v: 0 },
    { t: '03:45 PM', v: 0 },
    { t: '04:00 PM', v: 0 },
    { t: '04:15 PM', v: 0 },
    { t: '04:30 PM', v: 0 },
    { t: '04:45 PM', v: 0 },
    { t: '05:00 PM', v: 0 },
    { t: '05:15 PM', v: 0 },
    { t: '05:30 PM', v: 0 },
    { t: '05:45 PM', v: 0 },
    { t: '06:00 PM', v: 0 },
    { t: '06:15 PM', v: 0 },
    { t: '06:30 PM', v: 0 },
    { t: '06:45 PM', v: 0 },
    { t: '07:00 PM', v: 0 },
    { t: '07:15 PM', v: 0 },
    { t: '07:30 PM', v: 0 },
    { t: '07:45 PM', v: 0 },
    { t: '08:00 PM', v: 0 },
    { t: '08:15 PM', v: 0 },
    { t: '08:30 PM', v: 0 },
    { t: '08:45 PM', v: 0 },
    { t: '09:00 PM', v: 0 },
    { t: '09:15 PM', v: 0 },
    { t: '09:30 PM', v: 0 },
    { t: '09:45 PM', v: 0 },
    { t: '10:00 PM', v: 0 },
    { t: '10:15 PM', v: 0 },
    { t: '10:30 PM', v: 0 },
    { t: '10:45 PM', v: 0 },
    { t: '11:00 PM', v: 0 },
    { t: '11:15 PM', v: 0 },
    { t: '11:30 PM', v: 0 },
    { t: '11:45 PM', v: 0 },
  ]

  createData: any
  timezone
  startDate1: any
  startTime: any
  endTime: any
  endDate: any
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
  recurring
  visibleTime
  timezones
  All
  allday
  recurform: FormGroup
  repeatevery: boolean
  weekly: boolean
  end: boolean
  repeaton: boolean
  datepic: boolean
  pName: any

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
  Recurring() {
    this.recurvisible = true
    this.createvisible = false
  }
  constructor(
    private fb: FormBuilder,
    private dataservice: DataService,
    private datepipe: DatePipe,
    private notification: NzNotificationService,
  ) {}
  ngOnInit(): void {
    const children: Array<{ label: string; value: string }> = []
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i })
    }
    this.recurform = this.fb.group({
      startDate: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      repeat: [null, [Validators.required]],
      week: [null],
      checkmonday: [null],
      repeatevery: [null],
      repeaton: [null],
      date: [null],
      end: [null],
    })
    this.createMeetingForm = this.fb.group({
      name: [null, [Validators.required]],
      address: [null, [Validators.required]],
      selectedTimeZone: [null, [Validators.required]],
      attendees: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      startDate1: new Date(),
      endDate: [null, [Validators.required]],
      endDate1: new Date(),
      conferenceType: [null, [Validators.required]],
      location: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      quantities: this.fb.array([this.newQuantity()]),
    })
    this.visibleTime = true
    this.pName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
  }
  //week check boxes
  log(value: object[]): void {
    console.log(value)
  }
  //inserting create meeting method
  submitData() {
    // if (this.createMeetingForm.untouched || this.createMeetingForm.invalid) {
    //   this.submitForm()
    // } else {
    //   console.log('FormData========>', this.createMeetingForm.value)
    //   console.log('date, time', this.date, this.time)
    //   this.createvisible = false
    // }
    if (this.createMeetingForm.controls.startDate.value) {
      const startdte = this.createMeetingForm.controls.startDate.value
      const availablDt = new Date(Date.parse(startdte))
      this.startDate1 = this.datepipe.transform(availablDt, 'yyyy-MM-dd')
    }
    if (this.createMeetingForm.controls.endDate.value) {
      const enddte = this.createMeetingForm.controls.endDate.value
      const endDt = new Date(Date.parse(enddte))
      this.endDate = this.datepipe.transform(endDt, 'yyyy-MM-dd')
    }
    if (this.createMeetingForm.controls.startTime.value) {
      const starttime = this.createMeetingForm.controls.startDate.value
      const availablti = new Date(Date.parse(starttime))
      this.startTime = this.datepipe.transform(availablti, 'hh:mm:ss')
    }
    if (this.createMeetingForm.controls.endTime.value) {
      const starttime = this.createMeetingForm.controls.startDate.value
      const availablti = new Date(Date.parse(starttime))
      this.endTime = this.datepipe.transform(availablti, 'hh:mm:ss')
    }
    const data = {
      projectId: 1,
      documentIds: 's',
      prevMeetingId: 1,
      startDate: this.startDate1,
      endDate: this.endDate,
      startTime: this.startTime,
      endTime: this.endTime,
      locationType: this.createMeetingForm.controls.conferenceType.value,
      timeZone: this.createMeetingForm.controls.selectedTimeZone.value,
      location: this.createMeetingForm.controls.location.value,
      recurrence: 'y',
      organizerType: 'o',
      organizerId: 'smagisetty@miraclesoft.com',
      subject: this.createMeetingForm.controls.name.value,
      createdBy: 'smagisetty',
      ModifiedBy: 'smagisetty',
      agendas: this.createMeetingForm.controls.quantities.value,
      attendees: [
        {
          attendeeName: 'smagisetty@miraclesoft.com',
          addedDate: '2020-02-02',
          createdBy: 'sprathi@miraclesoft.com',
          modifiedBy: 'smagisetty',
        },
      ],
    }
    console.log('--->data to table', data)
    this.dataservice.post(apis.createMeetingPost, data).subscribe((res: any) => {
      console.log(res)
      this.createData = res

      // Activate after 2 sec.
      console.log('createData data=======>', this.createData)
      // if (this.createData.hasOwnProperty('success') === true) {
      //   this.notification.create(
      //     'success',
      //     'Successfully Added',
      //     'Your data has been successfully added',
      //   )
      // } else {
      //   this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
      // }
    })
  }
  quantities(): FormArray {
    return this.createMeetingForm.get('quantities') as FormArray
  }
  newQuantity(): FormGroup {
    return this.fb.group({
      title: [''],
      duration: [''],
      assignedto: [''],
      description: [''],
      createdby: ['sgarbham1@miraclesoft.com'],
    })
  }
  addQuantity() {
    this.quantities().push(this.newQuantity())
  }
  removeQuantity(i: number) {
    this.quantities().removeAt(i)
  }
  handleOk() {
    this.createvisible = false
  }
  RecurOk() {
    this.recurvisible = false
    this.createvisible = true
  }
  RecurCancel() {
    this.recurvisible = false
    this.createvisible = true
  }
  handleCancel() {
    this.createvisible = false
    this.createMeetingForm.reset()
  }
  endDropDown($event) {
    if ($event === 'Never') {
      this.datepic = false
    } else if ($event === 'Until') {
      this.datepic = true
    }
  }
  repeatDropDown($event) {
    if ($event === 'Never') {
      this.repeatevery = false
      this.repeaton = false
      this.end = false
    } else if ($event === 'Daily') {
      this.repeatevery = true
    } else if ($event === 'Weekly') {
      this.repeatevery = false
      this.weekly = true
    }
  }
  //start date and end date
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false
    }
    return startValue.getTime() > this.endValue.getTime()
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
    console.log('handleStartOpenChange', open, this.endOpen)
  }

  handleEndOpenChange(open: boolean): void {
    console.log(open)
    this.endOpen = open
  }

  listOfOption = ['pgupta', 'plokam', 'sudheer']
  listOfSelectedValue: string[] = []

  // isNotSelected(value: string): boolean {
  // console.log("this is index ===>",this.listOfSelectedValue.indexOf(value))
  //   return this.listOfSelectedValue.indexOf(value) === -1
  // }
  //checkbox
  // updateAllChecked(): void {
  //   this.indeterminate = false;
  //   if (this.allChecked) {
  //     this.checkOptionsOne = this.checkOptionsOne.map(item => {
  //       return {
  //         ...item,
  //         checked: true
  //       };
  //     });
  //   } else {
  //     this.checkOptionsOne = this.checkOptionsOne.map(item => {
  //       return {
  //         ...item,
  //         checked: false
  //       };
  //     });
  //   }
  // }

  // updateSingleChecked(): void {
  //   if (this.checkOptionsOne.every(item => !item.checked)) {
  //     this.allChecked = false;
  //     this.indeterminate = false;
  //   } else if (this.checkOptionsOne.every(item => item.checked)) {
  //     this.allChecked = true;
  //     this.indeterminate = false;
  //   } else {
  //     this.indeterminate = true;
  //   }
  // }

  submitForm(): void {
    for (const i in this.createMeetingForm.controls) {
      this.createMeetingForm.controls[i].markAsDirty()
      this.createMeetingForm.controls[i].updateValueAndValidity()
    }
  }
  typeSelected() {
    console.log('radio', this.radioValue)
    if (this.radioValue === 'Project') {
      this.project = true
      this.department = false
    } else {
      this.department = true
      this.project = false
    }
  }
  recurringMeeting() {
    console.log('Recurring Meeting entered')
    if (this.recurring === true) {
      this.visibleTime = false
    } else {
      this.visibleTime = true
    }
  }

  Allday() {
    console.log('allday entered')
    if (this.All === true) {
      this.allday = true
    } else {
      this.allday = false
    }
  }
}
