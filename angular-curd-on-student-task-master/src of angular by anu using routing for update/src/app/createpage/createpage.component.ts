import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createpage',
  templateUrl: './createpage.component.html',
  styleUrls: ['./createpage.component.css']
})
export class CreatepageComponent implements OnInit {
  regForm: FormGroup;
  formData: any;
  user: any;
  constructor(private fb: FormBuilder, private http: HttpClient, private router:Router) { }

  ngOnInit() {
    this.regForm = this.fb.group({
      colcode: [''],
      colname: [''],
      email: [''],
      name: [''],
      phno: ['']
    })
  }
  httpOptions = {
    headers: new HttpHeaders({
     'Access-Control-Allow-Origin': '*'
    }) 
  };
  create() {
    // alert('Data has been inserted');
    // return "data has been inserted";
    
    const values = {
      colcode: this.regForm.controls.colcode.value,
      colname: this.regForm.controls.colname.value,
      email: this.regForm.controls.email.value,
      name: this.regForm.controls.name.value,
      phno: this.regForm.controls.phno.value
    }

    this.http.post('http://172.17.12.110:8088/add', values).subscribe(res => {
      this.formData = res;
      console.log(this.formData);
      this.router.navigate(['home']);
    });
  }
  // check(){
   
  // }
}
