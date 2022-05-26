import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-search-ui-pagenation',
  templateUrl: './search-ui-pagenation.component.html',
  styleUrls: ['./search-ui-pagenation.component.scss'],
})
export class SearchUiPagenationComponent implements OnInit {
  tableData = [
    { tName: 'Scoop Text', sDate: '05-12-2019', cDate: '02-04-2020', status: 'Active' },
    { tName: 'JhonDheere', sDate: '05-12-2019', cDate: '02-04-2020', status: 'Active' },
    { tName: 'Fair Genuine', sDate: '05-12-2019', cDate: '02-04-2020', status: 'Active' },
    { tName: 'Overlap Play', sDate: '05-12-2019', cDate: '02-04-2020', status: 'In-Active' },
    { tName: 'Fine DI', sDate: '05-12-2019', cDate: '02-04-2020', status: 'Active' },
    { tName: 'Genuine Inc', sDate: '05-12-2019', cDate: '02-04-2020', status: 'In-Active' },
    { tName: 'Allow Suffix', sDate: '05-12-2019', cDate: '02-04-2020', status: 'In-Active' },
    { tName: 'Play Skool', sDate: '05-12-2019', cDate: '02-04-2020', status: 'Active' },
    { tName: 'Gentex Inc', sDate: '05-12-2019', cDate: '02-04-2020', status: 'Active' },
    { tName: 'Scoop Text', sDate: '05-12-2019', cDate: '02-04-2020', status: 'Active' },
    { tName: 'Scoop Text', sDate: '05-12-2019', cDate: '02-04-2020', status: 'In-Active' },
    { tName: 'Scoop Text', sDate: '05-12-2019', cDate: '02-04-2020', status: 'Active' },
    { tName: 'Scoop Text', sDate: '05-12-2019', cDate: '02-04-2020', status: 'Active' },
    { tName: 'Scoop Text', sDate: '05-12-2019', cDate: '02-04-2020', status: 'Active' },
    { tName: 'Scoop Text', sDate: '05-12-2019', cDate: '02-04-2020', status: 'In-Active' },
    { tName: 'Scoop Text', sDate: '05-12-2019', cDate: '02-04-2020', status: 'Active' },
    { tName: 'Scoop Text', sDate: '05-12-2019', cDate: '02-04-2020', status: 'Active' },
    { tName: 'Scoop Text', sDate: '05-12-2019', cDate: '02-04-2020', status: 'In-Active' },
  ]
  optionList = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' },
  ]
  constructor() {}

  ngOnInit(): void {}
  onCurrentPageDataChange(data) {
    console.log(data)
  }
}
