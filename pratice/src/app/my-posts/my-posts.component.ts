import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApisService } from '../apis.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from '../create-post/create-post.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';


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
  myEventSubscription: any;
  res: any;
  myEventSubscriptionDelete: any;
  name="My Posts"


  constructor(private httpclient: HttpClient, private service: ApisService, private snackBar: MatSnackBar, private router: Router, private dialog: MatDialog,) { }

  ngOnInit() {
    this.service.post.subscribe((res: any) => {
      console.log(res);
      this.ngOnInit();
     
    })
    const userId = JSON.parse(sessionStorage.getItem('userData'));
    console.log(userId.ID);
    this.service.getMyPosts(userId.ID).subscribe((res: any) => {
      console.log(res);
      this.data = res.Info;
      this.length = this.data.length;
    }, error => {
      console.log(error);
      if (error.error.Status == 401) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 200) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
    })
    // this.update();
    // this.deletePost();
  }


  update() {
    this.myEventSubscription = this.service.update.subscribe((res: any) => {
      console.log(res);
      this.ngOnInit();
      // this.ngOnDestroy();
    })
    this.ngOnInit();
    // this.myEventSubscription.unsubscribe();
  }
  deletePost() {
    this.myEventSubscriptionDelete = this.service.action.subscribe((res: any) => {
      console.log(res);
      this.ngOnInit();
      // this.destroydelete();
    })

    // this.myEventSubscriptionDelete.unsubscribe();

  }

  delete(id) {

    this.dialog.open(ConfirmationComponent, { data: { action: 'deletepost', id: id } });
    console.log(id);
    this.deletePost();


  }
  edit(id, option) {
    console.log(id);
    console.log(option);
    this.dialog.open(CreatePostComponent, { data: option });
    this.update();
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
  // ngOnDestroy() {
  //   this.myEventSubscription.unsubscribe();
  //   this.myEventSubscriptionDelete.unsubscribe();
  // }


}
