import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserRegistationService2 } from '../user.registration.service2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})

export class UpdateComponent implements OnInit {
  [x: string]: any;
  id: number;
  user: any;
  reqId : any;
  updateForm:FormGroup;
  responseData: any;
  message:any;

  constructor(private service: UserRegistationService2, private fb: FormBuilder, private route: ActivatedRoute) { }

  public getUserById(id:number){
    let resp= this.service.getUserById(id);
    resp.subscribe((data)=>this.user=data);
   }

  ngOnInit() {
    this.updateForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      phonenumber: [''],
      email: ['']
    });
  
      this.id = this.route.snapshot.params['id'];
      console.log("#####", this.id )
    this.bindSData();

    }
  bindSData() {
    this.service.getUserById(this.id).subscribe(res=>{
      this.responseData= res;
      console.log(this.responseData);
      this.updateForm.controls.firstname.patchValue(this.responseData.firstname);
      this.updateForm.controls.lastname.patchValue(this.responseData.lastname);
      this.updateForm.controls.phonenumber.patchValue(this.responseData.phonenumber);
      this.updateForm.controls.email.patchValue(this.responseData.email);
    })
    
  }

  public update(){
    const data = {
        email: this.updateForm.controls.email.value,
        firstname: this.updateForm.controls.firstname.value,
        id: this.id,
        lastname: this.updateForm.controls.lastname.value,
        phonenumber: Number(this.updateForm.controls.phonenumber.value)
    }
    let resp=this.service.update(this.id, data);
    resp.subscribe((res)=>this.message=res);
    }

}

