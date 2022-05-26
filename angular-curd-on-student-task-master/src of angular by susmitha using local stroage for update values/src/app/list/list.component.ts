import { Component, OnInit } from '@angular/core';
import { UserRegistationService2 } from '../user.registration.service2';
import { User } from '../user';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  [x: string]: any;
    users:any;
    email:string;
    message:any;
    constructor(private service:UserRegistationService2) { }
  
  
  public delteUser(id:number){
   let resp= this.service.deleteUser(id);
   resp.subscribe((data)=>this.users=data);
  }
  public getUserByEmail(email:string){
    let resp= this.service.getUserByEmail(email);
    resp.subscribe((data)=>this.users=data);
   }


   ngOnInit() {
     
  
      let resp=this.service.getUsers();
      resp.subscribe((data)=>this.users=data);
    }
    
    }
    
  

  
  
