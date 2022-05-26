import { Router } from '@angular/router';
import { DataService } from './../../../data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { apis } from 'src/app/api';
import { HostListener } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification'
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  header = 'Search';
  searchForm: FormGroup;
  addAccountForm: FormGroup;
  editAccountForm: FormGroup;
  records: number;
  accountsData: any;
  pageNum: number
  pageSize: number
  totalPages: number
  addModel: boolean;
  editModel: boolean;
  allState: any;
  status: any;
  accTableData: any;
  addResponse: any;
  Response: any;
  editId: any;
  delData: any;
  docdata: any;
  docid: any;
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getAllAccounts(), (this.pageNum = 1)
    }
  }

  constructor(private fb: FormBuilder,
     private dataService: DataService,
      private router: Router, 
      private notification: NzNotificationService,) { }

      userName = JSON.parse(sessionStorage.getItem('loginData')).FName
       ngOnInit(): void {
    this.pageSize = 5
    this.pageNum = 1
    this.totalPages = 5
    this.searchForm = this.fb.group({
      searchName: [null],
      searchState: [null],
      searchStatus: [null],
      searchWebAddress: [null],
    })
    this.addAccountForm = this.fb.group({
      name:[null, [Validators.required, Validators.maxLength(60), Validators.pattern('^[a-zA-Z ]*$')],],
      region: [null, [Validators.maxLength(12), Validators.pattern('^[a-zA-Z ]*$')],],
      teritory: [null, [Validators.maxLength(15), Validators.pattern('^[a-zA-Z ]*$')],],
      state: [null, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],],
      industry: [null, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],],
      status: [null],
      type: [null, [Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')],],
      alias: [null, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],],
      phone: [null, [Validators.maxLength(25), Validators.pattern('^[0-9]*$')],],
      webAddress: [null, [Validators.maxLength(120)],],
      stocksymbol1: [null, [Validators.maxLength(12), Validators.pattern('^[a-zA-Z ]*$')],],
      stocksymbol2: [null, [Validators.maxLength(12), Validators.pattern('^[a-zA-Z ]*$')],],
      revenues: [null, [Validators.maxLength(25), Validators.pattern('^[0-9]*$')],],
      itBudget: [null, [Validators.maxLength(25), Validators.pattern('^[0-9]*$')],],
      taxid: [null, [Validators.maxLength(50), Validators.pattern('^[0-9]*$')],],
      description: [null, [Validators.maxLength(1500), Validators.pattern('^[\\s0-9a-zA-z]*$')],],
      LinkedInUrl: [null, [Validators.maxLength(500)],],
    })
    this.editAccountForm = this.fb.group({
      editName: [null, [Validators.required, Validators.maxLength(60),],],
      editCreatedBy: [null, [Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')],],
      editWebAddress: [null, [Validators.maxLength(120)],],
      editState: [null, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],],
      editStatus: [null],
      editDescription: [null, [Validators.maxLength(1500)],],

    })
    this.getAllAccounts()
  }

  accountStatus =[
    {label:'Active',value:'A'},
    {label:'InActive',value:'I'}
    ]

  Cstatus = {
    A: 'Active',
    I: 'Inactive',

  }
  // Method go to all Projects screen 
  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }

  // Get Account data to display the grid and also search with required fileds
  getAllAccounts() {
    const sName = this.searchForm.controls.searchName.value
    const sState = this.searchForm.controls.searchState.value
    const sStatus = this.searchForm.controls.searchStatus.value
    const sWebAddress = this.searchForm.controls.searchWebAddress.value


    let body = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      name: sName,
      state: sState,
      status: sStatus,
      webAddress: sWebAddress
    }
    console.log(body)
    console.log('Grid data', body)
    this.dataService.post(apis.getAccountData, body).subscribe((res: any) => {
      this.accTableData = res[0].data
      this.totalPages = res[0].count
      this.records = res[0].count
      console.log('data.....', this.accTableData)

    })

  }
  addAccount() {
    this.addModel = true;
  }
  // Save Account Form
  saveAccount() {
    this.addModel = true
    if (this.addAccountForm.untouched || this.addAccountForm.invalid) {
      this.addModel = true
      this.submitAdd()
    }
    if (this.addAccountForm.valid) {

      let body = {
        region: this.addAccountForm.get('region').value,
        teritory: this.addAccountForm.get('teritory').value,
        state: this.addAccountForm.get('state').value,
        industry: this.addAccountForm.get('industry').value,
        status: this.addAccountForm.get('status').value,
        type: this.addAccountForm.get('type').value,
        name: this.addAccountForm.get('name').value,
        alias: this.addAccountForm.get('alias').value,
        primaryAddressId: 22,
        secondAddressId: 23,
        thirdAddressId: 24,
        phone: this.addAccountForm.get('phone').value,
        fax: "92",
        webAddress: this.addAccountForm.get('webAddress').value,
        stockSymbol1: this.addAccountForm.get('stocksymbol1').value,
        stockSymbol2: this.addAccountForm.get('stocksymbol2').value,
        revenues: this.addAccountForm.get('revenues').value,
        noOfEmployees: 23,
        itBudget: this.addAccountForm.get('itBudget').value,
        taxId: this.addAccountForm.get('taxid').value,
        dunsNumber: "2323",
        description: this.addAccountForm.get('description').value,
        createdBy: this.userName,
        modifiedBy: "",
        linkedInUrl: this.addAccountForm.get('LinkedInUrl').value
      }
      console.log(body)
      this.dataService.post(apis.accountInsert, body).subscribe((res: any) => {
        console.log('Insert Responce', res)
        this.getAllAccounts()
        if (res.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Added',
            'Your data has been successfully added',
          )
        } else {
          this.notification.create('error', 'Failed to Add', 'Your data is failed to Add ')
        }
      });
      this.addModel = false
      this.addAccountForm.reset()
    }

  }
  // To edit the data and patch the values
  editAccount(data) {
    this.editModel = true;
    this.editAccountForm.get('editName').patchValue(data.name)
    this.editAccountForm.get('editCreatedBy').patchValue(data.createdBy)
    this.editAccountForm.get('editWebAddress').patchValue(data.webAddress)
    this.editAccountForm.get('editState').patchValue(data.state)
    this.editAccountForm.get('editStatus').patchValue(data.status)
    this.editAccountForm.get('editDescription').patchValue(data.description)
    this.editId = data.id
  }

  // Update Method
  updateAccount() {
    this.editModel = true;
    if (this.editAccountForm.untouched || this.editAccountForm.invalid) {
      this.editModel = true
      this.submitEdit()
    }
    if (this.editAccountForm.valid) {
      let body = {
        region: "SouthEast",
        teritory: "SouthCentral",
        state: this.editAccountForm.get('editState').value,
        industry: "Service Based Industry",
        status: this.editAccountForm.get('editStatus').value,
        type: "Subcontractor",
        name: this.editAccountForm.get('editName').value,
        alias: "mss",
        primaryAddressId: 334455,
        secondAddressId: 34437,
        thirdAddressId: 35787,
        phone: "8008434665",
        fax: "91",
        webAddress: this.editAccountForm.get('editWebAddress').value,
        stockSymbol1: "0",
        stockSymbol2: "0",
        revenues: 10000,
        noOfEmployees: 2500,
        itBudget: 50000,
        taxId: "1234",
        dunsNumber: "4545",
        description: this.editAccountForm.get('editDescription').value,
        createdBy: this.editAccountForm.get('editCreatedBy').value,
        modifiedBy: this.userName,
        linkedInUrl: "miracle@linkedin.com",
        id: this.editId
      }
      console.log(body)
      console.log('Update data', body)
      this.dataService.post(apis.accountUpdate, body).subscribe((res: any) => {
        this.Response = res
        if (this.Response.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Updated',
            'Your data has been successfully Updated',
          )
          this.getAllAccounts()
        } else {
          this.notification.create('error', 'Failed to Updated', 'Your data is failed to Updated ')
        }
      })
      this.editModel = false
      this.editAccountForm.reset()
    }
  }

  cancelEdit() {
    this.editModel = false;

  }
  contacts(id) {
    this.router.navigate(['/dashboard/contacts', id])

  }
  cancel() {
    this.searchForm.reset();
    this.getAllAccounts()
  }

  cancelAccounts() {
    this.addAccountForm.reset();
    this.addModel = false;

  }
  // Delete the Account data with particular row
  deleteAccount(data) {
    this.docid = data.id
    console.log("id", this.docid)
    const data1 = {
      id: data.id,
    }
    this.dataService.post(apis.accountDelete, data1).subscribe((res: any) => {
      this.delData = res
      console.log("Delete Account", res)
      if (res.hasOwnProperty('Result') === true) {
        setTimeout(() => {
          this.notification.create(
            'success',
            'Successfully Deleted',
            'Your data has been successfully Deleted',
          )
        }, 1000)
        this.getAllAccounts()
      } else {
        this.notification.create('error', 'Failed to Delete', 'Your data is failed to Delete ')
      }
      this.accTableData.length === 1 ? this.pageNum = this.pageNum - 1 : this.pageNum
      this.getAllAccounts()
    })
  }
  //Pagination
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllAccounts()
  }
  onPageSizeChange(data) {
    this.pageSize = data
    this.getAllAccounts()
  }
  submitAdd(): void {
    for (const i in this.addAccountForm.controls) {
      this.addAccountForm.controls[i].markAsTouched()
      this.addAccountForm.controls[i].updateValueAndValidity()
    }
  }
  submitEdit(): void {
    for (const i in this.editAccountForm.controls) {
      this.editAccountForm.controls[i].markAsTouched()
      this.editAccountForm.controls[i].updateValueAndValidity()
    }
  }

}
