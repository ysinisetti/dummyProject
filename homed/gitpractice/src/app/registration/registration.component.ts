import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  hide: boolean = true;
  RegisterForm: FormGroup;
  name: any;
  newFile: any;
  resp: Object;
  button: boolean;
  button1: boolean;
  fields: boolean = true;
  userData: any;

  constructor(private rf: FormBuilder, private router: Router, private service: ApisService, private snackBar: MatSnackBar, private route: ActivatedRoute) { }
  roll1: any = this.route.snapshot.queryParamMap;
  updateProfile = this.roll1.params.update

  ngOnInit() {
    console.log(this.updateProfile);
    this.RegisterForm = this.rf.group({
      firstName: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      phoneNumber: [''],
      userName: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&].{7,}')]],
      cpassword: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&].{7,}')]],
      gender: [''],
      RoleName: ['']
    })
    if (this.updateProfile == null) {
      this.name = "Register";
      this.button = true;
    } else {
      this.name = "Update Profile";
      this.button1 = true;
      this.fields = false;
      this.userData = JSON.parse(sessionStorage.getItem('userData'));
      console.log(this.userData);
      this.RegisterForm.controls.firstName.patchValue(this.userData.FirstName);
      this.RegisterForm.controls.lastName.patchValue(this.userData.LastName);
      this.RegisterForm.controls.phoneNumber.patchValue(this.userData.phoneno);
      this.RegisterForm.controls.gender.patchValue(this.userData.Gender);
      this.RegisterForm.controls.RoleName.patchValue(this.userData.role);
    }



  }
  signIn() {
    this.router.navigate([""]);
  }
  register() {
    if (this.RegisterForm.valid) {
      const data = {
        FirstName: this.RegisterForm.controls.firstName.value,
        LastName: this.RegisterForm.controls.lastName.value,
        Gender: this.RegisterForm.controls.gender.value,
        UserName: this.RegisterForm.controls.userName.value,
        Password: this.RegisterForm.controls.password.value,
        ConfirmPassword: this.RegisterForm.controls.cpassword.value,
        phoneno: this.RegisterForm.controls.phoneNumber.value,
        role: this.RegisterForm.controls.RoleName.value
      }
      console.log(data);
      this.service.postRegistration(data).subscribe((res: any) => {
        console.log(res);
        console.log(res.Info);
        this.resp = res
        // this.snackBar.open(res.info, '', { duration: 2000 });;
        this.snackBar.open(res.Info, '', {
          // verticalPosition: 'top',
          duration: 2000,
          panelClass: ['green-snackbar']
        });
      }, error => {
        if (error.error.Status == 500) {
          this.snackBar.open(error.error.Info, '', {
            // verticalPosition: 'top',
            duration: 2000,
            panelClass: ['red-snackbar']
          });
        }
        if (error.error.Status == 400) {
          this.snackBar.open(error.error.Info, '', {
            // verticalPosition: 'top',
            duration: 2000,
            panelClass: ['red-snackbar']
          });
        }
      })
      this.RegisterForm.reset();
    }

    // onFileChange(event) {
    //   console.log('eee', event)
    //   this.newFile = event.target.files[0]
    //   console.log('newfile', this.newFile)
    //   this.RegisterForm.get('attachment').setValue('file')
    // }

  }
  update() {
    const data = {
      FirstName: this.RegisterForm.controls.firstName.value,
      LastName: this.RegisterForm.controls.lastName.value,
      Gender: this.RegisterForm.controls.gender.value,
      phoneno: this.RegisterForm.controls.phoneNumber.value,
      role: this.RegisterForm.controls.RoleName.value,
      ID: this.userData.ID
    }
    console.log(data);
    // this.service.role2.next(true);
    sessionStorage.removeItem('userData');
    this.service.UpdateProfile(data).subscribe((res: any) => {
      console.log(res);
      console.log(res.result[0]);
      sessionStorage.setItem('userData', JSON.stringify(res.result[0]));
      this.snackBar.open(res.Info, '', { duration: 2000, panelClass: ['green-snackbar'] });
    }, error => {
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 400) {
        this.snackBar.open(error.error.Info, '', { duration: 2000, panelClass: ['red-snackbar'] });
      }
    })
    this.router.navigate(["user/home"]);
  }

}


