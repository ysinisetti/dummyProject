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
  button2: boolean;
  fields: boolean = true;
  userData: any;
  field: boolean = true;
  changePswd: boolean = true;
  password: void;


  constructor(private rf: FormBuilder, private router: Router, private service: ApisService, private snackBar: MatSnackBar, private route: ActivatedRoute) { }
  roll1: any = this.route.snapshot.queryParamMap;
  updateProfile = this.roll1.params.update

  ngOnInit() {
    // var val = Math.floor(1000 + Math.random() * 9000);
    // console.log(val);
    console.log(this.updateProfile);
    this.RegisterForm = this.rf.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("[a-zA-Z\s]+$")]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("[a-zA-Z\s]+$")]],
      phoneNumber: ['', [Validators.required, Validators.pattern("[6-9]{1}[0-9]{9}")]],
      userName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&].{7,}')]],
      cpassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&].{7,}')]],
      gender: [''],
      RoleName: ['', [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]")]]
      // uploadImage: ['']
    })
    if (this.updateProfile == null) {
      this.name = "Register";
      this.button = true;
    } else if (this.updateProfile == "updateProfile") {
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
    } else if (this.updateProfile == "changePassword") {
      this.name = "Change Password";
      this.button2 = true;
      this.changePswd = false;


    }



  }
  onSelectFile(event) {
    console.log(event);
    const file = event.target.files[0];
    console.log(file);
    this.RegisterForm.get('uploadImage').setValue(file);
    console.log(this.RegisterForm.get('uploadImage').value);
  }
  signIn() {
    this.router.navigate([""]);
  }
  register() {
    // const formData=new FormData();
    // formData.append('file',this.RegisterForm.get('uploadImage').value);
    // console.log(this.RegisterForm.get('uploadImage').value);
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
      if (data.Password == data.ConfirmPassword) {
        this.service.postRegistration(data).subscribe((res: any) => {
          console.log(res);
          console.log(res.Info);
          this.resp = res
          // this.snackBar.open(res.info, '', { duration: 2000 });;
          this.snackBar.open(res.Info, '', {
            verticalPosition: 'top',
            duration: 2000,
            panelClass: ['green-snackbar']
          });
        }, error => {
          if (error.error.Status == 500) {
            this.snackBar.open(error.error.Info, '', {
              verticalPosition: 'top',
              duration: 2000,
              panelClass: ['red-snackbar']
            });
          }
          if (error.error.Status == 400) {
            this.snackBar.open(error.error.Info, '', {
              verticalPosition: 'top',
              duration: 2000,
              panelClass: ['red-snackbar']
            });
          }
        })
      }
      else {
        this.snackBar.open("password && confirm password must match", '', {
          verticalPosition: 'top',
          duration: 2000,
          panelClass: ['red-snackbar']
        });
      }
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
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    // this.password=this.userData.Password;
    // this.RegisterForm.controls.firstName.disable();
    console.log(this.userData.ID);
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
    // sessionStorage.removeItem('userData');
    this.service.UpdateProfile(data).subscribe((res: any) => {
      console.log(res);
      console.log(res.result[0]);
      // this.service.role2.next(true);
      sessionStorage.removeItem('userData');
      sessionStorage.setItem('userData', JSON.stringify(res.result[0]));
      this.router.navigate(["user/home"]);
      this.snackBar.open(res.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['green-snackbar'] });
    }, error => {
      if (error.error.Status == 500) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
      if (error.error.Status == 400) {
        this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
      }
    })
    // this.service.update.next(true);
    // this.service.role.next(true);
    // this.router.navigate(["user/home"]);
  }
  updatePassword() {
    // this.RegisterForm.get('firstName').disable()
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    const data = {
      Password: this.RegisterForm.controls.password.value,
      ConfirmPassword: this.RegisterForm.controls.cpassword.value,
      ID: this.userData.ID
    }
    console.log(data);
    if (data.Password == data.ConfirmPassword) {
      this.service.changePassword(data).subscribe((res: any) => {
        console.log(res);
        // this.service.role2.next(true);
        this.router.navigate(["user/home"]);
        this.snackBar.open(res.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['green-snackbar'] });
      }, error => {
        if (error.error.Status == 500) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
        if (error.error.Status == 400) {
          this.snackBar.open(error.error.Info, '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });
        }
      })
    }
    else {
      this.snackBar.open("password && confirm password must match", '', { verticalPosition: 'top', duration: 2000, panelClass: ['red-snackbar'] });

    }
  }


}


