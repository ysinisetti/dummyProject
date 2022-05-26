import { Component, OnInit } from '@angular/core'
import { NzNotificationService } from 'ng-zorro-antd/notification'

@Component({
  selector: 'app-search-server-pagenation',
  templateUrl: './search-server-pagenation.component.html',
  styleUrls: ['./search-server-pagenation.component.scss']
})
export class SearchServerPagenationComponent implements OnInit {
  optionList = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' }
  ]
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
  ]
  constructor(private notification: NzNotificationService) { }
  header = 'Search With Server Side Pagenation'

  ngOnInit(): void {
  }
  onCurrentPageDataChange(data) {
    console.log(data)
    this.notification.create(
      'warning',
      `Page No: ${data}` ,
      'Service Call'
    )
  }
}
