import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApisService } from 'src/app/apis.service';

@Component({
  selector: 'app-header-fixing',
  templateUrl: './header-fixing.component.html',
  styleUrls: ['./header-fixing.component.scss']
})
export class HeaderFixingComponent implements OnInit {
  hide: boolean = true;
  constructor(private router: Router, private service: ApisService) {

  }

  ngOnInit() {
    // this.service.role.subscribe(res2 => {
    //   console.log('ins service -------', res2)
    //   // this.roleName = sessionStorage.getItem('roleName');
    //   // this.isLogin = sessionStorage.getItem('isLogin') == 'true' ? true : false;
    //   // this.role = sessionStorage.getItem('role');
    // })
    this.service.role1.subscribe(resp => {
      console.log(resp);
      this.hide = resp
    })

  }
  // ngOnDestroy() {
  //   console.log("wgaifilahfh");
  //   this.service.role1.unsubscribe();

  // }
}
