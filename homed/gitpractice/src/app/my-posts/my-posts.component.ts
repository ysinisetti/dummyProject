import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApisService } from '../apis.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from '../create-post/create-post.component';


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
 





  constructor(private httpclient: HttpClient, private service: ApisService, private snackBar: MatSnackBar,private router: Router,private dialog: MatDialog,) { }

  ngOnInit() {
    console.log(status);
    const userId = JSON.parse(sessionStorage.getItem('userData'));
    console.log(userId.ID);
    this.service.getMyPosts(userId.ID).subscribe((res: any) => {
      console.log(res);
      this.data= res.Info;
      this.length = this.data.length;
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
      if (error.error.Status == 200) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
    })
  }
  status1(status1: any) {
    throw new Error('Method not implemented.');
  }
  delete(id) {
    console.log(id);
    this.service.deletePost(id).subscribe((res: any) => {
      console.log(res);
      this.snackBar.open(res.Info,'', {  duration: 2000, panelClass: ['green-snackbar'] });
    }, error => {
      console.log(error)
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info,'', { duration: 2000, panelClass: ['red-snackbar']   });
      }
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 400) {
        this.snackBar.open(error.error.Info,'', {  duration: 2000,  panelClass: ['red-snackbar']   }); }
    })
this.ngOnInit();
  }
  edit(id, option) {
    console.log(id);
    console.log(option);
    this.dialog.open(CreatePostComponent,{data:option
    });
    

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
