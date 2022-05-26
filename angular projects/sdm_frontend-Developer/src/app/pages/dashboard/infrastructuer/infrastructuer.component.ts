import { DataService } from './../../../data.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { apis } from 'src/app/api'
import { HostListener } from '@angular/core'
import { DatePipe } from '@angular/common'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
@Component({
 selector: 'app-infrastructuer',
 templateUrl: './infrastructuer.component.html',
 styleUrls: ['./infrastructuer.component.scss'],
 providers: [DatePipe],
})
export class InfrastructuerComponent implements OnInit {
allInfrasDetails: any
isVisible = false
isVisible1 = false
addInfraForm: FormGroup
editInfraForm: FormGroup
searchForm: FormGroup
noteForm: FormGroup
selectedInfraId: any
loggedUserId = JSON.parse(sessionStorage.getItem('loginData')).LoginId
selectedProjectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
userName = JSON.parse(sessionStorage.getItem('loginData')).FName
records: any
ProjectName: string
pageNum: number
pageSize: number
noOfRecords: number
totalPages: number
header = 'Search'
customerName: any
environment: any
os: any
infraType: any
Location: any
values: any
hostName: any
location: any
operatingSystem: any
btnDisabled: boolean

 constructor(
 private fb: FormBuilder,
 private route: Router,
 private notification: NzNotificationService,
 private message: NzMessageService,
 private datePipe: DatePipe,
 private dataService: DataService,
 ) {}

 ngOnInit(): void {
 this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
 this.customerName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
 this.editInfraForm = this.fb.group({
 contactEmailId: [
 null,
 [Validators.maxLength(50), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
 ],
 contactName: [
 null,
 [ Validators.maxLength(50), Validators.pattern('^[a-zA-z ]*$')],
 ],
 description: [
 null,
 [ Validators.maxLength(255), Validators.pattern('^[a-zA-z0-9 ]*$')],
 ],
 environment: [
 null,
 [ Validators.maxLength(2), Validators.pattern('^[a-zA-z]*$')],
 ],
 hostName: [
 null,
 [ Validators.required,Validators.maxLength(20), Validators.pattern('^[a-zA-z0-9.]*$')],
 ],
 infraType: [
 null,
 [Validators.required, Validators.maxLength(2), Validators.pattern('^[a-zA-z]*$')],
 ],
 location: [
 null,
 [ Validators.maxLength(20), Validators.pattern('^[a-zA-z ]*$')],
 ],
 name: [
 null,
 [ Validators.maxLength(30), Validators.pattern('^[a-zA-z ]*$')],
 ],
 operatingSystem: [
 null,
 [ Validators.maxLength(2), Validators.pattern('^[a-zA-z0-9 .]*$')],
 ],
 privateIPAddress: [
 null,
 [
 Validators.maxLength(20),
 Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'),
 ],
 ],
 publicIPAddress: [
 null,
 [
 Validators.maxLength(20),
 Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'),
 ],
 ],
 })
 this.addInfraForm = this.fb.group({
 contactEmailId: [
 null,
 [Validators.maxLength(50), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
 ],
 contactName: [
 null,
 [ Validators.maxLength(50), Validators.pattern('^[a-zA-z ]*$')],
 ],
 description: [
 null,
 [ Validators.maxLength(255), Validators.pattern('^[a-zA-z0-9 ]*$')],
 ],
 environment: [
 null,
 [ Validators.maxLength(2), Validators.pattern('^[a-zA-z]*$')],
 ],
 hostName: [
 null,
 [ Validators.required,Validators.maxLength(20), Validators.pattern('^[a-zA-z0-9 . ]*$')],
 ],
 infraType: [
 null,
 [ Validators.required,Validators.maxLength(2), Validators.pattern('^[a-zA-z]*$')],
 ],
 location: [
 null,
 [ Validators.maxLength(20), Validators.pattern('^[a-zA-z ]*$')],
 ],
 name: [
 null,
 [ Validators.maxLength(30), Validators.pattern('^[a-zA-z ]*$')],
 ],
 operatingSystem: [null, [ Validators.pattern('^[a-zA-z0-9 .]*$')]],
 privateIPAddress: [
 null,
 [
 Validators.maxLength(20),
 Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'),
 ],
 ],
 publicIPAddress: [
 null,
 [
 Validators.maxLength(20),
 Validators.pattern('^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'),
 ],
 ],
 })
 this.searchForm = this.fb.group({
 searchValue: [null],
 searchContact: [null],
 searchType: [null],
 searchLocation: [null],
 })
 this.pageSize = 10
 this.pageNum = 1
 this.totalPages = 10
 this.getAllInfras()
 this.infraTypeDropDown()
 this.LocationDropDown()
 this.environmentDropDown()
 this.osDropDown()
 }

                                                           ////////////Drop down apis////////////////
 infraTypeDropDown(){
 this.dataService.get(apis.infraType).subscribe((res)=>{
 this.infraType=res
 })
 }
 LocationDropDown(){
 this.dataService.get(apis.Location).subscribe((res)=>{
 this.location=res
 })
 }
 environmentDropDown(){
 this.dataService.get(apis.environment).subscribe((res)=>{
 this.environment=res
 })
 }
 osDropDown(){
 this.dataService.get(apis.os).subscribe((res)=>{
 this.os=res
 })
 }

                                                                            ///////////Get all Infra Records

 getAllInfras() {
 const infraType = this.searchForm.controls.searchType.value
 const location = this.searchForm.controls.searchLocation.value
 const contactName = this.searchForm.controls.searchContact.value
 const name = this.searchForm.controls.searchValue.value
 var reqBody = {
 pageNum: this.pageNum,
 pageSize: this.pageSize,
 projectId: JSON.parse(sessionStorage.getItem('projectDetails')).Id,
 infraType: infraType === null || infraType === undefined ? '' : infraType,
 location: location === null || location === undefined ? '' : location,
 contactName: contactName === null || contactName === undefined ? '' : contactName,
 name: name === null || name === undefined ? '' : name,
 }
 this.dataService.post(apis.getAllInfras, reqBody).subscribe(res => {
 this.allInfrasDetails = res[0].data
 this.totalPages = res[0].count
 this.records = res[0].count
 })
 }

 InfraType = {
 V: 'Virtual Server',
 P: 'Physical Server',
 }
 InfraTypes = [
 { label: 'Virtual Server', value: 'V' },
 { label: 'Physical Server', value: 'P' },
 ]
 locations = [
 { label: 'AWS', value: 'A' },
 { label: 'On prem', value: 'O' },
 { label: 'Azure', value: 'Z' },
 ]
 EnvironmentType = {
 l: 'Staging',
 w: 'Dev',
 S: 'Staging',
 D: 'Dev',
 P: 'Prod',
 }
 OperatingSystem = {
 w: 'Windows',
 l: 'Linux',
 M: 'Mac',
 W: 'Windows',
 L: 'Linux',
 }

                                                                        //////////Add a new Infra
 submitAdd(){
  for (const i in this.addInfraForm.controls) {
    this.addInfraForm.controls[i].markAsTouched()
    this.addInfraForm.controls[i].updateValueAndValidity()
  }
 }
 addRow(): void {
 this.isVisible = true
 }
 newInfra() {

  if (this.addInfraForm.untouched) {
    this.isVisible=true
    this.submitAdd()
  }
  if(this.addInfraForm.valid){
let newInfras = {
 contactEmailId: this.addInfraForm.controls.contactEmailId.value,
 contactName: this.addInfraForm.controls.contactName.value,
 createdBy: this.userName,
 description: this.addInfraForm.controls.description.value,
 environment: this.addInfraForm.controls.environment.value,
 hostName: this.addInfraForm.controls.hostName.value,
 infraType: this.addInfraForm.controls.infraType.value,
 location: this.addInfraForm.controls.location.value,
 modifiedBy: this.userName,
 name: this.addInfraForm.controls.name.value,
 operatingSystem: this.addInfraForm.controls.operatingSystem.value,
 privateIPAddress: this.addInfraForm.controls.privateIPAddress.value,
 projectId: this.selectedProjectId,
 publicIPAddress: this.addInfraForm.controls.publicIPAddress.value,
 userId: this.loggedUserId,
 }
 this.btnDisabled = true;
 setTimeout(() => {
 this.btnDisabled = false
 }, 5000);
 this.dataService.post(apis.postInfras, newInfras).subscribe(res => {
 if (res.hasOwnProperty('success') === true) {
 this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
 } else {
 this.notification.create('error', 'Failed to insert', 'Your data is failed to add')
 }
 this.getAllInfras()
 })
 this.isVisible = false
 this.addInfraForm.reset()
 this.getAllInfras()
 }
 }
                                                                       ///////Update/Edit an Infra based on Id////////
 editRow(values): void {
 this.selectedInfraId = values.id
 this.isVisible1 = true
 this.editInfraForm.get('contactEmailId').patchValue(values.contactEmailId)
 this.editInfraForm.get('contactName').patchValue(values.contactName)
 this.editInfraForm.get('description').patchValue(values.description)
 this.editInfraForm.get('hostName').patchValue(values.hostName)
 this.editInfraForm
 .get('environment')
 .patchValue(values.environment === null || values.environment === "" || values.environment === undefined ? null : this.environment.filter(x => x.Value === values.environment)[0].Value)
 this.editInfraForm
 .get('infraType')
 .patchValue(values.infraType === null || values.infraType === "" || values.infraType === undefined ? null : this.infraType.filter(x => x.Value === values.infraType)[0].Value)
 this.editInfraForm
 .get('location')
 .patchValue(values.location === null || values.location === "" || values.location === undefined ? null : this.location.filter(x => x.Value === values.location)[0].Value)
 this.editInfraForm.get('name').patchValue(values.name)
 this.editInfraForm
 .get('operatingSystem')
 .patchValue(values.operatingSystem === null || values.operatingSystem === "" || values.operatingSystem === undefined ? null : this.os.filter(x => x.Value === values.operatingSystem)[0].Value)
 this.editInfraForm.get('privateIPAddress').patchValue(values.privateIPAddress)
 this.editInfraForm.get('publicIPAddress').patchValue(values.publicIPAddress)
 }
 modifyInfra() {
 let updated = {
 contactEmailId: this.editInfraForm.controls.contactEmailId.value,
 contactName: this.editInfraForm.controls.contactName.value,
 createdBy: this.userName,
 description: this.editInfraForm.controls.description.value,
 environment: this.editInfraForm.controls.environment.value,
 hostName: this.editInfraForm.controls.hostName.value,
 id: this.selectedInfraId,
 infraType: this.editInfraForm.controls.infraType.value,
 location: this.editInfraForm.controls.location.value,
 modifiedBy: this.userName,
 name: this.editInfraForm.controls.name.value,
 operatingSystem: this.editInfraForm.controls.operatingSystem.value,
 privateIPAddress: this.editInfraForm.controls.privateIPAddress.value,
 projectId: this.selectedProjectId,
 publicIPAddress: this.editInfraForm.controls.publicIPAddress.value,
 userId: this.loggedUserId,
 }
 this.dataService.post(apis.updateInfras, updated).subscribe(res => {
  this.getAllInfras()

 if (res.hasOwnProperty('success') === true) {
 this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
 } else {
 this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
 }
 })
 this.isVisible1 = false
 this.getAllInfras()
 }

                                                                      ///////// Delete a infra based on Id

 deleteRow(id): void {
 let dId = { id: id }
 this.dataService.post(apis.deleteInfras, dId).subscribe(res => {
  this.allInfrasDetails.length === 1 ? this.pageNum = this.pageNum -1 : this.pageNum
  this.getAllInfras()
 if (res.hasOwnProperty('success') === true) {
 this.notification.create('error', 'Not Deleted', 'Record deleted')
 } else {
 this.notification.create(
 'success',
 'Successfully Deleted',
 'Your data is Deleted successfully',
 )
 }
 this.getAllInfras()
 })

 }

 cancel(): void {
 this.isVisible = false
 this.addInfraForm.reset()
 this.isVisible1 = false
 }
 save(): void {
 this.isVisible = true
 this.isVisible1 = true
 }
                                                                            ///////Pagination
 onCurrentPageDataChange(data) {
 this.pageNum = data
 this.getAllInfras()
 }
 onPageSizeChange(data) {
 this.pageSize = data
 this.pageNum = 1
 this.getAllInfras()
 }

 onChange(): void {
 this.getAllInfras()
 }

 resetSearchFields() {
 this.searchForm.reset()
 this.getAllInfras()
 }

                                                                              /////////////Breadcrumb//////////////////

 gotoHome() {
 this.route.navigate(['/dashboard/allProjects'])
 }

 details() {
 this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
 }
                                                                             ///////BreadCrumb Routing/////////
 dashboard() {
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  } 
}
