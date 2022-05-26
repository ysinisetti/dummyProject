import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from 'src/app/create-post/create-post.component';
import { ApisService } from 'src/app/apis.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  role: string;
  isLogin: boolean;
  roleName: any;
  // role:any;
  roles: any;
  role2: boolean;
  resp: any;
  firstParam: any;
  roll: any;
  User: any = "User";
  subscription: Subscription;
  userrole: any;
  update:any="updateProfile";
  changePaword:any="changePassword";



  constructor(private router: Router, private dialog: MatDialog, private service: ApisService, private route: ActivatedRoute) { }
  

  // roll1: any = this.route.snapshot.queryParamMap;
  // loginRole = this.roll1.params.roll


  ngOnInit() {
    // this.refres();
    // this.service.role.subscribe(resp => {
    //  console.log(resp);
    // })

    if (sessionStorage.getItem('isLogin')) {
      this.userrole =  JSON.parse(sessionStorage.getItem('userData'));
      this.roleName=this.userrole.FirstName;
      this.isLogin = sessionStorage.getItem('isLogin') == 'true' ? true : false;
      this.role = sessionStorage.getItem('role');
    }

    this.service.role.subscribe(res2 => {
      console.log('ins service -------', res2)
      // this.userrole =  JSON.parse(sessionStorage.getItem('userData'));
      // this.roleName=this.userrole.FirstName;
      this.isLogin = sessionStorage.getItem('isLogin') == 'true' ? true : false;
      this.role = sessionStorage.getItem('role');
    })

    // this.service.role2.subscribe(resp => {
    //   // this.roleName = resp;
    // })




    // console.log('called oninit')
    // this.roleName = sessionStorage.getItem('roleName');
    // console.log(this.roleName);
    // this.roles = sessionStorage.getItem('roll');
    // console.log(this.role);
    // if (this.roles === "User") {
    //   //   this.service.role.subscribe(res => {
    //   //     console.log(res);
    //   //     this.resp = res
    //   this.role = true;
    //   // })
    //   // this.role = true;
    //   // console.log(this.role);
    // } else if (this.roles === "Admin") {
    //   this.role2 = true;
    //   console.log(this.role2);
    // }

  }

  // refres() {
  //    this.service.update.subscribe((res: any) => {
  //     console.log(res);
  //     // this.ngOnInit();

  //     if (sessionStorage.getItem('isLogin')) {
  //       this.userrole =  JSON.parse(sessionStorage.getItem('userData'));
  //       this.roleName=this.userrole.FirstName;
  //       this.isLogin = sessionStorage.getItem('isLogin') == 'true' ? true : false;
  //       this.role = sessionStorage.getItem('role');
  //     }
  //   })

  //   this.service.role.subscribe(res2 => {
  //     console.log('ins service -------', res2)
  //     // this.userrole =  JSON.parse(sessionStorage.getItem('userData'));
  //     // this.roleName=this.userrole.FirstName;
  //     this.isLogin = sessionStorage.getItem('isLogin') == 'true' ? true : false;
  //     this.role = sessionStorage.getItem('role');
  //   })

  // }


  home() {
    this.router.navigate(["user/home"]);

  }
  myPosts() {
    this.router.navigate(["user/myPosts"]);

  }
  welcome() {

  }
  requested() {

    this.router.navigate(["user/requestPost"]);

  }
  approved() {
    this.router.navigate(["user/approvedposts"]);
  }
  rejected() {
    this.router.navigate(["user/rejectedPosts"]);

  }
  alerts() {
    this.router.navigate(["user/Alerts"]);
  }

  editProfile() {
    // { queryParams: { 'roll': roll } });
    // sessionStorage.removeItem('userData');
    this.router.navigate(["Registration"], { queryParams: { 'update':this.update  } });
  }
  createPost() {
    this.dialog.open(CreatePostComponent)
    // this.router.navigate(["createPost"]);

  }
  logOut() {
    sessionStorage.removeItem('isLogin');
    sessionStorage.removeItem('role');
    this.isLogin = false;
    this.role2 = false;
    this.router.navigate([""]);
    sessionStorage.removeItem('userData');
  }
  changePassword(){
    this.router.navigate(["Registration"], { queryParams: { 'update':this.changePaword  } });
}


}