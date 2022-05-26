import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { apis } from 'src/app/api'
import { DataService } from 'src/app/data.service'
import { Router } from '@angular/router'
import { NzSelectSizeType } from 'ng-zorro-antd/select'
import { HostListener } from '@angular/core'
import { NzUploadFile } from 'ng-zorro-antd/upload'
import { NzNotificationService } from 'ng-zorro-antd/notification'

interface ColumnItem {
  name: string
  width: string
}

@Component({
  selector: 'app-librarian',
  templateUrl: './librarian.component.html',
  styleUrls: ['./librarian.component.scss'],
  providers: [DatePipe],
})
export class LibrarianComponent implements OnInit {
    pageNum: number = 1
    pageSize: number = 5
    totalPages: number
    librarianForm: FormGroup
    addAssetform: FormGroup
    assetsData: any
    openAddAssetform: boolean
    assetSkillSet: any
    assetStatusdata: any
    assetType: any
    header = "Search"
    // Table header data
    listOfColumns: ColumnItem[] = [
    {
    name: '#',
    width: '20px'
    },
    {
    name: 'Asset Title',
    width: '80px',
    },
    {
    name: 'Skillset',
    width: '80px',
    },
    {
    name: 'Asset Type',
    width: '70px',
    },
    {
    name: 'Created Date',
    width: '80px',
    },
    {
    name: 'Author',
    width: '70px',
    },
    {
    name: 'Status',
    width: '70px',
    },
    {
    name: 'Action',
    width: '50px',
    },
    ]
    // To transform date format
    currentDate = this.datePipe.transform(
    new Date(),
    'yyyy-MM-dd',
    )
    // Used to get the searched data by clicking 'Enter key'
    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: any) {
    if (event.key === 'Enter') {
    this.getAssetsBySearch(),
    this.pageNum = 1
    }
    }
    constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notification: NzNotificationService,
    private router: Router,
    private datePipe: DatePipe,
    ) { }
    loginName = JSON.parse(sessionStorage.getItem('loginData')).LoginId
    ngOnInit(): void {
    this.librarianForm = this.fb.group({
    assetTitle: [null, [Validators.required, Validators.maxLength(75)]],
    skillSet: [null, [Validators.required]],
    assetType: [null, [Validators.required]],
    author: [null, [Validators.required, Validators.maxLength(25)]],
    })
    this.addAssetform = this.fb.group({
    title: [null, [Validators.required, Validators.maxLength(75)]],
    assetSkillset: [null],
    assetType: [null],
    assetStatus: [null],
    description: [null]
    })
    this.getSkilSet()
    this.getStatus()
    this.getAssetType()
    this.getAssetsBySearch()
    }
    // Used to display the Label in grid/table
    dAssetType = {
    F: 'Framework',
    C: 'Code Template',
    V: 'Video',
    G: 'Generator',
    }
    dStatus = {
    A: 'Approved',
    I: 'Initiated',
    P: 'In progress',
    D: 'Deprecated',
    }
    skillset = {
    A: 'UxDesigner',
    A1: 'HR Manager',
    B: 'UxDeveloperAngular',
    B1: 'Management',
    C: 'UxDashboardsReports',
    C1: 'Project Manager',
    D: 'UxMenuSecurity',
    D1: 'Sales',
    E: 'UxQualityEngineer',
    E1: 'Recruiter',
    F: 'UxChatBots',
    F1: 'Marketing',
    G: 'BxIntegrator',
    G1: 'Finance',
    H: 'BxTLDeveloper',
    H1: 'Immigration',
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
    Z: 'SAP PI/PO'

    }
    // used to get the skill-set dropdown data
    getSkilSet() {
    this.dataService.get(apis.assetSkillSetLookUp).subscribe((res) => {
    console.log("skill set", res);
    this.assetSkillSet = res;
    })
    }
    // used to get the status dropdown data in Add Librarian Asset
    getStatus() {
    this.dataService.get(apis.assetStatusLookup).subscribe((res) => {
    console.log("status look", res);
    this.assetStatusdata = res;
    })
    }
    // used to get the asset-type dropdown data
    getAssetType() {
    this.dataService.get(apis.assetTypeLookUp).subscribe((res) => {
    console.log("asset type", res);

    this.assetType = res;
    })
    }
    // Used to search/filter the records in grid
    getAssetsBySearch() {
    const assetType = this.librarianForm.controls.assetType.value
    const author = this.librarianForm.controls.author.value
    const skillSet = this.librarianForm.controls.skillSet.value
    const assetTitle = this.librarianForm.controls.assetTitle.value
    let reqBody = {
    "pageNum": this.pageNum,
    "pageSize": this.pageSize,
    "assetType": assetType === null || assetType === undefined ? '' : assetType,
    "author": author === null || author === undefined ? '' : author,
    "skillSet": skillSet === null || skillSet === undefined ? '' : skillSet,
    "title": assetTitle === null || assetTitle === undefined ? '' : assetTitle
    }
    console.log("req body", reqBody)
    this.dataService.post(apis.getallAssetsBySearch, reqBody).subscribe((res) => {
    console.log("res", res)
    this.totalPages = res[0].count;
    this.assetsData = res[0].data;
    })
    }
    // Used to open the modal box by clicking Add button
    // addnew() {
    // this.openAddAssetform = true
    // }
    // Used to close the model box by clicking Cancle button in modal
    Cancel() {
    this.openAddAssetform = false;
    this.addAssetform.reset()
    }
    // Used to delete the specific row in grid/table based on Row-id
    deleteRow(id) {
    let dId = {
    "id": id
    }
    console.log("id", dId)
    this.dataService.post(apis.deleteAsset, dId).subscribe((res) => {
    console.log("delete", res)
    this.assetsData.length === 1 ? this.pageNum = this.pageNum - 1 : this.pageNum
    if (res.hasOwnProperty('Result')) {
    this.notification.create('success', 'Successfully Deleted', 'Record deleted successfully')
    } else {
    this.notification.create('error', 'Not Deleted', 'Make sure all artifacts are deletedin the asset')
    }
    this.getAssetsBySearch()
    })
    }
    // used for back navigation
    gotoHome() {
    this.router.navigate(['/dashboard/allProjects'])
    }
    // Used to reset the form
    resetLibarian() {
    this.librarianForm.reset()
    this.getAssetsBySearch()
    }
    // Used to open the modal box by clicking Add button
    clickOnAdd() {
    this.openAddAssetform = true;
    }
    // Navigates to librarianArtifact screen by clicking edit button in table based on id
    editAsset(id) {
    this.router.navigate(['/dashboard/librarianArtifact', id])
    }
    // Below 2 methods are used for pagenation
    onPageSizeChange(data) {
    this.pageSize = data
    this.getAssetsBySearch()
    }
    onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getAssetsBySearch()
    }
    // Used to download file
    downloadFile(id) {
    window.open(apis.multipleDownload + '/' + id)
    }
    // Used to validate mandatory fields
    submitaddAsset() {
    for (const i in this.addAssetform.controls) {
    this.addAssetform.controls[i].markAsTouched()
    this.addAssetform.controls[i].updateValueAndValidity()
    }
    }
    // Used to add LibrarianAsset
    addLibrarian() {
    if (this.addAssetform.untouched || this.addAssetform.invalid) {
    this.openAddAssetform = true
    this.submitaddAsset()
    }
    if (this.addAssetform.valid) {
    const assType = this.addAssetform.controls.assetType.value
    const assTitle = this.addAssetform.controls.title.value
    const assSkillset = this.addAssetform.controls.assetSkillset.value
    const desc = this.addAssetform.controls.description.value
    const assStatus = this.addAssetform.controls.assetStatus.value

    const apiBody = [
    {
    "alRoleId": "R",
    "approvedBy": "",
    "approvedDate": this.currentDate,
    "assetStatus": assStatus === null || assStatus === undefined ? "" : assStatus,
    "assetType": assType === null || assType === undefined ? "" : assType,
    "author": this.loginName,
    "createdBy": this.loginName,
    "deprecatedDate": this.currentDate,
    "description": desc === null || desc === undefined || desc === '' ? "NA" : desc,
    "modifiedBy": this.loginName,
    "modifiedDate": this.currentDate,
    "skillSet": assSkillset === null || assSkillset === undefined ? "" : assSkillset,
    "title": assTitle === null || assTitle === undefined || assTitle === '' ? "NA" : assTitle,
    }
    ]
    console.log("body ", apiBody)
    this.dataService.post(apis.addAsset, apiBody).subscribe((res) => {
    console.log(res)
    if (res.hasOwnProperty('success')) {
    this.notification.create('success', 'Successfully Added', 'Record inserted successfully')
    } else {
    this.notification.create('error', 'Failed to Update', 'Your data is failed to add')
    }
    this.getAssetsBySearch()
    })
    this.openAddAssetform = false;
    this.addAssetform.reset()
    }
    }
   }
