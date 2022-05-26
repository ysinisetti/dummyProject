import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  regForm: FormGroup;
  formData: any;
  constructor(private fb: FormBuilder, private http: HttpClient,private router:Router) { }
  ngOnInit() {
    this.regForm = this.fb.group({
      sName: [''],
      cName: [''],
      sBranch: [''],
      cCode: [''],
      pNumber: [''],
      emailId: ['']
    });
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
  };

  add() {
    console.log(this.regForm.value);
    const data = {
      college_code: this.regForm.controls.cCode.value,
      college_name: this.regForm.controls.cName.value,
      email_id: this.regForm.controls.emailId.value,
      phone_number: this.regForm.controls.pNumber.value,
      student_branch: this.regForm.controls.sBranch.value,
      student_name: this.regForm.controls.sName.value
    }
    this.http.post('http://172.17.12.155:8083/student/add', data, this.httpOptions).subscribe(res => {
      this.formData = res;
      console.log(res);
      this.router.navigate(['list']);
    });


    // this.http.post('localhost:8083/student/add', data).subscribe(res => {
    //     this.formData = res;
    //     console.log(this.formData);
    //     // alert('starts2' + this.formData);
    //   });
  }
}
