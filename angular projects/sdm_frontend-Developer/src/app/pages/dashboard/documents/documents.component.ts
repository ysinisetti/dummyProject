import { Component, OnInit } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzUploadChangeParam } from 'ng-zorro-antd/upload'
import { Observable, Observer, Subject } from 'rxjs'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { DataService } from 'src/app/data.service'
import { apis } from 'src/app/api'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzUploadFile } from 'ng-zorro-antd/upload'
import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table'
import { HostListener } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { DatePipe } from '@angular/common'

export interface TreeNodeInterface {
  id: string
 name: string
 age?: string
 filesize?: string
 level?: number
 expand?: boolean
 address?: string
 children?: TreeNodeInterface[]
 parent?: TreeNodeInterface
}

interface ColumnItem {
 name: string
 width: string
 sortOrder?: NzTableSortOrder
 sortFn?: NzTableSortFn
 sortDirections?: NzTableSortOrder[]
}

interface ItemData {
 id: string
 name: string
 age: string
 address: string
}

// # Drag and Drop
function getBase64(file: File): Promise<string | ArrayBuffer | null> {
 return new Promise((resolve, reject) => {
 const reader = new FileReader()
 reader.readAsDataURL(file)
 reader.onload = () => resolve(reader.result)
 reader.onerror = error => reject(error)
 })
}
@Component({
 selector: 'app-documents',
 templateUrl: './documents.component.html',
 styleUrls: ['./documents.component.scss'],
 providers: [DatePipe],
})
export class DocumentsComponent implements OnInit {
 // # drag and drop
 fileList: NzUploadFile[] = []
 projectname: any
 isAddVisible = false
 optionList
 // Used to display Labels in grid
 documentType = {
 A: 'All',
 S: 'Scope',
 Z: 'Architecture',
 P: 'Projects',
 R: 'Requirements',
 T: 'Testing',
 D: 'Data',
 M: 'MileStones',
 Y: 'Releases',
 Q: 'Tasks',
 X: 'Sub Tasks',
 W: 'Meetings',
 V: 'Defects',
 U: 'Service Management',
 O: 'Risks',
 N: 'Resources',
 K: 'SLA',
 E: 'Escalation Matrix',
 I: 'Infrastructure',
 H: 'Best Practices',
 B: 'Build Artifacts',
 F: 'Runtime Artifacts',
 J: 'TimeSheets',
 G: 'Governance',
 L: 'Status Reports',
 C: 'Calendar',
 }
 // Table header data
 listOfColumns: ColumnItem[] = [
 {
 name: '#',
 width: '30px'
 },
 {
 name: 'Document Name',
 width: '200px',
 },
 {
 name: 'Owner',
 width: '100px',
 },
 {
 name: 'Uploaded Date',
 width: '100px',
 },
 {
 name: 'Document Type',
 width: '150px',
 },
 {
 name: 'Action',
 width: '80px',
 },
 ]

 tableData: any = []
 docdata: any = []
 delData: any
 addform: FormGroup
 addDocData: any
 projectId: any
 loginName: any
 selectType: any
 multipleFiles = []
 pageSize = 5
 pageNum = 1
 totalPages = 20
 header = 'Search'
 searchForm: FormGroup
 warningtoaster: boolean = false
 cusName: any
 records: any
 constructor(
 private fb: FormBuilder,
 private dataservice: DataService,
 private notification: NzNotificationService,
 private route: Router,
 private http: HttpClient,
 private datePipe: DatePipe,
 ) { }
 // Used to get the searched data by clicking 'Enter key'
 @HostListener('window:keydown', ['$event'])
 keyboardInput(event: any) {
 if (event.key === 'Enter') {
 this.getTableData()
 this.pageNum = 1
 }
 }
 // Navigates to allProjects by clicking home in breadCrumb
 gotoHome() {
 this.route.navigate(['/dashboard/allProjects'])
 }
 // Navigates to projectDetails by clicking in breadCrumb
 details() {
 // this.projectname = sessionStorage.getItem('pName')
 this.route.navigate(['/dashboard/projectDetails', this.projectname])
 }
 ngOnInit() {
 this.cusName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
 this.projectname = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
 this.loginName = JSON.parse(sessionStorage.getItem('loginData')).LoginId
 this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
 this.searchForm = this.fb.group({
 searchDOcName: [null],
 searchOwner: [null],
 searchDate: [null],
 searchDocType: [null],
 })

 this.addform = this.fb.group({
 doctype: [null, Validators.required],
 // fileUpload:[Validators.required]
 })
 this.getTableData()
 this.getDocTypeData()
 }
 // Used to get the DocomentType dropdown data
 getDocTypeData() {
 this.http.get(apis.documenttype).subscribe(res => {
 console.log('dropdown', res)
 this.optionList = res
 })
 }
 // Used to get the onload table/grid data
 getTableData() {
 const data1 = {
 id: '',
 fileName: '',
 createdDate: '',
 createdBy: '',
 }
 const uplodedDate = this.datePipe.transform(
 this.searchForm.get('searchDate').value,
 'yyyy-MM-dd',
 )

 const filevalue = this.searchForm.get('searchDOcName').value
 const owner = this.searchForm.get('searchOwner').value
 const doctype = this.searchForm.get('searchDocType').value
 const body = {
 pageNum: this.pageNum,
 pageSize: this.pageSize,
 fileName: filevalue === null || filevalue === undefined ? '' : filevalue,
 createdBy: owner === null || owner === undefined ? '' : owner,
 createdDate: uplodedDate === null || uplodedDate === undefined ? '' : uplodedDate,
 projectId: this.projectId,
 docType: doctype === null || doctype === undefined ? '' : doctype,
 }
 console.log('body', body)
 this.dataservice.post(apis.doc, body).subscribe((res: any) => {
 console.log(res)
 this.tableData = res[0].data
 this.totalPages = res[0].count
 this.records = res[0].count
 })
 }
 // Used to validate mandatory fields
 submitAdd(): void {
 for (const i in this.addform.controls) {
 this.addform.controls[i].markAsTouched()
 this.addform.controls[i].updateValueAndValidity()
 }
 }
 // Used to save the data in model
 Save() {
 if (this.addform.untouched || this.addform.invalid) {
 this.isAddVisible = true
 this.submitAdd()
 }
 if (this.addform.valid) {
 const formData = new FormData()
 this.multipleFiles.forEach(x => {
 formData.append('files', x)
 })
 const obj = {
 createdBy: this.loginName
 }
 formData.append('data', new Blob([JSON.stringify(obj)],
 {
 type: "application/json"
 }));
 this.upload(formData)

 this.isAddVisible = false
 }
 }
 // Used to upload the attachments
 // This method will invoke automatically by clicking save button in model based on conditions
 upload(formdata) {

 let arrayPaths: Array<{ fileNames: string; pathNames: string }> = []
 if (this.warningtoaster === true && this.multipleFiles.length != 0) {
 this.dataservice.post(apis.postDocument, formdata).subscribe((res: any) => {
 console.log(res)
 this.addDocData = res
 let pathsUploaded = this.addDocData['uploaded files']
 pathsUploaded.forEach(x => {
 arrayPaths.push({
 fileNames: x['fileName'],
 pathNames: x['filePath'],
 })
 })
 let apiBody = []
 arrayPaths.forEach(x => {
 const obj = {
 projectId: this.projectId,
 security: 'D',
 docType: this.addform.get('doctype').value,
 path: x.pathNames,
 fileName: x.fileNames,
 description: '',
 createdBy: this.loginName,
 modifiedBy: this.loginName,
 }
 apiBody.push(obj)
 })
 console.log("body ", apiBody)
 if (this.addDocData.hasOwnProperty('success') === true) {
 this.dataservice.post(apis.doc3, apiBody).subscribe(res => {
 console.log('respost', res)
 this.getTableData()
 if (res['success']) {
 this.notification.create(
 'success',
 'Successfully Added',
 'Your data has been successfully added',
 )
 } else {
 this.notification.create(
 'error',
 'Failed to Update',
 'Your data is failed to update ',
 )
 }
 })
 } else {
 this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
 }

 this.fileList = []
 this.addform.reset()
 })
 }
 else {
 this.notification.warning('Warning', 'Upload both document and its type')
 }
 this.warningtoaster = false
 this.fileList = []
 this.multipleFiles = []
 }
 // Used to change the event based on document-type
 onSelectType(event) {
 this.selectType = event
 }

 //adding document
 addRow(): void {
 this.isAddVisible = true
 }
 // Used to close the modal by clicking cancle button
 addcancel(): void {
 this.isAddVisible = false
 this.addform.reset()
 this.multipleFiles = []
 this.fileList = []
 console.log('d', this.fileList)
 }
 // Used to delete the specific row in grid/table based on Row-id
 deleteRow(data) {
 this.docdata = data.id
 console.log('docDataID====================>', this.docdata)
 const data1 = {
 id: data.id,
 }
 console.log('data1', data1)
 this.dataservice.post(apis.doc2, data1).subscribe((res: any) => {
 console.log(res)
 this.delData = res
 this.getTableData()
 if (this.delData.hasOwnProperty('Result') === true) {
 this.notification.create(
 'success',
 'Successfully Deleted',
 'Your data has been successfully deleted',
 )
 }
 })
 console.log('deldata======================>', this.delData)
 }
 // Used to download file by clicking download button
 downloadFile(docpath, name) {
 const newPath = docpath.replace(/\\/g, '/') + name
 console.log('doc path body', docpath, newPath)
 window.open(apis.downloadDocument + '?' + 'filePath=' + newPath)
 }
 // Invoked when we select upload Attachments
 onFileChange($event: { file: NzUploadFile }): void {
 this.warningtoaster = true
 console.log("event file upload", $event)
 if ($event['type'] == "removed") {
 let index = this.multipleFiles.findIndex(x => x.name === $event.file.originFileObj.name);
 console.log("index ", index)
 if (index >= 0) {
 this.multipleFiles.splice(index, 1)
 }
 }
 if ($event.file.status == "done") {
 // $event['fileList'].forEach(x=> this.multipleFiles.push(x))
 this.multipleFiles.push($event.file.originFileObj)
 console.log($event.file.originFileObj, this.multipleFiles)
 }
 }
 // Used to close modal
 Cancel(): void {
 this.isAddVisible = false
 }

 // Below 2 methods are used for pagenation
 onCurrentPageDataChange(data) {
 this.pageNum = data
 this.getTableData()
 }
 onPageSizeChange(data) {
 console.log('page size change', data)
 this.pageSize = data
 this.getTableData()
 }
 // Invokes when we change the document-type dropDown
 onChange(): void {
 this.getTableData()
 }
 // Used to reset fields
 resetSearchFields() {
 this.searchForm.reset()
 this.getTableData()
 }

 submitUploadFiles(): void {
 for (const i in this.addform.controls) {
 this.addform.controls[i].markAsTouched()
 this.addform.controls[i].updateValueAndValidity()
 }
 }
}
