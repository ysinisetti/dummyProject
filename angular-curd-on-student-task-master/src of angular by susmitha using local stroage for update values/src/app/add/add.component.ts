import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserRegistationService2 } from '../user.registration.service2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

user: User=new User("","",0,"" );
message:any;

constructor(private service:UserRegistationService2 ) {}

ngOnInit() {
}


public registerNow(){
let resp=this.service.doRegistration(this.user);
resp.subscribe((data)=>this.message=data);
}

}