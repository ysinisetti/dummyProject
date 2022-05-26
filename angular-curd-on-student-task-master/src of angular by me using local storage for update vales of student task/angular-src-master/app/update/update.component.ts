import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  // [x: string]: any;

  sid: any;
  updateForm: FormGroup;
  bindeddata: any;
  // updatedId: string;
  updatedValues: object;
  sid1: string;
  formData3: Object;
  data: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.updateForm = this.fb.group({
      sName: [''],
      cName: [''],
      sBranch: [''],
      cCode: [''],
      pNumber: [''],
      emailId: ['']
    });
    this.binddata();

  }
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
  };
  binddata() {
    this.sid = localStorage.getItem('id');
    console.log(this.sid);
    this.http.get('http://172.17.12.155:8083/student/get/' + this.sid).subscribe(data => {
      this.bindeddata = data;
      console.log(this.bindeddata);

      this.updateForm.controls.sName.patchValue(this.bindeddata.student_name);
      this.updateForm.controls.cName.patchValue(this.bindeddata.college_name);
      this.updateForm.controls.sBranch.patchValue(this.bindeddata.student_branch);
      this.updateForm.controls.cCode.patchValue(this.bindeddata.college_code);
      this.updateForm.controls.pNumber.patchValue(this.bindeddata.phone_number);
      this.updateForm.controls.emailId.patchValue(this.bindeddata.email_id);

    });
  }


  // update() {
  //   this.updatedId = localStorage.getItem('id');
  //   console.log(this.updatedId);

  //   const values = {
  //     // 'id': this.regForm.controls.id.value,
  //     college_code: this.updateForm.controls.cCode.value,
  //     college_name: this.updateForm.controls.cName.value,
  //     email_id: this.updateForm.controls.emailId.value,
  //     phone_number: this.updateForm.controls.pNumber.value,
  //     student_branch: this.updateForm.controls.sBranch.value,
  //     student_name: this.updateForm.controls.sName.value

  //   }
  //   console.log(values);
  //    httpOptions = {
  //     headers: new HttpHeaders({
  //       'Access-Control-Allow-Origin': '*'
  //     })
  //   };

  //   this.http.put('http://172.17.12.155:8083/update/' + this.updatedId, values,http).subscribe(res => {
  //     // console.log(values);
  //     this.updatedValues = res;
  //     console.log(this.updatedValues);
  //     // console.log('data has been updated');
  //     // this.router.navigate(['home']);
  //     // alert('data has been updated');
  //     // this.router.navigate(['home']);
  //   });
  // }
  update() {
    this.sid1 = localStorage.getItem('id');
    console.log(this.sid1);
    const data = {
      student_name: this.updateForm.controls.sName.value,
      college_name: this.updateForm.controls.cName.value,
      student_branch: this.updateForm.controls.sBranch.value,
      phone_number: this.updateForm.controls.pNumber.value,
      college_code: this.updateForm.controls.cCode.value,
      email_id: this.updateForm.controls.emailId.value,
    }
    
    this.http.put('http://172.17.12.155:8083/student/update/' + this.sid1, data, this.httpOptions).subscribe(res => {
      this.formData3 = res;
      console.log(this.formData3);
      // console.log('data has updated');
      this.router.navigate(['list']);

    });
  }
}
