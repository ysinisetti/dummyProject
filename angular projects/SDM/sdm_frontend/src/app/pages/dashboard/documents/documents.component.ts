import { Component, OnInit } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzUploadChangeParam } from 'ng-zorro-antd/upload'
import { Observable, Observer } from 'rxjs'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { DataService } from 'src/app/data.service'
import { DOCUMENT } from '@angular/common'
import { apis } from 'src/app/api'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzUploadFile } from 'ng-zorro-antd/upload'

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
})
export class DocumentsComponent implements OnInit {
  // # drag and drop
  fileList: NzUploadFile[] = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]
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
  ddm: any
  role1 = [
    { label: 'Developer', value: 'D' },
    { label: 'Support', value: 'S' },
    { label: 'Tester', value: 'T' },
    { label: 'HR', value: 'H' },
    { label: 'Operation', value: 'O' },
    { label: 'IT', value: 'I' },
  ]
  optionList1 = [
    { label: 'All', value: 'All' },
    { label: 'Scope', value: 'Scope' },
    { label: 'Architecture', value: 'Architecture' },
    { label: 'Projects', value: 'Projects' },
    { label: 'Requirements', value: 'Requirements' },
    { label: 'Testing', value: 'Testing' },
    { label: 'Data', value: 'Data' },
    { label: 'MileStones', value: 'MileStones' },
    { label: 'Releases', value: 'Releases' },
    { label: 'Tasks', value: 'Tasks' },
    { label: 'Sub Tasks', value: 'Sub Tasks' },
    { label: 'Meetings', value: 'Meetings' },
    { label: 'Defects', value: 'Defects' },
    { label: 'Service Management', value: 'Service Management' },
    { label: 'Risks', value: 'Risks' },
    { label: 'Resources', value: 'Resources' },
    { label: 'SLA', value: 'SLA' },
    { label: 'Escalation Matrix', value: 'Escalation Matrix' },
    { label: 'Infrastructure', value: 'Infrastructure' },
    { label: 'Best Practices', value: 'Best Practices' },
    { label: 'Build Artifacts', value: 'Build Artifacts' },
    { label: 'Runtime Artifacts', value: 'Runtime Artifacts' },
    { label: 'TimeSheets', value: 'TimeSheets' },
    { label: 'Governance', value: 'Governance' },
    { label: 'Status Reports', value: 'Status Reports' },
    { label: 'Calendar', value: 'Calendar' },
  ]

  editCache: { [key: string]: { edit: boolean; data } } = {}

  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {}
  document: any
  arr = []
  duplicateAry: TreeNodeInterface[] = []
  filtered: any[]
  projectname1: any
  editId: any
  tableData: any = []
  listOfMapData: any = []
  editform: FormGroup
  updateddata: any
  id: any
  name: string = ''
  docdata: any = []
  delData: any
  addform: FormGroup
  addDocData: any
  newFile: any

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id)!
          target.expand = false
          this.collapse(array, target, false)
        })
      } else {
        return
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = []
    const array: TreeNodeInterface[] = []
    const hashMap = {}
    stack.push({ ...root, level: 0, expand: false })

    while (stack.length !== 0) {
      const node = stack.pop()!
      this.visitNode(node, hashMap, array)
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node })
        }
      }
    }

    return array
  }

  visitNode(
    node: TreeNodeInterface,
    hashMap: { [id: string]: boolean },
    array: TreeNodeInterface[],
  ): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true
      array.push(node)
    }
  }

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private dataservice: DataService,
    private notification: NzNotificationService,
    private nzMessageService: NzMessageService,
  ) {}

  ngOnInit() {
    this.docform = this.fb.group({
      documentType: [null, Validators.required],
      searchdata: [null, Validators.required],
    })
    this.editform = this.fb.group({
      editName: [null, Validators.required],
      uploadedBy: [null],
      uploadedDate: [null],
      attachment: [null],
    })
    this.addform = this.fb.group({
      addName: [null, Validators.required],
      uploadedBy: [null],
      uploadedDate: new Date(),
      attachment: [null],
    })
    this.duplicateAry = this.tableData
    this.getTableData()
    this.logData = JSON.parse(sessionStorage.getItem('loginData'))
    console.log(this.logData)
    this.name = this.logData === null || this.logData === undefined ? '' : this.logData.FName
  }
  getTableData() {
    const data1 = {
      id: '',
      fileName: '',
      createdDate: '',
      createdBy: '',
    }
    this.dataservice.getById(apis.doc).subscribe((res: any) => {
      console.log(res)
      this.tableData = res

      console.log('table data=======>', this.tableData)
    })
  }

  onSearch(event) {
    this.tableData = this.duplicateAry
    console.log('serach value', event.toLowerCase())
    if (event === '') {
      this.tableData = this.duplicateAry
      console.log('if stmt', this.tableData)
    } else {
      console.log('else stmt', this.arr)

      this.filtered = this.arr.filter(x => {
        const name1 = x.fileName.toLowerCase()
        const owner = x.createdBy.toLowerCase()
        const date = x.createdDate.toLowerCase()

        if (
          name1.includes(event.toLowerCase()) ||
          owner.includes(event.toLowerCase()) ||
          date.includes(event.toLowerCase())
        ) {
          return x
        }
      })
      this.tableData = this.filtered
      this.filtered = []
    }
  }

  sample() {
    this.projectname1 = this.docform.controls.documentType.value.label
    console.log(
      'document type===================================================>',
      this.projectname1,
    )
  }

  // For autocomplete search field  the methods are below
  onChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value
    this.options1 = new Array(this.getRandomInt(5, 15))
      .join('.')
      .split('.')
      .map((_item, idx) => ({
        value,
        category: `${value}${idx}`,
        count: this.getRandomInt(200, 100),
      }))
  }

  // Showing dialog box
  showDocument(): void {
    this.isVisible = true
  }
  // showing edit dialogue
  editData(data): void {
    this.editVisible = true
    console.log('id========>', data.id)
    this.docdata = data.id
    this.editform.get('editName').patchValue(data.fileName)
    this.editform.get('uploadedBy').patchValue(data.createdBy)

    this.editform.get('uploadedDate').patchValue(data.createdDate)
  }

  deleteData(data): void {}
  //Updating the values present in edit dialogue box

  //ADD-FORM: saving details in add form
  Save() {
    const formData = new FormData()
    formData.append('file', this.newFile)
    console.log('form dtaa', formData, this.addform.value.attachment)
    // this.datepipe.transform(this.date, 'YYYY-MM-DD');
    // console.log("addForm", this.addResourceForm.value);

    const dataToAPI = {
      // ResourceTitle: this.addResourceForm.value.fName,
      fileName: this.addform.controls.addName.value,
      createdDate: this.addform.controls.uploadedDate.value,
      createdBy: this.addform.value.uploadedBy,
      path: this.addform.value.attachment,

      security: 'G',

      docType: 'G',
      description: 'usefulinfo',
      modifiedBy: 'Ajay',
      projectId: 1,
    }
    // console.log('--->data to table', dataToAPI)
    this.dataservice.post(apis.postDocument, formData).subscribe((res: any) => {
      console.log(res)
      this.addDocData = res

      setTimeout(() => {
        this.getTableData();
      }, 2000) // Activate after 2 sec.
      // console.log('addDocData data=======>', this.addDocData)
      if (this.addDocData.hasOwnProperty('success') === true) {
        this.notification.create(
          'success',
          'Successfully Added',
          'Your data has been successfully added',
        )
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
      }
    })

    this.isAddVisible = false
    this.addform.reset()
  }
  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`)
    }
  }
  //save method in edit dialogue box
  handleOk1(data): void {
    this.editVisible = false

    console.log('id========>', this.docdata)
    const data1 = {
      id: this.docdata,
      fileName: this.editform.controls.editName.value,
    }
    this.dataservice.updateDocData(apis.doc1, data1).subscribe((res: any) => {
      console.log(res)
      this.updateddata = res
      setTimeout(() => {
        this.getTableData()
      }, 2000) // Activate after 2 sec.
      console.log('update data=======>', this.updateddata)
      if (this.updateddata.hasOwnProperty('success') === true) {
        this.notification.create(
          'success',
          'Successfully Updated',
          'Your data has been successfully updated',
        )
      } else {
        this.notification.create('error', 'Failed to Update', 'Your data is failed to update ')
      }
    })
  }
  handleCancel1(): void {
    this.editVisible = false
  }
  // Downloading file

  downloadFile() {}
  handleOk(): void {
    console.log('Button ok clicked!')
    this.isVisible = false
  }

  handleCancel(): void {
    console.log('Button cancel clicked!')
    this.isVisible = false
  }
  private getRandomInt(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.options = value ? [value, value + value, value + value + value] : []
  }

  //adding document
  addRow(): void {
    this.isAddVisible = true

    this.addform.controls.uploadedBy.patchValue(this.name)
  }

  cancel(): void {
    this.nzMessageService.info('click cancel')
  }

  deleteRow(data) {
    this.docdata = data.id
    console.log('docDataID=======================================================>', this.docdata)
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
  onFileChange(event) {
    console.log('eee', event)
    // const file = event.target.files[0];
    this.newFile = event.target.files[0]
    console.log('newfile', this.newFile)
    this.addform.get('attachment').setValue('file')
    // console.log("data",file)
  }
  Cancel(): void {
    console.log('Button cancel clicked!')
    this.isAddVisible = false
  }
}
