import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-post-request',
  templateUrl: './post-request.component.html',
  styleUrls: ['./post-request.component.scss']
})
export class PostRequestComponent implements OnInit {
  pageIndex: number = 0;
  pageSize: number = 10;
  lowValue: number = 0;
  highValue: number = 10;
  data: any;
  length: any;
  approvedArray = [];
  rejectedArray = [];


  constructor(private httpClient: HttpClient, private service: ApisService) { }

  ngOnInit() {
    this.httpClient.get("assets/requestPost.json").subscribe((data: any) => {
      console.log(data);
      this.data = data;
      this.length = data.length;
    })
  }
  getPaginatorData(event) {
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

  reject(option, id) {
    console.log(option);
    this.rejectedArray.push(option);
    this.service.rejectedArray.next(this.rejectedArray);
    console.log(id);

  }
  approve(option, id) {
    console.log(option);
    this.approvedArray.push(option);
    console.log(this.approvedArray);
    this.service.approvedArray.next(this.approvedArray);
    console.log(id);
  }
  like(){

  }
  disLike(){
    
  }

}


