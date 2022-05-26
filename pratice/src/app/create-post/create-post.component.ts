import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApisService } from '../apis.service';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  createPost: FormGroup;
  Addpost: string;
  date = new Date();
  // button: string;
  Title: string;
  button: boolean;
  button1: boolean;
  userData: Object;



  constructor(private fb: FormBuilder, private service: ApisService, private snackBar: MatSnackBar, public dialogRef: MatDialogRef<CreatePostComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) { }

  ngOnInit() {
    this.createPost = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]")]],
      Description: ["", [Validators.required, Validators.minLength(3), Validators.pattern("^[\\s a-zA-z0-9!@#$%^&*()_+,.;:<>?/'{}]*$")]]
      // pattern("^\s*[a-zA-Z,\s]+\s*$")
    })
    if (this.data == null) {
      this.Title = 'Create Post';
      this.button = true;
    } else {
      this.Title = 'Update Post';
      this.button1 = true;
      this.createPost.controls.title.patchValue(this.data.title);
      this.createPost.controls.Description.patchValue(this.data.post);
    }
  }
  post() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (this.createPost.valid) {
      const data1 = {
        FirstName: userData.FirstName,
        LastName: userData.LastName,
        role: userData.role,
        post: this.createPost.controls.Description.value,
        postedOn: this.date,
        status: 0,
        title: this.createPost.controls.title.value,
        ID: userData.ID,
      }
      console.log(data1);
      this.service.createPost(data1).subscribe((resp: any) => {
        console.log(resp);
        this.service.post.next(true);
        this.snackBar.open(resp.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['green-snackbar'] });
      }
      , error => {
        // console.log(error);
        if (error.error.Status == 500) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
        if (error.error.Status == 400) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
      }
      )
      this.createPost.reset();
      this.dialogRef.close();
    }
  }
  update() {
    console.log(this.data)
    if (this.createPost.valid) {
      const data2 = {
        post: this.createPost.controls.Description.value,
        postedOn: this.date,
        title: this.createPost.controls.title.value,
        pid: this.data.pid,
      }
      console.log(data2);
      this.service.updatePost(data2).subscribe((res: any) => {
        console.log(res);
        this.snackBar.open(res.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['green-snackbar'] });
        this.service.update.next(true);
      }, error => {
        console.log(error);
        if (error.error.Status == 500) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
        if (error.error.Status == 404) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
        if (error.error.Status == 400) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
      })

      this.createPost.reset();
      this.dialogRef.close();

    }
  }
}
