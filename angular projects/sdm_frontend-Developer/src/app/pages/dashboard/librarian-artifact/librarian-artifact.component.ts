import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { Router, ActivatedRoute } from '@angular/router'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import { HostListener } from '@angular/core'
import { NzUploadFile } from 'ng-zorro-antd/upload'
import { NzNotificationService } from 'ng-zorro-antd/notification'

interface ColumnItem {
  name: string
  width: string
}

@Component({
  selector: 'app-librarian-artifact',
  templateUrl: './librarian-artifact.component.html',
  styleUrls: ['./librarian-artifact.component.scss'],
  providers: [DatePipe],

})
export class LibrarianArtifactComponent implements OnInit {
  pageNum: number = 1
  pageSize: number = 5
  totalPages: number
  allartifactsData = []
  id: any
  selectedAsset: any
  editAssetForm: FormGroup
  alreadyCreatedby: any
  assetStatus: any
  assetType: any
  assetSkillSet: any
  // Table header data
  listOfColumns: ColumnItem[] = [
  {
  name: '#',
  width: '20px'
  },
  {
  name: 'Title',
  width: '100px',
  },
  {
  name: 'Artifact Type',
  width: '100px',
  },
  {
  name: 'File Name',
  width: '70px',
  },
  {
  name: 'Size',
  width: '40px',
  },
  {
  name: 'Modified Date',
  width: '100px',
  },
  {
  name: 'Status',
  width: '70px',
  },
  {
  name: 'Author',
  width: '70px',
  },
  {
  name: 'Action',
  width: '50px',
  },
  ]
  file: File
  // Used to display the Label in grid/table
  dAssetType = {
  F: 'Framework',
  C: 'Code Template',
  V: 'Video',
  G: 'Generator',
  I: 'Generator',
  A: 'Generator',

  }
  dStatus = {
  A: 'Approved',
  I: 'Initiated',
  P: 'In progress',
  D: 'Deprecated',
  }
  artifactType = {
  B: 'Best Practices',
  C: 'Framework',
  D: 'Test Data',
  F: 'FAQ',
  M: 'Common Mistakes',
  R: 'Read Me',
  T: 'Test Script'
  }
  isVisibleAddform: boolean
  addArtifactform: FormGroup
  multipleFiles = []
  artifactTypedrop: any
  editArtifactform: FormGroup
  isVisibleEditform: boolean
  editAft = {}
  // To transform date format
  uplodedDate = this.datePipe.transform(
  new Date(),
  'yyyy-MM-dd',
  )
  fileList: NzUploadFile[] = []
  fileListedit: NzUploadFile[] = []
  replacedPath: Object
  isAftUploaded: boolean
  isReplacedAft: boolean
  // Used to get the searched data by clicking 'Enter key'
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
  if (event.key === 'Enter') {
  // this.getBySearch(),
  this.pageNum = 1
  }
  }
  constructor(
  private fb: FormBuilder,
  private dataService: DataService,
  private notification: NzNotificationService,
  private router: Router,
  private route: ActivatedRoute,
  private datePipe: DatePipe,

  ) { }
  userName = JSON.parse(sessionStorage.getItem('loginData')).LoginId
  ngOnInit(): void {
  var selectedId = this.route.params.subscribe(params => {
  this.id = params['id']
  console.log(this.id)
  })
  this.editAssetForm = this.fb.group({
  author: [null, [Validators.maxLength(25)]],
  skillSet: [null],
  description: [null],
  title: [null, [Validators.required, Validators.maxLength(75)]],
  assetType: [null],
  assetStatus: [null],
  })
  this.addArtifactform = this.fb.group({
  title: [null, [Validators.required, Validators.maxLength(75)]],
  artifactType: [null],
  status: [null],
  description: [null],
  })
  this.editArtifactform = this.fb.group({
  title: [null, [Validators.required, Validators.maxLength(75)]],
  artifactType: [null],
  status: [null],
  description: [null],
  })
  this.getStatus()
  this.getAssetType()
  this.getSkilSet()
  this.artifactsType()
  this.getAssetById()
  this.getAllArtifacts()
  }
  // Used to navigate back to librarian
  gotolibrarian() {
  this.router.navigate(['/dashboard/librarian'])
  }
  // Used to get Status dropDown data
  async getStatus() {
  console.log("in status method", apis.assetStatusLookup)
  await this.dataService.get(apis.assetStatusLookup).subscribe((res) => {
  console.log("status lookup", res);
  this.assetStatus = res;
  })
  }
  // Used to get AssetType dropDown data
  async getAssetType() {
  await this.dataService.get(apis.assetTypeLookUp).subscribe((res) => {
  console.log("asset type lookup", res);
  this.assetType = res;
  })
  }
  // Used to get skillSet dropDown data
  async getSkilSet() {
  await this.dataService.get(apis.assetSkillSetLookUp).subscribe((res) => {
  console.log("skillset lookup", res);
  this.assetSkillSet = res;
  })
  }
  // Used to get grid data
  async getAllArtifacts() {
  const body = {
  pageNum: this.pageNum,
  pageSize: this.pageSize,
  assetId: this.id
  }
  await this.dataService.post(apis.getArtifacts, body).subscribe((res) => {
  console.log("artifact by id", res, res['title']);
  this.totalPages = res[0].count;
  this.allartifactsData = res[0].data;
  console.log("aaaa", this.allartifactsData)
  })
  }
  // used to get the artifactsType dropDown data
  async artifactsType() {
  await this.dataService.get(apis.artifacttypeLookup).subscribe((res) => {
  console.log("artifact dropdown", res);
  this.artifactTypedrop = res;
  })
  }
  // used to get the asset data by id
  async getAssetById() {
  await this.dataService.getAssetsById(apis.assetbyid, this.id).subscribe((res: any) => {
  console.log("assets by id data", res);
  this.selectedAsset = res[0];
  this.alreadyCreatedby = res[0].createdBy;
  this.editAssetForm.get('author').patchValue(res[0].author)
  console.log("skill set data again", this.assetSkillSet)
  this.editAssetForm.get('skillSet').patchValue(res[0].skillSet == null || res[0].skillSet === "" ||
  res[0].skillSet === undefined ? null : this.assetSkillSet.filter(x => x.optionKey === res[0].skillSet)[0].optionKey)
  this.editAssetForm.get('description').patchValue(res[0].description)
  this.editAssetForm.get('title').patchValue(res[0].title)
  this.editAssetForm.get('assetType').patchValue(res[0].assetType == null || res[0].assetType === "" ||
  res[0].assetType === undefined ? null : this.assetType.filter(x => x.optionKey === res[0].assetType)[0].optionKey)
  this.editAssetForm.get('assetStatus').patchValue(res[0].assetStatus == null || res[0].assetStatus === "" ||
  res[0].assetStatus === undefined ? null : this.assetStatus.filter(x => x.optionKey === res[0].assetStatus)[0].optionKey)
  })
  }
  // Used to check the mandatory fields
  submiteditAsset() {
  for (const i in this.editAssetForm.controls) {
  this.editAssetForm.controls[i].markAsTouched()
  this.editAssetForm.controls[i].updateValueAndValidity()
  }
  }
  // Used to update-asset by clicking update button
  updateAsset() {
  if (this.editAssetForm.untouched || this.editAssetForm.invalid) {
  // this.isVisibleAddform = true
  this.submiteditAsset()
  }
  if (this.editAssetForm.valid) {
  const assType = this.editAssetForm.controls.assetType.value
  const assTitle = this.editAssetForm.controls.title.value
  const assSkillset = this.editAssetForm.controls.skillSet.value
  const desc = this.editAssetForm.controls.description.value
  const assStatus = this.editAssetForm.controls.assetStatus.value
  console.log("update", this.selectedAsset)
  let body = {
  "author": this.userName,
  "approvedBy": this.selectedAsset.approvedBy,
  "description": desc === null || desc === undefined || desc === '' ? "NA" : desc,
  "title": this.editAssetForm.controls.title.value,
  "assetType": assType === null || assType === undefined ? "" : assType,
  "approvedDate": this.selectedAsset.approvedDate,
  "alRoleId": this.selectedAsset.alRoleId,
  "deprecatedDate": this.selectedAsset.deprecatedDate,
  "createdBy": this.selectedAsset.createdBy,
  "modifiedDate": this.uplodedDate,
  "modifiedBy": this.selectedAsset.modifiedBy,
  "skillSet": assSkillset === null || assSkillset === undefined ? "" : assSkillset,
  "assetStatus": assStatus === null || assStatus === undefined ? "" : assStatus,
  "id": this.id,
  "fileName": this.selectedAsset.fileName,
  "path": this.selectedAsset.path
  }
  console.log("update body", body)
  this.dataService.post(apis.updateAsset, body).subscribe((res) => {
  console.log(res)
  if (res.hasOwnProperty('success')) {
  this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
  } else {
  this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
  }
  // this.editAssetForm.reset()
  })
  }
  }
  // Used to open a model by clicking add button
  addRow() {
  this.isVisibleAddform = true
  }
  // Used to check the mandatory fields
  submitAdd(): void {
  for (const i in this.addArtifactform.controls) {
  this.addArtifactform.controls[i].markAsTouched()
  this.addArtifactform.controls[i].updateValueAndValidity()
  }
  }
  //Used to add artifacts by clicking save button in Add Librarian Artifact modal
  addArtifact() {
  if (this.addArtifactform.untouched || this.addArtifactform.invalid) {
  this.isVisibleAddform = true
  this.submitAdd()
  }
  if (this.addArtifactform.valid) {
  if (this.isAftUploaded) {
  const formData = new FormData()
  let arrayPaths: Array<{ fileNames: string; pathNames: string; size: number }> = []
  this.multipleFiles.forEach(x => {
  formData.append('files', x)
  })
  let desc = this.addArtifactform.get('description').value
  let type = this.addArtifactform.get('artifactType').value
  let status = this.addArtifactform.get('status').value
  const obj =
  {
  artifactType: type === null || type === undefined ? "" : type,
  author: this.userName,
  approvedBy: "",
  description: desc === null || desc === undefined || desc === '' ? "NA" : desc,
  title: this.addArtifactform.get('title').value,
  approvedDate: this.uplodedDate,
  deprecatedDate: this.uplodedDate,
  createdBy: this.userName,
  assetId: this.id,
  modifiedDate: this.uplodedDate,
  modifiedBy: this.userName,
  artifactStatus: status === null || status === undefined ? "" : status,
  }
  formData.append('data', new Blob([JSON.stringify(obj)],
  {
  type: "application/json"
  }));
  console.log("body insert", obj)
  this.dataService.post(apis.postartifacts, formData).subscribe(res => {
  console.log("res post ", res)
  if (res.hasOwnProperty('success')) {
  this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
  } else {
  this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
  }
  this.getAllArtifacts()
  this.addArtifactform.reset()
  })
  }
  else {
  this.notification.warning('Warning', 'Please upload artifact')
  }
  this.isVisibleAddform = false
  this.multipleFiles = []
  this.fileList = []
  }
  // this.addArtifactform.reset()
  }
  // Used to close Modal by clicking cancle
  cancelArtifact() {
  this.isVisibleAddform = false
  this.isVisibleEditform = false
  this.addArtifactform.reset()
  this.fileListedit = []
  this.fileList = []
  }

  // Used to delete row based on id
  deleteRow(Id) {
  const body = {
  id: Id
  }
  this.dataService.post(apis.deleteArtifact, body).subscribe(res => {
  console.log("delete res", res)
  this.allartifactsData.length === 1 ? this.pageNum = this.pageNum - 1 : this.pageNum
  if (res.hasOwnProperty('Result')) {
  this.notification.create('success', 'Successfully Deleted', 'Record deleted successfully')
  } else {
  this.notification.create('error', 'Not Deleted', 'Record not deleted')
  }
  this.getAllArtifacts()
  })
  }
  // Used for upload
  onFileChange($event: { file: NzUploadFile }): void {
  console.log("event file upload", $event)
  if ($event['type'] == "removed") {
  let index = this.multipleFiles.findIndex(x => x.name === $event.file.originFileObj.name);
  console.log("index ", index)
  if (index >= 0) {
  this.multipleFiles.splice(index, 1)
  }
  }
  if ($event.file.status == "done") {
  this.isAftUploaded = true
  this.multipleFiles.push($event.file.originFileObj)
  console.log($event.file.originFileObj, this.multipleFiles)
  }
  }
  // Used to open model with binded values
  editRow(editData) {
  this.isVisibleEditform = true
  console.log("eidt id", editData)
  this.editArtifactform.get('title').patchValue(editData['title'])
  this.editArtifactform.get('artifactType').patchValue(editData['artifactType'] == null || editData['artifactType'] === "" ||
  editData['artifactType'] === undefined ? null : this.artifactTypedrop.filter(x => x.optionKey === editData['artifactType'])[0].optionKey)
  this.editArtifactform.get('description').patchValue(editData['description'])
  this.editArtifactform.get('status').patchValue(editData['artifactStatus'] === null || editData['artifactStatus'] === "" ||
  editData['artifactStatus'] === undefined ? null : this.assetStatus.filter(x => x.optionKey === editData['artifactStatus'])[0].optionKey)
  this.editAft = editData
  }
  // Used to update Artifact by clicking update in modal
  editArtifact() {
  if (this.editArtifactform.untouched || this.editArtifactform.invalid) {
  this.isVisibleEditform = true
  this.submitAdd()
  }
  if (this.editArtifactform.valid) {
  this.fileListedit = []
  const desc = this.editArtifactform.get('description').value
  const type = this.editArtifactform.get('artifactType').value
  const status = this.editArtifactform.get('status').value
  let editBody = {
  "artifactType": type === null || type === undefined ? "" : type,
  "author": this.editAft['author'],
  "approvedBy": this.editAft['approvedBy'],
  "description": desc === null || desc === undefined || desc === '' ? "NA" : desc,
  "title": this.editArtifactform.get('title').value,
  "approvedDate": this.editAft['approvedDate'],
  "deprecatedDate": this.editAft['deprecatedDate'],
  "createdBy": this.editAft['createdBy'],
  "assetId": this.editAft['assetId'],
  "modifiedDate": this.uplodedDate,
  "modifiedBy": this.userName,
  "id": this.editAft['id'],
  "artifactStatus": status === null || status === undefined ? "" : status,
  }

  if (this.isReplacedAft) {
  const model = {
  path: this.editAft['path'],
  fileName: this.editAft['fileName']
  }
  console.log("model", model)
  const formData = new FormData
  formData.append('file', this.file);
  formData.append('data', new Blob([JSON.stringify(model)],
  {
  type: "application/json"
  }));
  this.dataService.post(apis.uploadDocument, formData).subscribe(res => {
  console.log("res", res)
  this.replacedPath = res['filePath']
  editBody['fileName'] = res['success'] == true ? res['fileName'] : this.editAft['fileName']
  editBody['path'] = res['success'] == true ? res['filePath'] : this.editAft['path']
  editBody['size'] = res['success'] == true ? res['size'] : this.editAft['size']
  console.log("edit body ", editBody, res['success'] == true)
  if (res['success'] == true)
  this.updateArtifact(editBody)
  else
  this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
  })
  }
  else {
  editBody['fileName'] = this.editAft['fileName']
  editBody['path'] = this.editAft['path']
  console.log("edit body ", editBody)
  this.updateArtifact(editBody)
  }
  this.isVisibleEditform = false
  this.isReplacedAft = false
  }
  }
  // Calls based on conditions in above method
  updateArtifact(body) {
  this.dataService.post(apis.updateArtifact, body).subscribe(res => {
  console.log("update res", res)
  if (res.hasOwnProperty('success')) {
  this.notification.create('success', 'Successfully Updated', 'Record updated successfully')
  } else {
  this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
  }
  this.getAllArtifacts()

  })
  }
  onFileReplace($event) {
  console.log($event)
  switch ($event.file.status) {
  case 'uploading':
  console.log($event)
  break
  case 'done':
  console.log($event.file.originFileObj)
  this.isReplacedAft = true
  this.file = $event.file.originFileObj
  }
  }
  // Navigates to allProjects by clciking breadCrum
  gotoHome() {
  this.router.navigate(['/dashboard/allProjects'])
  }
  // details() {
  // // this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  // }
  // clickOnAdd() {
  // this.router.navigate(['/dashboard/LibrarianAssectDetails'])
  // }
  // Below 2 methods are used for pagenation
  onPageSizeChange(data) {
  this.pageSize = data
  this.getAllArtifacts()
  }
  onCurrentPageDataChange(data) {
  this.pageNum = data
  this.getAllArtifacts()
  }
  //Used to Download by clicking download button
  downloadFile(path, name) {
  const newPath = path.replace(/\\/g, '/') + '/' + name
  console.log('doc path body', path, newPath)
  // this.dataService.post(apis.downloadArtifact, )
  window.open(apis.downloadArtifact + '?' + 'filePath=' + newPath)
  }
 }
