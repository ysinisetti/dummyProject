import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private service: ApisService,private snackBar: MatSnackBar) { }

  ngOnInit() {
    // this.service.rejectedArray.subscribe(resp => {
    //   this.data = resp;
    //   console.log(this.data);
    //   this.length=this.data.length;
    // })
    this.service.getRequestedPosts().subscribe((res: any) => {
      console.log(res);
      this.data= res.Info;
      this.length=this.data.length;

    }, error => {
      console.log(error)
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
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
  like() {

  }
  disLike() {

  }

  approve(id) {
    console.log(id);
    const data = {
      pid: id
    }
    console.log(data);
    this.service.approvePosts(data).subscribe((res:any) => {
      console.log(res);
      this.snackBar.open(res.Info, '', { duration: 2000, panelClass: ['green-snackbar'] });
    }, error => {
      console.log(error)
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info,'', { duration: 2000, panelClass: ['red-snackbar']  });
      }
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 400) {
        this.snackBar.open(error.error.Info,'', {duration: 2000, panelClass: ['red-snackbar']  });}
    })
    this.ngOnInit();

  }


}
