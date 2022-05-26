import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-updatepage',
  templateUrl: './updatepage.component.html',
  styleUrls: ['./updatepage.component.css']
})
export class UpdatepageComponent implements OnInit {
  [x: string]: any;
  regForm: FormGroup;
  formData: any;
  updatevalues: object;
  updatedValues: any;
  reqId: any;
  updatedId: any;
  updateUser: any;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.regForm = this.fb.group({
      colgcodecontrol: [''],
      colgnameControl: [''],
      emailControl: [''],
      nameControl: [''],
      phnoControl: ['']
    })
    this.getDetails();
    // this.updatedData();
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    })
  };
  getDetails() {
    this.reqId = localStorage.getItem('id');
    console.log(this.reqId);

    this.http.get('http://172.17.12.110:8088/get/' + this.reqId).subscribe(res => {
      this.formData = res;
      console.log(this.formData);
      //  console.log("now patch values");
      this.regForm.controls.colgcodecontrol.patchValue(this.formData.colcode);
      console.log(this.formData.colcode);
      this.regForm.controls.colgnameControl.patchValue(this.formData.colname);
      // console.log(this.formData.colname);
      this.regForm.controls.emailControl.patchValue(this.formData.email);
      this.regForm.controls.nameControl.patchValue(this.formData.name);
      this.regForm.controls.phnoControl.patchValue(this.formData.phno);
    });
  }
  updatedData() {
    this.updatedId = localStorage.getItem('id');
    console.log(this.updatedId);

    const values = {
      // 'id': this.regForm.controls.id.value,
      colcode: Number(this.regForm.controls.colgcodecontrol.value),
      colname: this.regForm.controls.colgnameControl.value,
      email: this.regForm.controls.emailControl.value,
      name: this.regForm.controls.nameControl.value,
      phno: Number(this.regForm.controls.phnoControl.value)
    };
    console.log(values);

    this.http.put("http://172.17.12.110:8088/update/" + this.updatedId, values).subscribe(values => {
      // console.log(values);
      this.updatedValues = values;
      console.log(this.updatevalues);
      // console.log('data has been updated');
      // this.router.navigate(['home']);
      // alert('data has been updated');
      this.router.navigate(['home']);
    })
  }
}
