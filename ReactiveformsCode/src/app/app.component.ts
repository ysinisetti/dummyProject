import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
tagsgroup : FormGroup ;

constructor(private fb: FormBuilder){
 
}

ngOnInit(){

  this.tagsgroup = this.fb.group({
    name : [''],
    email : [''],
    password : [''],
    phone : [''],
    birth : [''],
    file : [''],
    salary : [''],
    color : [''],
    gender : [''],
    skill : [''],
    city : ['']

    

    });
    

}

getData(){
  console.log(this.tagsgroup.value);
}
}
