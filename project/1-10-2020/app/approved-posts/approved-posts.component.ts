import { Component, OnInit } from '@angular/core';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-approved-posts',
  templateUrl: './approved-posts.component.html',
  styleUrls: ['./approved-posts.component.scss']
})
export class ApprovedPostsComponent implements OnInit {
  data: any;
  name = "Approved Posts"
  length: any;
  pageIndex: number = 0;
  pageSize: number = 10;
  lowValue: number = 0;
  highValue: number = 10;

  constructor(private service: ApisService) { }

  ngOnInit() {
    this.service.approvedArray.subscribe(resp => {
      this.data = resp;
      console.log(this.data);
      this.length = this.data.length;
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
