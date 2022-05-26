import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { apis } from 'src/app/api';
import { DataService } from 'src/app/data.service';
interface ColumnItem {
  name: string
  width: string
}
@Component({
  selector: 'app-assembly-line-roles',
  templateUrl: './assembly-line-roles.component.html',
  styleUrls: ['./assembly-line-roles.component.scss'],
  providers: [DatePipe],
})
export class AssemblyLineRolesComponent implements OnInit {
  editAssemblyLineForm: FormGroup
  addSkillsForm: FormGroup
  editSkillsForm: FormGroup
  statusType = []
  role =[]
  skill = []
  SkillsetDropDown = []
  roleDropDown = []
  listOfData: any
  pageNum: number
  pageSize: number
  totalPages: number
  addSkillsVisible: boolean;
  editSkillVisible: boolean;
  id: any;
  editId: any;
  selectedId: any;
  listOfColumns: ColumnItem[] = [
    {
      name: '#',
      width: '20px',
    },
    {
      name: 'Role Name',
      width: '80px',
    },
    {
      name: 'Skillset',
      width: '80px',
    },
    {
      name: 'Quantity',
      width: '80px',
    },
    {
      name: 'Description',
      width: '100px',
    },
    {
      name: 'Action',
      width: '60px',
    },
  ]
  records: any;
  assemId: any;
  btnDisabled: boolean;
  skillVal: string;
  skillOption: any[];
  resourceTitleVal: string;
  roleVal: any[];
  statusLabel: any;
  skillLabel: any;

  constructor(private fb: FormBuilder, private route: Router, private router: ActivatedRoute,
    private notification: NzNotificationService, 
    private dataService: DataService,) { }

  ngOnInit(): void {
    this.pageSize = 5;
    this.pageNum = 1;

    this.selectedId = this.router.params.subscribe(params => {
      this.id = params['id']
      console.log(this.id)
      this.getAssemblyRole()
    })

    this.editAssemblyLineForm = this.fb.group({
      AssemblyTitle: [null, [Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      createdBy: [null],
      status: [null],
      description: [null, [Validators.required]],
    })

    this.addSkillsForm = this.fb.group({
      role: [null],
      quantity: [null],
      skillSet: [null, [Validators.required]],
      description: [null],
    })

    this.editSkillsForm = this.fb.group({
      role: [null],
      quantity: [null],
      skillSet: [null],
      description: [null],
    })
    this.getStatusDropdown()
    this.getSkillsetDropdown()
    this.getRoleDropdown()
    this.getAssemblySkills()
    this.getAssemblyRole()
  }

  // drop down integrations //
  getStatusDropdown() {
    this.dataService.get(apis.statusDropDown).subscribe((res: any) => {
      this.statusType = res
      console.log('status type dropdown', this.statusType)
    })
  }

  getSkillsetDropdown() {
    this.dataService.get(apis.skillsetDropdown).subscribe((res: any) => {
      this.SkillsetDropDown = res
      this.SkillsetDropDown.forEach(x=>{
        this.skill[x.optionKey]=x.optionValue
      })
      console.log('skillSet dropdown', this.SkillsetDropDown)
    })
  }
  getRoleDropdown() {
    this.dataService.get(apis.roleDropDown).subscribe((res: any) => {
      this.roleDropDown = res
      this.roleDropDown.forEach(x=>{
        this.role[x.Value]=x.Label
      })
      console.log('role dropdown', this.roleDropDown)
    })
  }

  getAssemblyRole() {           //  get assembly line by id  and patching the values
    this.dataService.getAssetsById(apis.getAssemblyLineById, this.id).subscribe(res => {
    console.log("assembly role by id data", res)
    console.log(this.selectedId = res[0].id);
    sessionStorage.setItem("assemblyId", res[0].id)
    this.editAssemblyLineForm.get('AssemblyTitle').patchValue(res[0].title)
    this.editAssemblyLineForm.get('status').patchValue(res[0].status)
    this.editAssemblyLineForm.get('description').patchValue(res[0].description)
    this.editAssemblyLineForm.get('createdBy').patchValue(res[0].createdBy)    
    })
  }
  assemblyLineUpdate() {         // update assembly line by id
    let updated = {
      "id": this.id,
      "title": this.editAssemblyLineForm.controls.AssemblyTitle.value,
      "status": this.editAssemblyLineForm.controls.status.value,
      "description": this.editAssemblyLineForm.controls.description.value,
      "createdBy": JSON.parse(sessionStorage.getItem('loginData')).LoginId,
    }
    console.log('--->data to table', updated)
    this.dataService.post(apis.assemblyLinesUpdate, updated).subscribe((res: any) => {
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update')
      }
    })
  }
  getAssemblySkills() {           //assembly line skills data based on assemblyLineId
    let reqBody = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      assemblyLineId: this.id,
    }
    this.dataService.post(apis.getassemblySkillsById, reqBody).subscribe(res => {
      console.log("get response", res)
      this.listOfData = res[0].data
      this.records = res[0].count
      this.totalPages = this.records
      console.log('gridData', this.listOfData)
    })
  }

  editSkills(item) {       // patching assembly skills values
    this.editSkillVisible = true
    this.editId = item.id
    this.assemId = item.assemblyLineId
    console.log('id=====>', this.editId)
    this.editSkillsForm.get('skillSet').patchValue(this.SkillsetDropDown.
      filter(x => x.optionKey === item.skillSetId)[0].optionKey)
    this.editSkillsForm.get('quantity').patchValue(item.qty)
    this.editSkillsForm.get('description').patchValue(item.description)
    this.editSkillsForm.get('role').patchValue(this.roleDropDown.
        filter(x => x.Value === item.roleName)[0].Value)
  }

  updateSkills() {            // updating assembly skills
    console.log('updateee');
    let updated = {
      "id": this.editId,
      "assemblyLineId": this.assemId,
      "skillSetId": this.editSkillsForm.controls.skillSet.value,
      "qty": Number(this.editSkillsForm.controls.quantity.value),
      "roleName": this.editSkillsForm.controls.role.value,
      "description": this.editSkillsForm.controls.description.value,
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
  cancelAssemblySkills() {        // cancel add assembly skills pop up
    this.addSkillsVisible = false;
  }
  addSkills() {                  // open add assembly skills pop up 
    this.addSkillsVisible = true
    this.addSkillsForm.reset()
  }

  saveSkills() {              //to save assembly line role/skills    
    if (this.addSkillsForm.untouched) {
      this.addSkillsVisible = true
      this.submitAdd()
    }
    if (this.addSkillsForm.valid) {
      console.log(this.addSkillsForm.value)
      let dataToAPI = {
        "assemblyLineId": this.id,
        "skillSetId": this.addSkillsForm.value.skillSet,
        "qty": Number(this.addSkillsForm.value.quantity),
        "roleName": this.addSkillsForm.value.role,
        "description": this.addSkillsForm.value.description,
      }
      console.log('--->data to table', dataToAPI)
      this.dataService.post(apis.assemblySkillsAdd, dataToAPI).subscribe(res => {
        this.btnDisabled = true;
        setTimeout(() => {
          this.btnDisabled = false
        }, 5000);
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
  }
  editRow() {                // open edit asssembly line role popup
    this.editSkillVisible = true
  }
  editCancel() {             // cancel edit asssembly line role popup
    this.editSkillVisible = false
  }

  deleteRow(item) {           // delete asssembly line role
    this.id = item.id
    console.log('id======>', this.id)
    const data1 = {
      id: item.id,
    }
    console.log('data1', data1)
    this.dataService.post(apis.assemblySkillDelete, data1).subscribe((res: any) => {
      this.listOfData.length === 1 ? this.pageNum = this.pageNum - 1 : this.pageNum
      if (res.hasOwnProperty('success') === true) {
        this.notification.create('error', 'Failed to delete', 'Failed to delete')
      } else {
        this.notification.create('success', 'Successfully Deleted', 'Record deleted successfully')
      }
      this.getAssemblySkills()
    })
  }
  onCurrentPageDataChange(data) {        // pagination //
    this.pageNum = data
    this.getAssemblySkills()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.getAssemblySkills()
  }

  gotoHome() {              // routing back to home
    this.route.navigate(['/dashboard/allProjects'])
  }
  gotoAssembly() {         // routing back to assembly lines
    this.route.navigate(['/dashboard/assemblyLines'])
  }
  view() {                // routing to assembly line workers
    this.route.navigate(['/dashboard/assemblyLineWorkers'])
  }
  submitAdd(): void {      // to  restrict form based on validation
    for (const i in this.addSkillsForm.controls) {
      this.addSkillsForm.controls[i].markAsTouched()
      this.addSkillsForm.controls[i].updateValueAndValidity()
    }
  }
}