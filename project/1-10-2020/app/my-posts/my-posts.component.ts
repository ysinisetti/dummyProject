import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss']
})
export class MyPostsComponent implements OnInit {
  data: any;
  pageIndex1: number = 0;
  pageSize: number = 10;
  lowValue: number = 0;
  highValue: number = 10;
  length: any;




  constructor(private httpclient: HttpClient, private service: ApisService) { }

  ngOnInit() {
    const userId = JSON.parse(sessionStorage.getItem('userData'));
    console.log(userId.ID);
   const id = {
      ID:userId.ID
    }
    this.service.getMyPosts(id).subscribe(res => {
      console.log(res);
      this.data = res;
      // this.length = res.length;
    }, error => {
      console.log(error)
    })
  }
  delete(id, option) {
    console.log(id);
    console.log(option);

  }
  edit(id, option) {
    console.log(id);
    console.log(option);

  }
  getPaginatorData(event) {
    if (event.pageIndex1 === this.pageIndex1 + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    }
    else if (event.pageIndex1 === this.pageIndex1 - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex1 = event.pageIndex1;
  }
  like() {

  }
  disLike() {

  }


}
