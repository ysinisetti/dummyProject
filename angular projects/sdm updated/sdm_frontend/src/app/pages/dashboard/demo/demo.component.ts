import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ViewChild } from '@angular/core'
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree'
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
})
export class DemoComponent implements OnInit {
  contactid: any
  sub: any
  ProjectName: string
  constructor(
    private fb: FormBuilder,
    private nzContextMenuService: NzContextMenuService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  isVisible: boolean
  isConfirmLoading: boolean
  radioData: any
  displaySmsTags: boolean = false
  displayEmailTags: boolean = false
  hideRadioBtns: boolean = true
  isData = false
  seltedPerson = []
  img: any
  optionForm: FormGroup
  isVisible1: boolean
  isVisibleTop = false
  isVisibleMiddle = false
  selectedPerson: any

  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent
  defaultCheckedKeys = ['10020']
  defaultSelectedKeys = ['10010']
  defaultExpandedKeys = ['100', '1001']

  activatedNode?: NzTreeNode
  nodes = [
    {
      //   title: 'Jyothsna S Duvvuri',
      //   key: '100',
      //   author: 'NG ZORRO',
      //   expanded: true,
      //   img: 'assets/chandhu.png',
    },
  ]

  ngOnInit(): void {
    this.optionForm = this.fb.group({
      radioData: [],
      name: [null, Validators.required],
      phone: [null, Validators.required],
      Name: [null, Validators.required, Validators.pattern['A-Za-z']],
      email: [null, Validators.required, Validators.email],
      subject: [null, Validators.required],
      message: [null, Validators.required],
    })
    this.sub = this.route.params.subscribe(params => {
      this.contactid = params['contactid'] // (+) converts string 'id' to a number
      console.log('contactid', this.contactid)

      // In a real app: dispatch action to load the details here.
    })
    this.ProjectName = JSON.parse(sessionStorage.getItem('projectDetails')).ProjectName

    // this.ProjectName = sessionStorage.getItem('pName')
  }

  showModal(): void {
    this.isVisible = true
  }
  showModall(): void {
    this.isVisible = true
  }
  handleOk(): void {
    this.isConfirmLoading = false
    this.isVisible = false
    this.radioData = this.optionForm.get('radioData').value
    console.log(this.radioData)
    if (this.radioData === 'Sms') {
      this.showModalTop()
    } else {
      this.showModalMiddle()
    }
  }
  handleCancel(): void {
    this.isVisible = false
  }

  sendData() {
    console.log('data', this.optionForm.value)
    this.isVisible = false
  }

  showModalTop(): void {
    this.isVisibleTop = true
  }

  showModalMiddle(): void {
    this.isVisibleMiddle = true
  }

  handleOkTop(): void {
    this.isVisibleTop = false
  }

  handleCancelTop(): void {
    this.isVisibleTop = false
  }

  handleOkMiddle(): void {
    this.isVisibleMiddle = false
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false
  }

  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
    // do something if u want
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded
    } else {
      const node = data.node
      if (node) {
        node.isExpanded = !node.isExpanded
      }
    }
  }

  activeNode(data: NzFormatEmitEvent): void {
    this.activatedNode = data.node!
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu)
  }

  selectDropdown(): void {
    // do something
  }

  nzClick(event: NzFormatEmitEvent): void {
    console.log(event)
  }

  nzCheck(event: NzFormatEmitEvent): void {
    console.log(event)
  }

  // nzSelectedKeys change
  nzSelect(keys: string[]): void {
    console.log(keys, this.nzTreeComponent.getSelectedNodeList())
  }

  ngAfterViewInit(): void {
    // get node by key: '10011'
    console.log(this.nzTreeComponent.getTreeNodeByKey('10011'))
    // use tree methods
    console.log(
      this.nzTreeComponent.getTreeNodes(),
      this.nzTreeComponent.getCheckedNodeList(),
      this.nzTreeComponent.getSelectedNodeList(),
      this.nzTreeComponent.getExpandedNodeList(),
    )
  }

  getData(data) {
    this.isData = true
    this.contactid = data.contactid
    console.log(this.contactid)
  }

  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
  escalation() {
    // this.ProjectName = sessionStorage.getItem('pName')
    this.router.navigate(['/dashboard/escalation'])
  }
}
