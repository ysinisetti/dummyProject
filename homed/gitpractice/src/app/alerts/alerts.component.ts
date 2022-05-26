import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApisService } from '../apis.service';
import { CreateAlertsComponent } from '../create-alerts/create-alerts.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [ 'Sno','name' , 'link', 'createdOn','status','action'];
  dataSource: any;
  // i=i+1;
  
  pageIndex:number = 0;
    pageSize:number = 10;
    lowValue:number = 0;
    highValue:number = 10;
    length: any;
    option: any;
  value: number;
  
 

  constructor(private httpClient: HttpClient,private dialog: MatDialog,private service:ApisService,private router: Router,private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.service.role1.next(false);
   
    this.service.getAlerts().subscribe((data1:any)=>{
      console.log(data1);
      this.dataSource = data1.Info;
      this.length= this.dataSource.length; 
    }, error => {
      console.log(error)
      if (error.error.Status == 401) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
    })
    

  }
  openEdit(data){
    console.log(data);
    this.dialog.open(CreateAlertsComponent,{data:data
    });

  }
  openDelete(id){
    console.log(id);
    this.service.deleteAlerts(id).subscribe((res:any) => {
      console.log(res);
      this.snackBar.open(res.Info, '', { duration: 2000, panelClass: ['green-snackbar'] });
    }, error => {
      console.log(error)
      if (error.error.Status == 401) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
    })
    this.ngOnInit();

  }
  Dialog(){
    this.dialog.open(CreateAlertsComponent);
    
  }
  getPaginatorData(event){
    console.log(event);
    if(event.pageIndex === this.pageIndex + 1){
       this.lowValue = this.lowValue + this.pageSize;
       this.highValue =  this.highValue + this.pageSize;
      }
   else if(event.pageIndex === this.pageIndex - 1){
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue =  this.highValue - this.pageSize;
     }   
      this.pageIndex = event.pageIndex;
}

  ngOnDestroy() {
    console.log('in destroying alerts')
    this.service.role1.next(true);

}

}
