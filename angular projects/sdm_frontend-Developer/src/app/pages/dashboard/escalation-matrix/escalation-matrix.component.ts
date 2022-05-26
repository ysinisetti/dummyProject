import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { Router, ActivatedRoute } from '@angular/router'
import { NzNotificationService } from 'ng-zorro-antd'

@Component({
  selector: 'app-escalation-matrix',
  templateUrl: './escalation-matrix.component.html',
  styleUrls: ['./escalation-matrix.component.scss'],
})
export class EscalationMatrixComponent implements OnInit {
 
  projectId: number
  contactid: any
  domainId: number
  escalationlevel: number
  selectedProject: any
  projectTitle: String
  ProjectName: string
  res: any
  escalationForm: FormGroup
  createdBy: string
  workDomainId: string
  modifiedBy: string
  pageSize: number
  pageNum: number  
  createData: any
  CustomerName: any
  loginId: any
  addVisible: boolean = false
  editId: any
  addEditdailogheader: string
  editBtn: boolean
  addBtn: boolean  
  searchform: FormGroup
  header = 'Search'
  displaySmsTags: boolean = false
  displayEmailTags: boolean = false
 hideRadioBtns: boolean = true
 tableData = []
 optionList: any
  projectTeamLead: any
  projectManager: any
  deliveryManager: any
  projectSponser: any
  executiveLevel: any
  constructor(
    private fb: FormBuilder,   
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
  ) { }
 Matrix = [
    { label: 'Development', value: 'Development' },
    { label: 'Network', value: 'Network' },
    { label: 'Database', value: 'Database' },
    { label: 'Infrastructure', value: 'Infrastructure' },
    { label: 'Operation Support', value: 'Operation Support' },
    { label: 'Security', value: 'Security' },
    { label: 'Storage', value: 'Storage' },
    { label: 'Customer', value: 'Customer' },
    { label: 'Desktop App', value: 'Desktop App' },
  ]
 ngOnInit(): void {
 this.searchform = this.fb.group({
      contactName: [null],
    })
  this.selectedProject = this.route.params.subscribe(params => {
      this.projectTitle = params['title']
      console.log('title', this.projectTitle)
    })
this.ProjectName = sessionStorage.getItem('pName')
 this.escalationForm = this.fb.group({
  area: [null,[Validators.required],],
 projectManager: [null,[Validators.required, ],],
 projectTeamLead: [null,[Validators.required, ],],
deliveryManager: [null,[Validators.required, ],],
projectSponser: [null,[Validators.required],],
executiveLevel: [null, [Validators.required],],
})
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    console.log('projectId', this.projectId)
    this.loginId = JSON.parse(sessionStorage.getItem('loginData')).FName
    this.CustomerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.escalationForm.reset()
    this.getAllData()
    this.dataService.get(apis.employeeDropDown).subscribe(res => {
      console.log('dropdown', res)
      this.optionList = res
    })
  }
 // <------  Table data  integration------->
  getAllData() {
    const contactName = this.searchform.controls.contactName.value
    const id = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    const data = {
      projectId: id,
      contactId: contactName === null || contactName === undefined ? '' : contactName,
    }
   this.dataService.post(apis.escalationGet, data).subscribe((res: any) => {
      this.tableData = res
    console.log('REsponse', this.tableData)
    })
  }
// <------methods for Routing------->
  proj() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  dashboard() {
    this.router.navigate(['/dashboard/projectDetails/ProjectName'])
  }
// <------ method for closing Popup------->
  cancel(): void {
    this.addVisible = false
    this.escalationForm.reset()
  }
 goToNotification(data,department,level) {
    const id = data
     console.log('ramya', data,level)
    this.router.navigate(['/dashboard/demo',id,department,level])
     console.log('ramya', id)
  }
  // <------Add Popup------->
  addRow(): void {
    this.addEditdailogheader = 'Add Escalation'
    this.addVisible = true
    this.editBtn = false
    this.addBtn = true
  }
// <------ method for Edit Popup and patching------->
  editRow(res): void {
    this.addEditdailogheader ='Edit Escalation'
    this.addVisible = true
    this.editBtn = true
    this.addBtn = false
    this.editId = res
    console.log("resp",res,res['Executive Level'][0].contactid)
    console.log('tabledata', this.tableData)
    this.res = this.tableData
    this.escalationForm.get('area').patchValue(this.Matrix.filter(x => x.value === res.department)[0].value)
    this.escalationForm.get('executiveLevel').patchValue(this.optionList.filter(x => x.employeeName === res['Executive Level'][0].contactid)[0].id)
    this.escalationForm.get('projectSponser').patchValue(this.optionList.filter(x => x.employeeName === res['Project Sponser'][0].contactid)[0].id)
    this.escalationForm.get('projectManager').patchValue(this.optionList.filter(x => x.employeeName === res['Project Manager'][0].contactid)[0].id)
    this.escalationForm.get('projectTeamLead').patchValue(this.optionList.filter(x => x.employeeName === res['Project Team Lead'][0].contactid)[0].id)
    this.escalationForm.get('deliveryManager').patchValue(this.optionList.filter(x => x.employeeName === res['Delivery Manager'][0].contactid)[0].id)

   console.log(this.optionList.filter(x => x.employeeName ===res['Executive Level'][0].contactid))

    
  }

  // <------integration for updating data------->

  editMatrix() {
    const Id = this.projectId
    console.log('edit', this.tableData)    
    const id = this.editId.id    
    console.log("id",id)
    this.addVisible = false
    
    this.optionList.forEach(x => {
      if(x.id === this.escalationForm.get('projectTeamLead').value){
         this.projectTeamLead = x.employeeName
      }});

      this.optionList.forEach(x => {
        if(x.id === this.escalationForm.get('projectManager').value){
           this.projectManager = x.employeeName
        }});

        this.optionList.forEach(x => {
          if(x.id === this.escalationForm.get('deliveryManager').value){
             this.deliveryManager = x.employeeName
          }});

          this.optionList.forEach(x => {
            if(x.id === this.escalationForm.get('projectSponser').value){
               this.projectSponser = x.employeeName
            }});

            this.optionList.forEach(x => {
              if(x.id === this.escalationForm.get('executiveLevel').value){
                 this.executiveLevel = x.employeeName
              }});


    console.log('domainid', this.domainId)
    const data = {
      domainTitle: this.escalationForm.controls.area.value,
      projectId: Id,
      id:id,
      projectDomainEscalations: [
        {
          escalationLevel: "Project Team Lead",
          contactId: this.projectTeamLead,
          id:this.editId['Project Team Lead'][0].id,
          modifiedBy: this.loginId,
          empId:this.escalationForm.get('projectTeamLead').value,
        },
        {
          escalationLevel: "Project Manager",
          contactId: this.projectManager,
          id:this.editId['Project Manager'][0].id,
          modifiedBy: this.loginId,
          empId:this.escalationForm.get('projectManager').value	
        },
        {
          escalationLevel: "Delivery Manager",
          contactId: this.deliveryManager,
          id:this.editId['Delivery Manager'][0].id,
          modifiedBy: this.loginId,
          empId:this.escalationForm.get('deliveryManager').value
        },
        {
          escalationLevel: "Project Sponser",
          contactId:  this.projectSponser,
          id:this.editId['Project Sponser'][0].id,
          modifiedBy: this.loginId,
          empId:this.escalationForm.get('projectSponser').value	
        },
     
        {
          escalationLevel: "Executive Level",
          contactId: this.executiveLevel,
          id:this.editId['Executive Level'][0].id,
          modifiedBy: this.loginId,
          empId:this.escalationForm.get('executiveLevel').value	
        },
      ],
    }

    console.log(data)
    this.dataService.post(apis.escalationUpdate, data).subscribe((res: any) => {     
      this.getAllData()
      this.createData = res
      console.log('createData data=======>', this.createData)
      if (this.createData.hasOwnProperty('success') === true) {
        this.notification.create(
          'success',
          'Successfully Updated',
          'Your data has been successfully Updated',
        )
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
      }
    })  
  }

  // <------integration for deleting data------->
  deleteRow(data) {
    const id = this.projectId
    const areaId = data.id
    console.log('ID', areaId)
    let dId = {
     id:areaId,
      projectId: id
    }
    console.log('ramyaaa', dId)
    this.dataService.post(apis.escalationDelete, dId).subscribe(res => {
      console.log('deleted')
      this.getAllData()
      console.log(res)
      this.createData = res
      console.log('createData data=======>', this.createData)
      if (this.createData.hasOwnProperty('Domains Result') === true) {
        this.notification.create(
          'success',
          'Successfully Deleted',
          'Your data has been successfully Deleted',
        )
      } else {
        this.notification.create('error', 'Failed to Delete', 'Your data is failed to Delete ')
      }
    })  
  }

 // <------integration for adding data------->

  addMatrix() {
    console.log("hii")   
    if (this.escalationForm.untouched ){
      console.log("hiimouni")   
      this.addVisible = true
      this.submitAdd()
    }
    if (this.escalationForm.invalid){
      console.log("hiimounierere")
    }
      this.optionList.forEach(x => {
      if(x.id === this.escalationForm.get('projectTeamLead').value){
         this.projectTeamLead = x.employeeName
      }});
      this.optionList.forEach(x => {
        if(x.id === this.escalationForm.get('projectManager').value){
           this.projectManager = x.employeeName
        }});
        this.optionList.forEach(x => {
          if(x.id === this.escalationForm.get('deliveryManager').value){
             this.deliveryManager = x.employeeName
          }});
          this.optionList.forEach(x => {
            if(x.id === this.escalationForm.get('projectSponser').value){
               this.projectSponser = x.employeeName
            }});

            this.optionList.forEach(x => {
              if(x.id === this.escalationForm.get('executiveLevel').value){
                 this.executiveLevel = x.employeeName
              }});   
      const id = this.projectId  
   if (this.escalationForm.valid ) {
        console.log("hiimounika")
    let dataToAPI = {
      domainTitle: this.escalationForm.controls.area.value,
      seqNo: 7,
      createdBy: this.loginId,
      workDomainId: 125,
      modifiedBy: this.loginId,
      projectId: id,
      projectDomainEscalations: [
        {
          contactId:  this.projectTeamLead,
          createdBy: this.loginId,
          workDomainId: 702,
          description: 'Project domain escalations',
          modifiedBy: this.loginId,
          projectId: id,
          escalationLevel: "Project Team Lead" ,
          empId:this.escalationForm.get('projectTeamLead').value	
        },
        {
          contactId: this.projectManager,
          createdBy: this.loginId,
          workDomainId: 702,
          description: 'Project domain escalations',
          modifiedBy: this.loginId,
          projectId: id,
          escalationLevel: "Project Manager",
          empId:this.escalationForm.get('projectManager').value	
        },
        {
          contactId: this.deliveryManager,
          createdBy: this.loginId,
          workDomainId: 702,
          description: 'Project domain escalations',
          modifiedBy: this.loginId,
          projectId: id,
          escalationLevel: "Delivery Manager",
          empId:this.escalationForm.get('deliveryManager').value	
        },
        
        {
          contactId:  this.projectSponser,
          createdBy: this.loginId,
          workDomainId: 702,
          description: 'Project domain escalations',
          modifiedBy: this.loginId,
          projectId: 1,
          escalationLevel: "Project Sponser",
          empId:this.escalationForm.get('projectSponser').value	
        },
        {
          contactId:  this.executiveLevel,
          createdBy:this.loginId,
          workDomainId: 702,
          description: 'Project domain escalations',
          modifiedBy:this.loginId,
          projectId: id,
          escalationLevel: "Executive Level",
          empId:this.escalationForm.get('executiveLevel').value	
        },
      ],
    }
    console.log('--->data to table', dataToAPI)
    this.dataService.post(apis.escalationAdd, dataToAPI).subscribe((res: any) => {
      this.getAllData()
      console.log("mounika",res)
      this.createData = res
      console.log('createData data=======>', this.createData)
      if (this.createData.hasOwnProperty('success') === true) {
        this.notification.create(
          'success',
          'Successfully Added',
          'Your data has been successfully added',
        )
      } else {
        this.notification.create('error', 'Failed to add', 'Your data is failed to add ')
      }
    })
    this.addVisible = false
    this.escalationForm.reset()
   }
  }
   // <------Pagination------->
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllData()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.getAllData()
  }

  onChange(): void {
    this.getAllData()
  }

  resetSearchFields() {
    this.searchform.reset()
    this.getAllData()
  }
  
  submitAdd() : void {              // to restricting formdata based on validation
    for (const i in this.escalationForm.controls){
      this.escalationForm.controls[i].markAsTouched()
      this.escalationForm.controls[i].updateValueAndValidity()
    }
  }
}
