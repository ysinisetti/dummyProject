import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private service: ApisService,private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.service.getPost().subscribe((res: any) => {
      console.log(res);
      this.data= res.Info;
      this.length =  this.data.length;
      
    }, error => {
      console.log(error)
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
  reject(id){
    console.log(id);
    const data={
      pid:id
    }
    console.log(data);
    this.service.rejectPosts(data).subscribe((res:any) => {
      console.log(res);
      this.snackBar.open(res.Info, '', { duration: 2000, panelClass: ['green-snackbar'] });
    }, error => {
      console.log(error);
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
