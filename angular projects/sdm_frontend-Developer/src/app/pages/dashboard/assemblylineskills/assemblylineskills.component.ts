import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { apis } from 'src/app/api';
import { DataService } from 'src/app/data.service';


@Component({
  selector: 'app-assemblylineskills',
  templateUrl: './assemblylineskills.component.html',
  styleUrls: ['./assemblylineskills.component.scss']
})
export class AssemblylineskillsComponent implements OnInit {

  editAssemblyForm: FormGroup
  addSkillsForm:FormGroup
  editSkillsForm:FormGroup
  statusType=[ ]
  contactType=[ ]
  SkillsetDropDown=[]
  roleDropDown=[]
  listOfData: any
  pageNum: number
  pageSize: number
  totalPages: number
  addSkillsVisible: boolean;
  id: any;
  editSkillVisible: boolean;
  editId: any;

  skillset = {
    A: 'UxDesigner',
    A1:'HR Manager',
    B: 'UxDeveloperAngular',
    B1:'Management',
    C: 'UxDashboardsReports',
    C1:'Project Manager',
    D: 'UxMenuSecurity',
    D1:'Sales',
    E: 'UxQualityEnginer',
    E1:'Recruiter',
    F: 'UxChatBots',
    F1:'Marketing',
    G: 'BxIntegrator',
    G1 :'Finance',
    H: 'BxTLDeveloper',
    H1:'Immigration',
    I: 'BxFilesWebSocketsS3Excel',
    J: 'BxMQStreams',
    K: 'BxAlertsEmailPdfLogs',
    L: 'BxDotNet',
    M: 'BxNodeJs',
    N: 'BxDB',
    O: 'BxScheduler',
    P: 'BxAPIGateway',
    Q: 'UxVisualAnalytics',
    R: 'IxDevOps',
    S: 'IxCloud',
    T: 'IxSecurity',
    U: 'IxNetworks',
    V: 'IxDataScientist',
    W: 'SAP Basis',
    X: 'SAP ABAP',
    Y: 'SAP Functional',
    Z: 'SAP PI/PO',
  }


  constructor( private fb: FormBuilder,  private route: Router,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private dataService: DataService, ) { }

  ngOnInit(): void {
    this.pageSize=5;
    this.pageNum=1;

    this.dataService.get(apis.statusDropDown).subscribe((res: any) => {
      this.statusType = res
      console.log('status type dropdown', this.statusType)
    })

    this.dataService.get(apis.contactTypeDropdown).subscribe((res: any) => {
      this.contactType = res
      console.log('contactType Dropdown ', this.contactType)
    })

    this.dataService.get(apis.skillsetDropdown).subscribe((res: any) => {
      this.SkillsetDropDown = res
      console.log('skillSet dropdown', this.SkillsetDropDown)
    })

    this.dataService.get(apis.roleDropDown).subscribe((res: any) => {
      this.roleDropDown = res
      console.log('role dropdown', this.roleDropDown)
    })
    this.editAssemblyForm =this.fb.group({
      cName: [null, [Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      cType: [null, [Validators.required]],
      cDate: [null, [Validators.required]],
      createdBy: [null, [Validators.required]],
      status: [null, [Validators.required]],
      description: [null, [Validators.required]],
    })
    this.addSkillsForm =this.fb.group({
      role:[null],
      quantity:[null],
      skillSet: [null],
      description: [null],
    })
    this.editSkillsForm =this.fb.group({
      role:[null],
      quantity:[null],
      skillSet: [null],
      description: [null],
    })
this.getAssemblySkills()
  }


  getAssemblySkills(){
    this.dataService.get(apis.getassemblySkills).subscribe(res => {
      console.log(res)
      this.listOfData =res;
      // this.listOfData = res[0].data
      // this.records = res[0].count
      // this.totalPages=this.records
      console.log('gridData', this.listOfData)
    })
  }

  UpdateCancel(){
      this.editAssemblyForm.reset()
    }

    editSkills(data){
      this.editSkillVisible = true
        this.editId = data.id
        console.log('id=====>', this.editId)
        this.editSkillsForm.get('skillSet').patchValue(data.skillSetId)
        this.editSkillsForm.get('quantity').patchValue(data.qty)
        this.editSkillsForm.get('description').patchValue(data.description)
        this.editSkillsForm.get('role').patchValue(data.roleName)
    }

    updateSkills(){
        let updated = {
          "assemblyLineId" : 1,
          "skillSetId" : this.editSkillsForm.controls.skillSet.value,
          "qty" : Number(this.editSkillsForm.controls.quantity.value),
          "roleName" : this.editSkillsForm.controls.role.value,
          "description" : this.editSkillsForm.controls.description.value,
        }
        console.log('--->data to table', updated)
        this.dataService.post(apis.assemblySkillUpdate, updated).subscribe((res: any) => {
          if (res.hasOwnProperty('success') === true) {
            this.getAssemblySkills()
            this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
          } else {
            this.notification.create('error', 'Failed to Update', 'Your data is failed to update')
          }
        })
        this.editSkillVisible = false
      }
      Cancel(){
this.addSkillsVisible =false;
      }
      saveSkills(){
        console.log(this.addSkillsForm.value)
        let dataToAPI = {
          "assemblyLineId" : 1,
          "skillSetId" : this.addSkillsForm.value.skillSet,
          "qty" : Number(this.addSkillsForm.value.quantity),
          "roleName" : this.addSkillsForm.value.role,
          "description" : this.addSkillsForm.value.description,
          }
          console.log('--->data to table', dataToAPI)
          this.dataService.post(apis.assemblySkillsAdd,dataToAPI).subscribe(res => {
            console.log(res, "skills inserted");

            if (res.hasOwnProperty('success') === true) {
              this.getAssemblySkills()
              this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
            } else {
              this.notification.create('error', 'Failed to add ', 'Your data is failed to add')
            }
          })
          this.addSkillsVisible = false
        }
      editRow(){
        this.editSkillVisible = true
      }
      addSkils(){
        this.addSkillsVisible=true
      }

      editCancel(){
        this.editSkillVisible = false
      }
      Update(){

      }
      deleteRow(data) {
        this.id = data.id
        console.log('id======>', this.id)
        const data1 = {
          id: data.id,
        }
        console.log('data1', data1)
        this.dataService.post(apis.assemblySkillDelete, data1).subscribe((res: any) => {
          this.listOfData.length === 1 ? this.pageNum = this.pageNum -1 : this.pageNum
          if (res.hasOwnProperty('success') === true) {
            this.notification.create('error', 'Failed to delete', 'Failed to delete')
          } else {
            this.notification.create('success', 'Successfully Deleted', 'Record deleted successfully')
          }
          this.getAssemblySkills()
        })
      }

      onCurrentPageDataChange(data) {
        this.pageNum = data
        // this.getAssembly()
      }
      onPageSizeChange(data) {
        console.log('page size change', data)
        this.pageSize = data
        // this.getAssembly()
      }
      gotoHome() {
        this.route.navigate(['/dashboard/allProjects'])
      }
      gotoAssembly(){
        this.route.navigate(['/dashboard/assembly'])
      }
}
