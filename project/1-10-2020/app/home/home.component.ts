import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApisService } from '../apis.service';

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

  constructor( private httpClient: HttpClient,private service :ApisService) { }

  ngOnInit() {
    this.service.getPost().subscribe((res: any) => {
      console.log(res);
      this.data= res;
      this.length=res.length;
      
    }, error => {
      console.log(error)
    })
    
  }
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
