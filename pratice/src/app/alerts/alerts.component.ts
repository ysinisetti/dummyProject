import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApisService } from '../apis.service';
import { CreateAlertsComponent } from '../create-alerts/create-alerts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  displayedColumns: string[] = ['Sno', 'name', 'link', 'createdOn', 'status', 'action'];
  columns: [];
  ColumnMode = ColumnMode;
  dataSource: any;
  rows: [];
  login = true;
  // i=i+1;

  pageIndex: number = 0;
  pageSize: number = 10;
  lowValue: number = 0;
  highValue: number = 10;
  length: any;
  option: any;
  value: number;
  changedResp: any;
  // checked: boolean;
  autoRenew: boolean;
  myEventSubscriptionDelete: any;
  sub: any;
  data1: { statusAction: number; sno: any; };
  temp: [];
  expanded: any = {};
  timeout: any;
  filterName: string;
  name: any;
  name1: string;
  rowSno: {};






  constructor(private httpClient: HttpClient, private dialog: MatDialog, private service: ApisService, private router: Router, private snackBar: MatSnackBar,) { }

  ngOnInit() {
    // if(this.autoRenew=="true"){
    //   this.checked = true;
    // }
    // else{
    //   this.checked = false;
    // }
    this.service.role1.next(false);
    this.update();

    this.service.getAlerts().subscribe((data1: any) => {
      console.log(data1);
      this.dataSource = data1.Info;
      this.length = this.dataSource.length;
      for (let i = 0; i < this.dataSource.length; i++) {
        console.log(this.dataSource[i].statusAction);
        if (this.dataSource[i].statusAction == 1) {
          console.log("wefffffff");
          this.dataSource[i]['status'] = true;
        }
        else if (this.dataSource[i].statusAction == 0) {
          console.log("afffff");
          this.dataSource[i]['status'] = false;
        }
      }
      this.dataSource = [...this.dataSource]
    }, error => {
      console.log(error)
      if (error.error.Status == 401) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
    })


  }
  openEdit(data) {
    console.log(data);
    this.dialog.open(CreateAlertsComponent, {
      data: data
    });

  }
  deleteAlert() {
    this.sub = this.service.action.subscribe((res: any) => {
      console.log(res);
      this.ngOnInit();
    })

  }
  openDelete(id) {
    this.dialog.open(ConfirmationComponent, { data: { action: 'deletealert', id: id } });
    console.log(id);
    this.deleteAlert();
    // this.service.deleteAlerts(id).subscribe((res: any) => {
    //   console.log(res);
    //   // horizontalPosition:'right',
    //   this.snackBar.open(res.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['green-snackbar'] });
    // }, error => {
    //   console.log(error)
    //   if (error.error.Status == 401) {
    //     this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
    //   }
    //   if (error.error.Status == 404) {
    //     this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
    //   }
    //   if (error.error.Status == 500) {
    //     this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
    //   }
    // })

  }
  Dialog() {
    this.dialog.open(CreateAlertsComponent);

  }

  toggleIsAwesome(event, option) {
    console.log(event);
    console.log(option);
    if (option.statusAction == 1) {
      this.data1 = {
        statusAction: 0,
        sno: option.sno
      }
    }
    if (option.statusAction == 0) {
      this.data1 = {
        statusAction: 1,
        sno: option.sno
      }
    }
    console.log(this.data1);
    this.service.updateStatus(this.data1).subscribe((res: any) => {
      console.log(res);
      this.snackBar.open(res.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['green-snackbar'] });
      this.service.update.next(true);
    }, error => {
      console.log(error);
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 400) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
    })
  }


  update() {
    this.service.update.subscribe((res: any) => {
      console.log(res);
      this.ngOnInit();
    })

  }
  getPaginatorData(event) {
    console.log(event);
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    }
    else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }
  updateFilter(event, value) {
    console.log(event.target.value, typeof value);
    const val = event.target.value.toLowerCase();
    console.log(val);
    console.log(val.length);

    // filter our data
    const temp = this.dataSource.filter(function (d) {
      // return d.value.toLowerCase().indexOf(val) != -1 || !val;
      // console.log("gefgjkhgjks",temp);
      if (value == 'name') {
        return d.name.toLowerCase().indexOf(val) != -1 || !val;
      } else if (value == 'link') {
        return d.link.toLowerCase().indexOf(val) != -1 || !val;
      } else {
        return d.createdOn.toLowerCase().indexOf(val) != -1 || !val;
      }
    });
    console.log("gefgjkhgjks", temp);

    // update the rows
    this.dataSource = temp;

    if (val.length == 0) {
      this.ngOnInit();
    }

  }
  onDetailToggle(rowData) {
    console.log('Detail Toggled', event);
    console.log(rowData);
    console.log(rowData.sno);
    for (let i = 0; i < this.dataSource.length; i++) {
      if (this.dataSource[i].sno == rowData.sno) {
        this.dataSource[i]['name'] = rowData.post;
        this.dataSource[i]['createdOn'] = rowData.postedOn;
      }
      this.dataSource = [...this.dataSource];
    }

  }
  toggleExpandRow(row, event) {
    console.log('Toggled Expand Row!', row);
    console.log(event);
    // this.table.rowDetail.toggleExpandRow(row); 
    if (this.rowSno == row) {
      // this.table.rowDetail.collapseAllRows();
      this.table.rowDetail.toggleExpandRow(row);
    } else {
      this.table.rowDetail.collapseAllRows();
      this.table.rowDetail.toggleExpandRow(row);
      this.rowSno=row;
    }
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  resetSearch() {
    console.log("jcgjad");
    // this.filterName='';
    this.name = '';
    this.name1 = '';
    this.ngOnInit();

  }



  ngOnDestroy() {
    console.log('in destroying alerts')
    this.service.role1.next(true);

  }

}
