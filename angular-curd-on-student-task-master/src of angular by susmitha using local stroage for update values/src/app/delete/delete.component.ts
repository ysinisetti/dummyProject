import { Component, OnInit } from '@angular/core';
import { UserRegistationService2 } from '../user.registration.service2';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  [x: string]: any;
  users:any;
  email:string;
  message:any;
  constructor(private service:UserRegistationService2) { }

    public delteUser(id:number){
      let resp= this.service.deleteUser(id);
      resp.subscribe((data)=>this.users=data);
     }
  

  ngOnInit() {
    let resp=this.service.getUsers();
    resp.subscribe((data)=>this.users=data);
  
  }

}
