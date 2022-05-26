import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'app-risks',
  templateUrl: './risks.component.html',
  styleUrls: ['./risks.component.scss'],
})
export class RisksComponent implements OnInit {
  tableData = [
    { pName: 'Scoop Text', cName: 'Internal', pDuration: '60 Days', status: 'Active' },
    { pName: 'Hubble', cName: 'Internal', pDuration: '90 Days', status: 'Active' },
    { pName: 'Request Management', cName: 'DMaas', pDuration: '120 Days', status: 'Active' },
    { pName: 'Task Managment', cName: 'JBHunt', pDuration: '120 Days', status: 'In-Active' },
    { pName: 'Risk Management', cName: 'Miracle', pDuration: '60 Days', status: 'Active' },
    { pName: 'Project Manager', cName: 'Miracle', pDuration: '90 Days', status: 'In-Active' },
    { pName: 'BPM', cName: 'Internal', pDuration: '45 Days', status: 'In-Active' },
    { pName: 'Meeting Manager', cName: 'DMaas', pDuration: '30 Days', status: 'Active' },
    { pName: 'Gentex Inc', cName: 'Internal', pDuration: '60 Days', status: 'Active' },
  ]
  optionList1 = [
    { label: 'All', value: 'All' },
    { label: 'Scoop Text', value: 'Scoop Text' },
    { label: 'Hubble', value: 'Hubble' },
    { label: 'Request Management', value: 'Request Management' },
    { label: 'Task Managment', value: 'Task Managment' },
    { label: 'Risk Managementll', value: 'Risk Management' },
    { label: 'Project Manager', value: 'Project Manager' },
    { label: 'BPM', value: 'BPM' },
    { label: 'Meeting Manager', value: 'Meeting Manager' },
    { label: 'Gentex Inc', value: 'Gentex Inc' },
  ]
  optionList = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' },
  ]
  prjForm: FormGroup
  ProjectName: string
  constructor(private fb: FormBuilder, private route: Router) {}

  ngOnInit(): void {
    this.prjForm = this.fb.group({
      cName: [null],
      pName: [null],
    })
    this.prjForm.patchValue({
      cName: 'Internal',
      pName: this.optionList1.filter(x => x.label === 'Hubble')[0],
    })
    this.ProjectName = sessionStorage.getItem('pName')
  }
  onCurrentPageDataChange(data) {
    console.log(data)
  }
  details() {
    this.ProjectName = sessionStorage.getItem('pName')
    this.route.navigate(['/dashboard/projectDetails', this.ProjectName])
  }
}
