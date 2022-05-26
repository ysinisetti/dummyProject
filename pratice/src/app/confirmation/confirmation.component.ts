import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  confirmationform: FormGroup;
  name: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: ApisService, private snackBar: MatSnackBar, public dialogRef: MatDialogRef<ConfirmationComponent>, private router: Router) { }

  ngOnInit() {
    console.log(this.data.id);
    console.log(this.data.action);
    if (this.data.action == 'deletepost') {
      this.name = "Delete post"
    }
    if (this.data.action == 'deletealert') {
      this.name = "Delete Alert"
    }
    // this.close();
  }
  operation() {
    if (this.data.action == 'deletepost') {
      console.log("entering delete post")
      this.service.deletePost(this.data.id).subscribe((res: any) => {
        console.log(res);
        this.snackBar.open(res.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['green-snackbar'] });
        this.service.action.next(true);
      }, error => {
        console.log(error)
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
      this.dialogRef.close();
    }
    if (this.data.action == 'deletealert') {
      console.log(this.data.id);
      console.log("entering delete alert");
      this.service.deleteAlerts(this.data.id).subscribe((res: any) => {
        console.log(res);
        // horizontalPosition:'right',
        this.service.action.next(true);
        this.snackBar.open(res.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['green-snackbar'] });
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
      this.dialogRef.close();
      // this.router.navigate(["user/Alerts"]);
    }

    // this.dialogRef.close();

  }

  close() {
    this.dialogRef.close();
    // this.close();
  }
}