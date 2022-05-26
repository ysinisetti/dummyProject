import { ChangeDetectorRef, Component, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApisService } from '../apis.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: any;
  length: any;
  // pageSize: any;

  pageIndex:number = 0;
    pageSize:number = 10;
    lowValue:number = 0;
    highValue:number = 10;

  constructor( private httpClient: HttpClient,private service :ApisService,private cd: ChangeDetectorRef,private snackBar: MatSnackBar) { }
  // ngOnChanges(changes: SimpleChanges): void {
  
  //     window.location.reload();

  // }
  
  ngOnInit() { 
    
    // for(i=0;i<=1;i++){
    //   this.reload();
    // }
   

    this.service.getPost().subscribe((res: any) => {
      console.log(res);
      this.data= res.Info;
      this.length=this.data.length;
      
    }, error => {
      console.log(error);
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
  // reload(){
  //   window.location.reload();
  // }
  custom(){
    console.log("entering");
  }

  getPaginatorData(event){
    // console.log(event);
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
like(){

}
disLike(){
  
}
}
