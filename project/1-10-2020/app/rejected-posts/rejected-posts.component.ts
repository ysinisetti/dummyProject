import { Component, OnInit } from '@angular/core';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-rejected-posts',
  templateUrl: './rejected-posts.component.html',
  styleUrls: ['./rejected-posts.component.scss']
})
export class RejectedPostsComponent implements OnInit {
  data: any;
  name = "Rejected Posts";
  length: any;
  pageIndex: number = 0;
  pageSize: number = 10;
  lowValue: number = 0;
  highValue: number = 10;
  newFile: any;

  constructor(private service: ApisService) { }

  ngOnInit() {
    this.service.rejectedArray.subscribe(resp => {
      this.data = resp;
      console.log(this.data);
      this.length=this.data.length;
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
  like(){

  }
  disLike(){

  }
 



}
