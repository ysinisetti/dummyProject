import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-create-alerts',
  templateUrl: './create-alerts.component.html',
  styleUrls: ['./create-alerts.component.scss']
})
export class CreateAlertsComponent implements OnInit {
  createAlert: FormGroup;
  
  date=new Date();
  Title: string;
  button: boolean;
  button1: boolean;
  constructor(private fb: FormBuilder,private service :ApisService,private snackBar:MatSnackBar,public dialogRef: MatDialogRef<CreateAlertsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    this.createAlert = this.fb.group({
      name:['',[Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      link:["",[Validators.required, Validators.maxLength(100), Validators.minLength(3)]]
  })
  if (this.data == null) {
    this.Title = 'Create Alerts';
    this.button = true;
  } else {
    this.Title = 'Update Alerts';
    this.button1 = true;
    this.createAlert.controls.name.patchValue(this.data.name);
    this.createAlert.controls.link.patchValue(this.data.link);
  }
  }

  post(){
    if(this.createAlert.valid){
      const data1={
        name: this.createAlert.controls.name.value,
        link:this.createAlert.controls.link.value,
        createdOn:this.date,
        statusAction:1
      }
      console.log(data1);
      this.service.createAlerts(data1).subscribe((res:any)=>{
        console.log(res);
        this.snackBar.open(res.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['green-snackbar'] });
      }, error => {
        console.log(error);
        if (error.error.Status == 401) {
          this.snackBar.open(error.error.Info, '', {  verticalPosition: 'top',duration: 2000, panelClass: ['red-snackbar'] });
        }
        if (error.error.Status == 404) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
        if (error.error.Status == 500) {
          this.snackBar.open(error.error.Info, '', {  verticalPosition: 'top',duration: 2000, panelClass: ['red-snackbar'] });
        }
      })  
      this.service.update.next(true);
      this.dialogRef.close();
    }
  }


  edit(){
    if(this.createAlert.valid){
      const updateData={
        name: this.createAlert.controls.name.value,
        link:this.createAlert.controls.link.value,
        createdOn:this.date,
        statusAction:1,
        sno:this.data.sno
      }
      console.log(updateData);
      this.service.updateAlerts(updateData).subscribe((res:any)=>{
        console.log(res);
        this.snackBar.open(res.Info, '', {  verticalPosition: 'top', horizontalPosition:'right',duration: 2000, panelClass: ['green-snackbar'] });
      }, error => {
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
    this.service.update.next(true);
    this.dialogRef.close();
  }


}
