import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  hide: boolean = true;
  forgotForm: FormGroup;
  Title = "Forget Password"
  val: number;


  constructor(private router: Router, private tt: FormBuilder, private snackBar: MatSnackBar,private service: ApisService,) { }

  ngOnInit(): void {
    this.forgotForm = this.tt.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
    });



  }
  next() {
    if (this.forgotForm.valid) {
      this.val = Math.floor(1000 + Math.random() * 9000);
      const data1 = {
        UserName:this.forgotForm.controls.userName.value,
        Otp:this.val
      }
      console.log(data1);
      this.service.updateOtp(data1).subscribe((resp: any) => {
        console.log(resp);
        this.router.navigate(["new"]);
        this.snackBar.open(resp.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['green-snackbar'] });
      }, error => {
        // console.log(error);
        if (error.status == 500) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
        if (error.status == 400) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
      })
    }
    
  }

}
