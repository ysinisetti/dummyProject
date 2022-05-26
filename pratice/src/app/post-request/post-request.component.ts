import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-post-request',
  templateUrl: './post-request.component.html',
  styleUrls: ['./post-request.component.scss']
})
export class PostRequestComponent implements OnInit {
  searchApprovePost: FormGroup;
  pageIndex: number = 0;
  pageSize: number = 10;
  lowValue: number = 0;
  highValue: number = 10;
  data: any;
  length: any;
  Title="Requested Posts";



  constructor(private fb: FormBuilder,private httpClient: HttpClient, private service: ApisService,private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.searchApprovePost = this.fb.group({
      title: ['', [ Validators.minLength(3), Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]")]],
      firstName: ['', [ Validators.minLength(3), Validators.pattern("[a-zA-Z\s]+$")]],
    })
    this.service.requestMyposts().subscribe((res: any) => {
      console.log(res);
      this.data= res.Info;
      this.length =  this.data.length;
    }, error => {
      console.log(error)
      console.log(error);
      if (error.error.Status == 401) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info, '', {  verticalPosition: 'top',duration: 2000, panelClass: ['red-snackbar'] });
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

  reject(id) {
    console.log(id);
    const data={
      pid:id
    }
    console.log(data);
    this.service.rejectPosts(data).subscribe((res: any) => {
      console.log(res);
      this.snackBar.open(res.Info, '', {  verticalPosition: 'top',duration: 2000, panelClass: ['green-snackbar'] });
    }, error => {
      console.log(error)
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info,'', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar']  });
      }
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', {  verticalPosition: 'top',duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 400) {
        this.snackBar.open(error.error.Info,'', { verticalPosition: 'top',duration: 2000, panelClass: ['red-snackbar']  });}
    })
    this.ngOnInit();


  }
  approve(id) {
    console.log(id);
    const data={
      pid:id
    }
    console.log(data);
    this.service.approvePosts(data).subscribe((res:any) => {
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
  like() {

  }
  disLike() {

  }
  reset(){
    this.ngOnInit();
    
  }
  search(){
    const data1 = {
      FirstName: this.searchApprovePost.controls.firstName.value,
      title: this.searchApprovePost.controls.title.value,
    }
    if (data1.FirstName == "" && data1.title == "") {
      this.ngOnInit();
    } else {
    console.log(data1);
    this.service.searchRequestPosts(data1).subscribe((res: any) => {
      console.log(res);
      this.data = res.Info;
      this.length = this.data.length;

    }, error => {
      console.log(error)
      if (error.error.Status == 401) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 404) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
    })

  }
}

}


