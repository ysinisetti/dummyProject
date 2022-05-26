import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApisService } from '../apis.service';
import { CreateAlertsComponent } from '../create-alerts/create-alerts.component';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  displayedColumns: string[] = [ 'Sno','name' , 'link', 'createdOn','status','action'];
  dataSource: any;
  
  pageIndex:number = 0;
    pageSize:number = 10;
    lowValue:number = 0;
    highValue:number = 10;
    length: any;
    option: any;

  constructor(private httpClient: HttpClient,private dialog: MatDialog,private service:ApisService,private router: Router) { }

  ngOnInit() {
    // if (this.router.url.includes("/Alerts")) {
    //   sessionStorage.setItem('isAlerts', 'true');
    // }
    this.service.role1.next(true);
    this.httpClient.get("assets/links.json").subscribe((data1: any) => {
      console.log(data1);
      this.dataSource = data1;
      this.length=data1.length;
    })

  }
  openEdit(data){

  }
  openDelete(id){

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

}
