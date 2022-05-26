import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { apis } from 'src/app/api';
import { HostListener } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  header = 'Search';
  searchForm: FormGroup;
  addContactForm: FormGroup;
  editContactForm: FormGroup;
  records: number;
  ContactsData: any;
  pageNum: number
  pageSize: number
  totalPages: number
  addModel: boolean;
  editModel: boolean;
  allState: any;
  status: any;
  contactTableData: any;
  editId: any;
  Response: any;
  docid: any;
  delData: any;
  accountId: any;
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getAllContacts(), (this.pageNum = 1)
    }
  }
  constructor(private fb: FormBuilder, 
    private dataService: DataService, 
    private notification: NzNotificationService,
     private route: ActivatedRoute, 
     private router: Router,) { }

  userName = JSON.parse(sessionStorage.getItem('loginData')).FName
  ngOnInit(): void {
    this.pageSize = 5
    this.pageNum = 1
    this.totalPages = 5
    this.route.params.subscribe(params => {
      this.accountId = params['id']
    })

    this.searchForm = this.fb.group({
      searchName: [null],
      searchSpecialization: [null],
      searchStatus: [null],
    })
    this.addContactForm = this.fb.group({
      title: [null,[Validators.maxLength(40), Validators.pattern('^[a-zA-Z ]*$')], ],
      teritory: [null, [Validators.maxLength(15), Validators.pattern('^[a-zA-Z ]*$')],],
      fName: [null,[Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')],],
      mName: [null, [Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')],],
      lName: [null,[Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')],],
      aName: [null, [Validators.maxLength(20), Validators.pattern('^[a-zA-Z ]*$')],],
      cStatus: [null],
      salutation: [null, [Validators.maxLength(5), Validators.pattern('^[a-zA-Z ]*$')],],
      pAddressid: [null, [Validators.maxLength(10), Validators.pattern('^[0-9]*$')],],
      sAddressid: [null, [Validators.maxLength(10), Validators.pattern('^[0-9]*$')],],
      gender: [null],
      dob: [null],
      doa: [null],
      leadScore: [null, [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')],],
      areaSpecialization: [null, [Validators.maxLength(40), Validators.pattern('^[a-zA-Z ]*$')],],
      homePhone: [null, [Validators.maxLength(25), Validators.pattern('^[0-9]*$')],],
      officePhone: [null, [Validators.maxLength(25), Validators.pattern('^[0-9]*$')],],
      cellPhone: [null, [Validators.maxLength(25), Validators.pattern('^[0-9]*$')],],
      email1: [null, [Validators.maxLength(50)],],
      email2: [null, [Validators.maxLength(50)],],
      refferedBy: [null, [Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')],],
      comments: [null, [Validators.maxLength(255), Validators.pattern('^[a-zA-Z ]*$')],],
      dsemail: [null, [Validators.maxLength(50),Validators.pattern('^[0-9]*$')],],
      linkedIn: [null, [Validators.maxLength(200), Validators.pattern('^[a-zA-Z ]*$')],],
      AccEmpId: [null, [Validators.maxLength(30), Validators.pattern('^[0-9]*$')],],

    })
    this.editContactForm = this.fb.group({
      editTitle: [null, [Validators.maxLength(40), Validators.pattern('^[a-zA-Z ]*$')],],
      editFName: [null, [Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')],],
      editAreaSpecialization: [null, [Validators.maxLength(40), Validators.pattern('^[a-zA-Z ]*$')],],
      editCellPhone: [null, [Validators.maxLength(25), Validators.pattern('^[0-9]*$')],],
      editCStatus: [null, [Validators.maxLength(1), Validators.pattern('^[a-zA-Z ]*$')],],
      editEmail1: [null, [Validators.maxLength(50)],],
      editComments: [null, [Validators.maxLength(255), Validators.pattern('^[a-zA-Z ]*$')],],

    })
    this.getAllContacts()
  }

  contactStatus =[
    {label:'Active',value:'A'},
    {label:'InActive',value:'I'}
    ]

    contactGender =[
      {label:'Male',value:'Male'},
      {label:'Female',value:'Female'}
      ]
  Contactstatus = {
    A: 'Active',
    I: 'Inactive',

  }
  // Get the contact data to display the grid and also search
  getAllContacts() {
    const sFirstName = this.searchForm.controls.searchName.value
    const sareaSpecialization = this.searchForm.controls.searchSpecialization.value
    const sStatus = this.searchForm.controls.searchStatus.value
    let body = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      accountId: this.accountId,
      contactStatus: sStatus,
      areaSpecialization: sareaSpecialization,
      firstName: sFirstName
    }
    console.log(body)
    this.dataService.post(apis.getContactData, body).subscribe((res: any) => {
      this.contactTableData = res[0].data
      this.totalPages = res[0].count
      this.records = res[0].count

      console.log('Contact data.....', this.contactTableData)

    })

  }

  // This method is save the contacts
  addContact() {
    this.addModel = true
  }
  saveContact() {
    this.addModel = true
    if (this.addContactForm.untouched || this.addContactForm.invalid) {
      this.addModel = true
      this.submitAdd()
    }
    if (this.addContactForm.valid) {
      let body = {
        accountId: this.accountId,
        contactStatus: this.addContactForm.get('cStatus').value,
        loginId: "jchukkala1",
        password: "miracle@123",
        lastName: this.addContactForm.get('lName').value,
        firstName: this.addContactForm.get('fName').value,
        middleName: this.addContactForm.get('mName').value,
        aliasName: this.addContactForm.get('aName').value,
        salutation: this.addContactForm.get('salutation').value,
        title: this.addContactForm.get('title').value,
        primaryAddressId: this.addContactForm.get('pAddressid').value,
        secondaryAddressId: this.addContactForm.get('sAddressid').value,
        gender: this.addContactForm.get('gender').value,
        dob: this.addContactForm.get('dob').value,
        doa: this.addContactForm.get('doa').value,
        leadSource: this.addContactForm.get('leadScore').value,
        areaSpecialization: this.addContactForm.get('areaSpecialization').value,
        homePhone: this.addContactForm.get('homePhone').value,
        officePhone: this.addContactForm.get('officePhone').value,
        cellPhone: this.addContactForm.get('cellPhone').value,
        fax: "1133",
        email1: this.addContactForm.get('email1').value,
        email2: this.addContactForm.get('email2').value,
        referredBy: this.addContactForm.get('refferedBy').value,
        comments: this.addContactForm.get('comments').value,
        createdBy: this.userName,
        modifiedBy: "",
        modifiedDate: "",
        dontSendEmail: this.addContactForm.get('dsemail').value,
        linkedIn: this.addContactForm.get('linkedIn').value,
        lastActivityDate: "2020-12-11",
        accountEmployeeId: this.addContactForm.get('AccEmpId').value,
        lastSync: "2020-12-11"
      }
      console.log(body)
      this.dataService.post(apis.contactInsert, body).subscribe((res: any) => {
        console.log('Insert Responce', res)
        this.getAllContacts()
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
      this.addContactForm.reset()

    }
  }

  //This method is patch the values 
  editContact(data) {
    this.editModel = true;
    this.editContactForm.get('editTitle').patchValue(data.title)
    this.editContactForm.get('editFName').patchValue(data.firstName)
    this.editContactForm.get('editAreaSpecialization').patchValue(data.areaSpecialization)
    this.editContactForm.get('editCellPhone').patchValue(data.cellPhone)
    this.editContactForm.get('editCStatus').patchValue(data.contactStatus)
    this.editContactForm.get('editEmail1').patchValue(data.email1)
    this.editContactForm.get('editComments').patchValue(data.comments)
    this.editId = data.id
  }
  // This method is Update the contact
  updateContact() {
    this.editModel = true;
    if (this.editContactForm.untouched || this.editContactForm.invalid) {
      this.editModel = true
      this.submitUpdate()
    }
    if (this.editContactForm.valid) {
      let body = {
        id: this.editId,
        accountId: this.accountId,
        contactStatus: "A",
        loginId: "jchukkala1",
        password: "miracle@123",
        lastName: "chukkala",
        firstName: this.editContactForm.get('editFName').value,
        middleName: "jhanavi",
        aliasName: "chukkla",
        salutation: "Ch",
        title: this.editContactForm.get('editTitle').value,
        primaryAddressId: "123",
        secondaryAddressId: "456",
        gender: "female",
        dob: "1990-01-12",
        doa: "2019-08-05",
        leadSource: "sprathi",
        areaSpecialization: this.editContactForm.get('editAreaSpecialization').value,
        homePhone: "9638527410",
        officePhone: "1236547890",
        cellPhone: this.editContactForm.get('editCellPhone').value,
        fax: "1133",
        email1: this.editContactForm.get('editEmail1').value,
        email2: "jchukka@gmail.com",
        referredBy: "cpyla",
        comments: this.editContactForm.get('editComments').value,
        createdBy: this.userName,
        modifiedBy: this.userName,
        modifiedDate: "",
        dontSendEmail: "Y",
        linkedIn: "the account is in active state",
        lastActivityDate: "2020-12-11",
        accountEmployeeId: "jchukkala1@miraclesoft.com",
        lastSync: "2020-12-11",
        status: this.editContactForm.get('editCStatus').value
      }
      console.log(body)
      console.log('Update data', body)
      this.dataService.post(apis.contactUpdate, body).subscribe((res: any) => {
        this.Response = res
        if (this.Response.hasOwnProperty('success') === true) {
          this.notification.create(
            'success',
            'Successfully Updated',
            'Your data has been successfully Updated',
          )
          this.getAllContacts()
        } else {
          this.notification.create('error', 'Failed to Updated', 'Your data is failed to Updated ')
        }
      })
      this.editModel = false
      this.editContactForm.reset()
    }
  }
  // This method is delete the contact
  deleteContact(data) {
    this.docid = data.id
    console.log("id", this.docid)
    const data1 = {
      id: data.id,
    }
    this.dataService.post(apis.contactDelete, data1).subscribe((res: any) => {
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
        this.getAllContacts()
      } else {
        this.notification.create('error', 'Failed to Delete', 'Your data is failed to Delete ')
      }
      this.contactTableData.length === 1 ? this.pageNum = this.pageNum - 1 : this.pageNum
      this.getAllContacts()
    })

  }
  cancel() {
    this.addContactForm.reset();
    this.searchForm.reset();
    this.getAllContacts()
    this.addModel = false;
    this.editModel = false;
  }

  gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
  }
  gotoAccounts() {
    this.router.navigate(['/dashboard/accounts'])

  }
  //Pagenation
  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAllContacts()
  }
  onPageSizeChange(data) {
    this.pageSize = data
    this.getAllContacts()
  }
  submitAdd(): void {
    for (const i in this.addContactForm.controls) {
      this.addContactForm.controls[i].markAsTouched()
      this.addContactForm.controls[i].updateValueAndValidity()
    }
  }
  submitUpdate(): void {
    for (const i in this.editContactForm.controls) {
      this.editContactForm.controls[i].markAsTouched()
      this.editContactForm.controls[i].updateValueAndValidity()
    }
  }

}
