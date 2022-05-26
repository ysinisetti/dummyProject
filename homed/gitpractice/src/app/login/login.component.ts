import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { ApisService } from '../apis.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  // form: boolean = true;
  hide: boolean = true;
  lId: any;
  role2: boolean = true;
  role: boolean = true;
  name = "LOGIN";
  userData: any;
  myEventSubscription: any;




  constructor(private fb: FormBuilder, private rf: FormBuilder, private router: Router, private httpClient: HttpClient, private service: ApisService, private snackBar: MatSnackBar) {


  }



  // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&_#])[A-Za-z\d$@$!%*?&].{7,}')

  ngOnInit() {

    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', [Validators.required]],
    })

  }

  login() {
    if (this.loginForm.valid) {
      const data = {
        UserName: this.loginForm.controls.userName.value,
        Password: this.loginForm.controls.password.value,
      }
      console.log(data);
      // var name = data.UserName;
      // console.log(name);
      // var roleUser = name.split('@', 1);
      // sessionStorage.setItem('roleName', roleUser);
      // console.log('username1', roleUser)
      // console.log(roleUser);
      // this.loginForm.reset;
      // var roll = data.UserName === "admin@gmail.com" ? 'Admin' : 'User';
      // sessionStorage.setItem('role', roll);
      // sessionStorage.setItem('isLogin', 'true');
      // sessionStorage.setItem('roll', roll);
      // console.log('username2', roll)
      // this.myEventSubscription = this.service.LoginPost(data).subscribe(res => {
      //   console.log("==================",res);
      //   this.userData = res;
      //   console.log(this.userData);
      //   if (this.userData == "Invalid Credentials") {

      //   }
      //   else {
      //     this.snackBar.open('You are login successfully.', '', { duration: 2000 });
      //     sessionStorage.setItem('userData', JSON.stringify(this.userData));
      //     this.router.navigate(["user/home"]);

      //   }
      // }, error => {
      //   this.snackBar.open("please enter valid Credentials", '', { duration: 2000 });
      // })


      // this.service.postRequested.next(data);
      // this.service.role.next(true);
      // this.service.roleUser.next(roleUser);


      var roll = data.UserName === "admin@gmail.com" ? 'Admin' : 'User';
     
      this.service.LoginPost(data).subscribe(res => {
        console.log("==================", res);
        this.userData = res;
        console.log(this.userData);
        if (this.userData.Status == 200) {
          this.service.role.next(true);
          sessionStorage.setItem('role', roll);
          sessionStorage.setItem('isLogin', 'true');
          this.snackBar.open(this.userData.Info, '', { duration: 2000, panelClass: ['green-snackbar'] });
          sessionStorage.setItem('userData', JSON.stringify(this.userData));
          this.router.navigate(["user/home"]);
        }  
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
      })
    }
  }

  register() {
    this.router.navigate(["Registration"]);
  }
  ngOnDestroy() {
    if (!!this.myEventSubscription) this.myEventSubscription.unsubscribe();
  }



}


