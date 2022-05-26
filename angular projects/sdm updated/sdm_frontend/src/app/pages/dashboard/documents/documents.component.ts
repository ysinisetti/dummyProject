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
  previewImage: string | undefined = ''
  previewVisible = false

  handlePreview = async (file: NzUploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!)
    }
    this.previewImage = file.url || file.preview
    this.previewVisible = true
  }

  inputValue1?: string
  options1: Array<{ value: string; category: string; count: number }> = []
  docform: FormGroup
  inputValue?: string
  options: string[] = []
  projectname: any
  logData: any
  listOfData: ItemData[] = []
  isVisible = false
  editVisible = false
  isAddVisible = false
  i = 0

  optionList
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
  listOfColumns: ColumnItem[] = [
    {
      name: 'DOCUMENT NAME',
      width: '200px',
    },
    {
      name: 'OWNER',
      width: '100px',
    },
    {
      name: 'UPLOADED DATE',
      width: '100px',
    },
    {
      name: 'DOCUMENT TYPE',
      width: '150px',
    },
    {
      name: 'ACTION',
      width: '80px',
    },
  ]

  document: any
  projectname1: any
  tableData: any = []
  updateddata: any
  docdata: any = []
  delData: any
  addform: FormGroup
  addDocData: any
  projectId: any
  loginName: any
  selectType: any
  file: File
  multipleFiles = []
  pageNum: any
  pageSize: any
  totalPages: number
  loopFiles = []
  arrayPaths: Array<{ fileNames: string; pathNames: string }> = []
  header = 'Search'
  searchForm: FormGroup
  uplodedDate: string
  name: any
  warningtoaster: boolean = false
  cusName: any
  pathsUploaded = []
  // arrayPaths = []
  records: any
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private dataservice: DataService,
    private notification: NzNotificationService,
    private nzMessageService: NzMessageService,
    private route: Router,
    private http: HttpClient,
    private datePipe: DatePipe,
  ) {}

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Enter') {
      this.getTableData()
      this.pageNum = 1
    }
  }

  gotoHome() {
    this.route.navigate(['/dashboard/allProjects'])
  }

  details() {
    // this.projectname = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.projectname])
  }
  ngOnInit() {
    this.cusName = JSON.parse(sessionStorage.getItem('projectDetails')).CustomerName
    this.projectname = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName
    this.loginName = JSON.parse(sessionStorage.getItem('loginData')).FName
    this.projectId = JSON.parse(sessionStorage.getItem('projectDetails')).Id
    this.pageSize = 10
    this.pageNum = 1
    this.totalPages = 20
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
    this.logData = JSON.parse(sessionStorage.getItem('loginData'))
    this.name = this.logData === null || this.logData === undefined ? '' : this.logData.FName
  }

  getDocTypeData() {
    this.http.get(apis.documenttype).subscribe(res => {
      console.log('dropdown', res)
      this.optionList = res
    })
  }

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
      this.records = this.tableData.length
    })
  }

  showDocument(): void {
    this.isVisible = true
  }

  Save() {
    if (this.warningtoaster === false) {
      this.notification.warning('Upload File', 'Need to upload files')
    }
    const formData = new FormData()
    this.multipleFiles.forEach((x, i) => {
      this.file = new File([''], x['name'])
      this.loopFiles.push(this.file)
    })
    this.loopFiles.forEach(x => {
      formData.append('files', x)
    })
    this.upload(formData)

    this.isAddVisible = false
  }

  upload(formdata) {
    this.arrayPaths = []
    if (this.warningtoaster === true) {
      this.dataservice.post(apis.postDocument, formdata).subscribe((res: any) => {
        console.log(res)
        this.addDocData = res
        this.pathsUploaded = this.addDocData['uploaded files path']
        this.pathsUploaded.forEach(x => {
          this.arrayPaths.push({
            fileNames: x['path']['fileName'],
            pathNames: x['path']['filePath'],
          })
        })
        let apiBody = []
        this.arrayPaths.forEach(x => {
          const obj = {
            projectId: this.projectId,
            security: 'D',
            docType: this.addform.get('doctype').value,
            path: x.pathNames,
            fileName: x.fileNames,
            description: 'no description',
            createdBy: this.loginName,
            modifiedBy: this.loginName,
          }
          apiBody.push(obj)
        })
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
        this.arrayPaths = []
        this.multipleFiles = []
        this.fileList = []
        this.loopFiles = []
        this.addform.reset()
      })
    }
    this.fileList = []
  }

  onSelectType(event) {
    this.selectType = event
  }

  handleCancel(): void {
    this.isVisible = false
  }

  //adding document
  addRow(): void {
    this.isAddVisible = true
  }

  addcancel(): void {
    this.isAddVisible = false
    this.addform.reset()
    this.fileList = []
    console.log('d', this.fileList)
  }

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
      setTimeout(() => {
        this.getTableData()
      }, 2000)
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

  downloadFile(docpath) {
    const newPath = docpath.replace(/\\/g, '/')
    console.log('doc path body', docpath, newPath)
    window.open(apis.downloadDocument + '?' + 'filePath=' + newPath)
  }

  onFileChange(event) {
    this.warningtoaster = true
    if (event.type == 'success') {
      this.multipleFiles.push(event.file)
    }
    // console.log("eve",event)
  }
  Cancel(): void {
    this.isAddVisible = false
  }

  //pagination

  onCurrentPageDataChange(data) {
    this.pageNum = data
    this.getTableData()
  }
  onPageSizeChange(data) {
    console.log('page size change', data)
    this.pageSize = data
    this.pageNum = 1
    this.getTableData()
  }

  onChange(): void {
    this.getTableData()
  }

  resetSearchFields() {
    this.searchForm.reset()
    this.getTableData()
  }
}
