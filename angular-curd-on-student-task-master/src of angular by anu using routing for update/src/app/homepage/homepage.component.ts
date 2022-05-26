import { Component, OnInit } from '@angular/core';
import { UserService } from '../Studentapi';
import { Router } from '@angular/router';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  GridData: any;
  service: any;
  option: any;
  UserService: any;
  http: any;
  deleteRes: Object;
  updatevalues: Object;

  constructor(private user: UserService, private router: Router) { }

  ngOnInit() {
    this.griddata();
    // this.deleteuser(id);
  }
  griddata() {
    console.log("method hit")
    this.user.getUsers().subscribe(data => {
      this.GridData = data;
      console.log("after the method");
    });
  }
  deleteuser(id: number) {
    console.log(id);
    this.user.deleteUser(id).subscribe(res => {
      this.deleteRes = res;
      this.griddata();
      // console.log('this.deleteRes', this.deleteRes);
      // this.router.navigate(['home']);
    });
  }
  updated(id) {
 localStorage.setItem('id', id);
    this.router.navigate(['updatepage']);
    // console.log(id);
    // this.user.updateUser(id).subscribe(values => {
    //   this.updatevalues = values;
    //   console.log('this.updatevalues', this.updatevalues);
    //   console.log("after the method");
    // })
  }
}
