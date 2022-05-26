import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.scss']
})
export class NewpasswordComponent implements OnInit {
  newpasswordForm: FormGroup;
  hide: boolean = true;
  name = "forget password"



  constructor(private ff: FormBuilder, private snackBar: MatSnackBar, private service: ApisService, private router: Router) { }

  ngOnInit() {
    this.newpasswordForm = this.ff.group({
      userName: ['', [Validators.required, Validators.minLength(8), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      otpNumber: ['', [Validators.required, Validators.pattern("[0-9]{4}")]],
      password: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&].{7,}')]],
      cpassword: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&].{7,}')]],
    })


  }
  submit() {
    if (this.newpasswordForm.valid) {
      const data1 = {
        UserName: this.newpasswordForm.controls.userName.value,
        Otp: this.newpasswordForm.controls.otpNumber.value,
        ConfirmPassword: this.newpasswordForm.controls.cpassword.value,
        Password: this.newpasswordForm.controls.password.value,
      }
      console.log(data1);
      if (data1.Password == data1.ConfirmPassword) {
        this.service.changePasswordOTP(data1).subscribe((resp: any) => {
          console.log(resp);
          this.snackBar.open(resp.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['green-snackbar'] });
          this.router.navigate(['']);
        }, error => {
          console.log(error);
          if (error.Status == 500) {
            this.snackBar.open(error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
          }
          if (error.Status == 400) {
            this.snackBar.open(error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
          }

        })
      }
      else{
        this.snackBar.open('Password & Confirm password must match', '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }

    }
  }

}
