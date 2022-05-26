import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { apis } from 'src/app/api';
@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss'],
})
export class AllProjectsComponent implements OnInit {
  isVisible=false;
  addPojectForm: FormGroup;
  editProjectForm:FormGroup;
  listOfData:any;
  openEditForm=false;
  records:any;
  sDate:any;
  eDate:any;
  visible=false;
 projectName:any;
 customerName:any;
 duration:any;
 startDate:any;
 endDate:any;
 ModifiedDate:any;
  idToBeEdited: any;
 myProjects: any;
  loginId:any;
 totalRecordOnRequest:number
 pageNum:number=1
 pageSize:number=10
 searchTerm:string
 
 constructor(private route : Router,private fb:FormBuilder, private dataService :DataService){}
 
 ngOnInit(){
 
  this.loginId=JSON.parse(sessionStorage.getItem('loginData')).LoginId;
  this.addPojectForm = this.fb.group({
  projectName : ['', [Validators.required, Validators.maxLength(50),Validators.pattern('^[a-zA-z ]*$')]],
  customerName : ['', [Validators.required, Validators.maxLength(50),Validators.pattern('^[a-zA-z ]*$')]],
  id : ['',[Validators.required, Validators.maxLength(3),Validators.pattern('^[0-9]{1,3}$')]],
  startDate : ['', Validators.required],
  endDate : ['', Validators.required],
  description : ['', [Validators.required, Validators.maxLength(225)]],
  practice : ['', Validators.required],
  projectType : ['', Validators.required],
  startDatePlan: ['', Validators.required],
  endDatePlan : ['', Validators.required],
  });
  this.editProjectForm= this.fb.group({
  projectName : ['', [Validators.required, Validators.maxLength(50),Validators.pattern('^[a-zA-z ]*$')]],
  customerName : ['', [Validators.required, Validators.maxLength(50),Validators.pattern('^[a-zA-z ]*$')]],
  startDate : ['', Validators.required],
  endDate : ['', Validators.required ],
  description: ['', [Validators.required, Validators.maxLength(50)]],
  practice : ['', Validators.required],
  projectType : ['', Validators.required],
  startDatePlan: ['', Validators.required],
  endDatePlan : ['', Validators.required],
  });
  this.getAllProjects();
  this.getMyProjects();
 }
 
 open(): void {
  this.visible = true;
 } 
 
 details(SelectedProjectDetails) {
   sessionStorage.setItem('pName', SelectedProjectDetails.ProjectName)
   sessionStorage.setItem('PId', SelectedProjectDetails.Id)
   sessionStorage.setItem('projectDetails', JSON.stringify(SelectedProjectDetails))
   this.route.navigate(['/dashboard/projectDetails', SelectedProjectDetails.ProjectName])
 }
 
 
 
 //////////////////////////////Get All Projects////////////////////////////
 getAllProjects(){
  
  let reqBody = {
     customerName: "",  
     endDate: "",
     startDate: this.searchTerm,
     pageNum: this.pageNum,
     pageSize: this.pageSize,
     projectName: ""
 }
  this.dataService.post(apis.allProjects,reqBody).subscribe((res)=>{
    console.log("res",res)
  this.listOfData=res[0].data;
 //  this.records=res.length;
  });
 }
 
 //////////////////////////////Get MyProjects//////////////////////////////////
 getMyProjects(){
  this.dataService.getUserProjects(apis.getMyProjects,this.loginId).subscribe((res)=>{
  this.myProjects=res;
  console.log(res);
  console.log(this.myProjects);
 
  })
 }
 
 addRow(){
  this.isVisible = true;
  }
 
 handleSubmit1(){
 this.duration=20;
  let addProject={
 "id": this.addPojectForm.controls.id.value,
 "projectName":this.addPojectForm.controls.projectName.value,
 "customerName":this.addPojectForm.controls.customerName.value,
 "duration":this.duration,
 "startDate":this.addPojectForm.controls.startDate.value,
 "endDate":this.addPojectForm.controls.endDate.value,
 "projectDescription" : this.addPojectForm.controls.description.value,
 "practice" : this.addPojectForm.controls.practice.value,
 "projectType" : this.addPojectForm.controls.projectType.value,
 "startDatePlan": this.addPojectForm.controls.startDatePlan.value,
 "endDatePlan" : this.addPojectForm.controls.endDatePlan.value,
 "loginId": this.loginId
 
  }
  this.dataService.post(apis.postNewProject,addProject).subscribe((res)=>{
  this.getAllProjects()
  })
  this.isVisible = false
  this.addPojectForm.reset()
  this.getAllProjects()
 }
 editRow(values){
  this.openEditForm = true;
  this.idToBeEdited =values.Id,
  this.editProjectForm.get('projectName').patchValue(values.ProjectName)
  this.editProjectForm.get('customerName').patchValue(values.CustomerName)
  this.editProjectForm.get('startDate').patchValue(values.StartDate)
  this.editProjectForm.get('endDate').patchValue(values.EndDate)
  this.editProjectForm.get('description').patchValue(values.ProjectDescription)
  this.editProjectForm.get('practice').patchValue(values.Practice)
  this.editProjectForm.get('projectType').patchValue(values.ProjectType)
  this.editProjectForm.get('startDatePlan').patchValue(values.StartDatePlan)
  this.editProjectForm.get('endDatePlan').patchValue(values.EndDatePlan)
 }
 
 updateTask() {
  this.duration=20;
  console.log(this.duration);
 let updated = {
  "id" :this.idToBeEdited,
  "projectName" : this.editProjectForm.controls.projectName.value,
  "customerName" : this.editProjectForm.controls.customerName.value,
  "duration" :this.duration,
  "startDate" :this.editProjectForm.controls.startDate.value,
  "endDate" :this.editProjectForm.controls.endDate.value,
  "projectDescription" :this.editProjectForm.controls.description.value,
  "practice" : this.editProjectForm.controls.practice.value,
  "projectType" : this.editProjectForm.controls.projectType.value,
  "startDatePlan": this.editProjectForm.controls.startDatePlan.value,
  "endDatePlan" : this.editProjectForm.controls.endDatePlan.value,
 }
 this.dataService.post(apis.updateProject,updated).subscribe((res)=>{
  this.getAllProjects()
 })
 
 this.openEditForm = false
 this.editProjectForm.reset()
 this.getAllProjects()
 }
 deleteRow(id){
  let dId ={
  "id":id
  }
 this.dataService.post(apis.deleteProject,dId).subscribe((res)=>{
 this.getAllProjects()
 })
 this.getAllProjects()
 }
 
 handleCancel(): void {
 this.isVisible = false;
 this.openEditForm = false
 this.editProjectForm.reset()
 this.addPojectForm.reset()
 }
 
 //add
 startValue: Date | null = null;
 endValue: Date | null = null;
 endOpen = false;
 endValue1: Date | null = null;
 endOpen1 = false;
 
 disabledStartDate = (startValue: Date): boolean => {
 if (!startValue || !this.endValue) {
 return false;
 }
 return startValue.getTime() > this.endValue.getTime();
 };
 
 disabledEndDate = (endValue: Date): boolean => {
 if (!endValue || !this.startValue) {
 return false;
 }
 return endValue.getTime() <= this.startValue.getTime();
 };
 
 disabledEndDate1 = (endValue1: Date): boolean => {
 if (!endValue1 || !this.startValue) {
 return false;
 }
 return endValue1.getTime() <= this.startValue.getTime();
 };
 
 
 onStartChange(date: Date): void {
 this.startValue = date;
 }
 
 
 onEndChange(date: Date): void {
 this.endValue = date;
 }
 
 onEndChange1(date: Date): void {
 this.endValue1 = date;
 }
 
 handleStartOpenChange(open: boolean): void {
 if (!open) {
 this.endOpen = true;
 }
 console.log('handleStartOpenChange', open, this.endOpen);
 }
 
 handleEndOpenChange(open: boolean): void {
 console.log(open);
 this.endOpen = open;
 }
 
 handleStartOpenChange1(open: boolean): void {
 if (!open) {
 this.endOpen1 = true;
 }
 console.log('handleStartOpenChange', open, this.endOpen1);
 }
 
 
 handleEndOpenChange1(open: boolean): void {
 console.log(open);
 this.endOpen1 = open;
 }
 
 
 /////////Edit Date Picker///////////////////
 endValue5: Date | null = null;
 endOpen5 = false;
 endValue6: Date | null = null;
 endOpen6 = false;
 
 disabledStartDate5 = (startValue: Date): boolean => {
 if (!startValue || !this.endValue5) {
 return false;
 }
 return startValue.getTime() > this.endValue5.getTime();
 };
 
 disabledEndDate5 = (endValue5: Date): boolean => {
 if (!endValue5 || !this.startValue) {
 return false;
 }
 return endValue5.getTime() <= this.startValue.getTime();
 };
 
 disabledEndDate6 = (endValue6: Date): boolean => {
 if (!endValue6 || !this.startValue) {
 return false;
 }
 return endValue6.getTime() <= this.startValue.getTime();
 };
 
 onStartChange5(date: Date): void {
 this.startValue = date;
 }
 
 onEndChange5(date: Date): void {
 this.endValue5 = date;
 }
 
 onEndChange6(date: Date): void {
 this.endValue6 = date;
 }
 
 handleStartOpenChange5(open: boolean): void {
 if (!open) {
 this.endOpen5 = true;
 }
 console.log('handleStartOpenChange', open, this.endOpen5);
 }
 
 handleEndOpenChange5(open: boolean): void {
 console.log(open);
 this.endOpen5 = open;
 }
 
 handleStartOpenChange6(open: boolean): void {
 if (!open) {
 this.endOpen6 = true;
 }
 console.log('handleStartOpenChange', open, this.endOpen6);
 }
 
 handleEndOpenChange6(open: boolean): void {
 console.log(open);
 this.endOpen6 = open;
 }
}
