import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApisService } from '../apis.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  hide: boolean = true;
  RegisterForm: FormGroup;
  name = "Register"
  newFile: any;

  constructor(private rf: FormBuilder, private router: Router, private service: ApisService) { }

  ngOnInit() {
    this.RegisterForm = this.rf.group({
      firstName: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      phoneNumber: [''],
      userName: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&].{7,}')]],
      cpassword: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&].{7,}')]],
      gender: ['']
    })
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
      }
    console.log(data);
    this.service.postRegistration(data).subscribe(res => {
      console.log(res);
    })
    this.RegisterForm.reset();
    this.router.navigate([""]);
  }

  // onFileChange(event) {
  //   console.log('eee', event)
  //   this.newFile = event.target.files[0]
  //   console.log('newfile', this.newFile)
  //   this.RegisterForm.get('attachment').setValue('file')
  // }

}
}