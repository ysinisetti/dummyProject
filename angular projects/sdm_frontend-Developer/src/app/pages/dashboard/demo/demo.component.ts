import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ViewChild } from '@angular/core'
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree'
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown'
import { ActivatedRoute, Router } from '@angular/router'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { NzNotificationService } from 'ng-zorro-antd'
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
})
export class DemoComponent implements OnInit {
  contactid: any
  sub: any
  ProjectName: string
  CustomerName: any
  employeedetails: any
  level: any
  issueDetails: any
  projectId: any
  changeDetails: Object
  serviceDetails: Object
  issue: boolean
  department: any
  email: boolean
  loginId: any
  title: string
  optionForm: FormGroup
  isConfirmLoading: boolean
  radioData: any
  hideRadioBtns: boolean = true
  smsVisible = false
  emailVisible = false
  empName: any
  empPhone: any
  empMail: any
  file: File[]
  escalateTitle: any
  id: any
  description: any
  selectedType: string ="Title"
  constructor(
    private fb: FormBuilder,
    private nzContextMenuService: NzContextMenuService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private notification: NzNotificationService,
  ) {}
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent
  defaultCheckedKeys = ['10020']
  defaultSelectedKeys = ['10010']
  defaultExpandedKeys = ['100', '1001']
  activatedNode?: NzTreeNode
  nodes = [{}]
  ngOnInit(): void {
    this.optionForm = this.fb.group({
      radioData: [],
      phone: [null, Validators.required],
      Name: [null, Validators.required],
      email: [null, Validators.required],
      subject: [null, Validators.required],
      message: [null, Validators.required],
      subject1: [null, Validators.required],
    })

    this.sub = this.route.params.subscribe(params => {
      this.contactid = params['id'] // (+) converts string 'id' to a number
      console.log('contactid', this.contactid)
      this.level = params['level']
      this.department = params['department']
      // In a real app: dispatch action to load the details here.
    })
    this.getEmployeeDetails()
    this.loginId = JSON.parse(sessionStorage.getItem('loginData')).Email1
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.CustomerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
  }

  getEmployeeDetails() {
    let empId = {
      empId: this.contactid,
    }
    this.dataService.post(apis.employeeDetails, empId).subscribe(ress => {
      this.employeedetails = ress
      console.log('employeedetails', this.employeedetails)
      this.empName = this.employeedetails.employeeName
      this.empPhone = this.employeedetails.phoneNumber
      this.empMail = this.employeedetails.mailId
    })
  }

  radio(): void {
    this.optionForm.controls.message.reset()
    let dropDownData = { projectId: 54 }
    this.isConfirmLoading = false
    this.optionForm.controls.subject.patchValue('')
    this.radioData = this.optionForm.get('radioData')?.value
    if (this.radioData === 'Issue') {
      this.selectedType = 'Issue'
      this.optionForm.controls.subject1.patchValue(this.selectedType+' :')
      this.optionForm.controls.message.reset()
      // this.issueDetails = null
      this.email = false
      this.dataService.post(apis.issueDetails, dropDownData).subscribe(res => {
        this.issueDetails = res
        console.log('issueDetails', this.issueDetails)
        // this.title =this.issueDetails.title
        // this.id =this.issueDetails.id
        // this.description =this.issueDetails.description
      })
    } else if (this.radioData === 'Change') {
      this.selectedType = 'Change Request'
      this.optionForm.controls.subject1.patchValue(this.selectedType+' :')
      this.optionForm.controls.message.reset()
      this.email = false
      //this.optionForm.get('radioData').setValue(null);
      this.dataService.post(apis.changeDetails, dropDownData).subscribe(res => {
        // this.optionForm.get('radioData').reset()
        this.issueDetails = res
        console.log('changeDetails', this.issueDetails)
        this.id =this.issueDetails.id
        // this.optionForm.controls.radioData.patchValue('')
      })
    } else if (this.radioData === 'Service') {
      this.selectedType = 'Service Request'
      this.optionForm.controls.subject1.patchValue(this.selectedType+' :')
      this.optionForm.controls.message.reset()
      this.email = false
      // this.optionForm.get('radioData').reset()
      this.dataService.post(apis.serviceDetails, dropDownData).subscribe(res => {
        this.issueDetails = res
        console.log('serviceDetails', this.issueDetails)
        this.id =this.issueDetails.id
      })
    } else {
      this.selectedType = 'Title'
      this.optionForm.controls.subject1.patchValue('Title :')
      this.optionForm.controls.message.reset()
      this.email = true
      console.log('email')
    }
  }
  showModalSms(): void {
    this.smsVisible = true
    this.optionForm.get('Name').patchValue(this.employeedetails.employeeName)
    this.optionForm.get('phone').patchValue(this.employeedetails.phoneNumber)
  }
  showModalEmail(): void {
    this.emailVisible = true
    this.email = true
    this.optionForm.get('Name').patchValue(this.employeedetails.employeeName)
    this.optionForm.get('email').patchValue(this.employeedetails.mailId)
  }
  sms(): void {
    this.smsVisible = false
  }
  handleCancelSms(): void {
    this.smsVisible = false
  }
  handleCancelEmail(): void {
    this.optionForm.reset();
    this.emailVisible = false
  }
  changeListener($event): void {
    console.log($event)
    if ($event.fileList.length === 0) {
      this.file = []
    } else {
      switch ($event.file.status) {
        case 'uploading':
          console.log($event)
          break
        case 'done':
          this.file = []
          console.log($event.fileList)
          $event.fileList.forEach(element => {
            this.file.push(element.originFileObj)
          })
      }
      console.log(this.file)
    }
  }
  dropDown() {
    console.log('dopdownmethod')
 const data = this.issueDetails.filter(x => x.title === this.optionForm.controls.subject.value )
 console.log(data)
 const id = data[0]?.id
 const title= data[0]?.title
 const descritpiton = data[0]?.desc
 this.optionForm.patchValue({
  message:"Escalation Issue : "+data[0]?.title+"," +"\n"+ "Id : "+ data[0]?.id +","+ "\n" +"Description : "+data[0]?.description
 })
    // this.optionForm.controls.message.patchValue(this.optionForm.controls.subject.value)
   
  }
  sendEmail(): void {
    this.emailVisible = false
    this.issueDetails.forEach(x => {
      if (x.title === this.optionForm.get('subject').value) {
        this.escalateTitle = x.title
        console.log('title', this.escalateTitle)
      }
    })
    const data = {
      domainTitle: this.department,
      projectDomainEscalations: [
        {
          name: this.employeedetails.employeeName,
          escalateType: this.radioData,
          escalateTitle: this.escalateTitle,
          projectId: this.projectId,
          projectName: this.ProjectName,
          email: this.employeedetails.mailId,
          escalateDescription: this.optionForm.controls.message.value,
          organizer: this.loginId,
          escalationLevel: this.level,
          createdBy: this.loginId,
         // subject:this.optionForm.controls.subject1.value
        },
      ],
    }
    const formData: FormData = new FormData()

    if (this.file === undefined) {
    } else {
      this.file.forEach(ele => {
        formData.append('files', ele)
      })
    }

    formData.append(
      'data',
      new Blob([JSON.stringify(data)], {
        type: 'application/json',
      }),
    )
    console.log('sending mail', data)
    this.dataService.post(apis.escalationMail, formData).subscribe((res: any) => {
      console.log('createData data=======>', res)
      if (res.hasOwnProperty('success') === true) {
        this.notification.create(
          'success',
          'Successfully Sent',
          'Your Mail has been successfully Sent',
        )
      } else {
        this.notification.create('error', 'Failed to Send', 'Your Mail is failed to send ')
      }
    })
    this.optionForm.reset()
  }

  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
    // do something if u want
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded
    } else {
      const node = data.node
      if (node) {
        node.isExpanded = !node.isExpanded
      }
    }
  }
  activeNode(data: NzFormatEmitEvent): void {
    this.activatedNode = data.node!
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu)
  }

  nzClick(event: NzFormatEmitEvent): void {
    console.log(event)
  }

  nzCheck(event: NzFormatEmitEvent): void {
    console.log(event)
  }

  // nzSelectedKeys change
  nzSelect(keys: string[]): void {
    console.log(keys, this.nzTreeComponent.getSelectedNodeList())
  }

  escalation() {
    // this.ProjectName = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/escalation'])
  }
  proj() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  dashboard() {
    this.router.navigate(['/dashboard/projectDetails/ProjectName'])
  }
}
