import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApisService } from 'src/app/apis.service';

@Component({
  selector: 'app-header-fixing',
  templateUrl: './header-fixing.component.html',
  styleUrls: ['./header-fixing.component.scss']
})
export class HeaderFixingComponent implements OnInit, OnDestroy {
  hide: boolean = true;
  constructor(private router: Router, private service: ApisService) {

  }

  ngOnInit() {
    this.service.role1.subscribe(resp => {
      console.log(resp);
      this.hide = sessionStorage.getItem('isAlerts') == 'true' ? false : true;
    })

  }
  ngOnDestroy() {
    console.log("wgaifilahfh");
    // this.service.roleUser.subscribe(resp => {
    //   this.hide = true;
    // })
    if (this.hide) {
      this.service.role1.unsubscribe();
  }
  }
}
