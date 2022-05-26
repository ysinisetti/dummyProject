import { Component, OnInit } from '@angular/core';
import { Test } from './Test';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.css']
})
export class RegComponent implements OnInit {
  name = 'sarath';
  constructor() { }
test: Test = new Test();
  ngOnInit() {
  }
   display()
   {
     console.log(this.test);
     console.log(this.test.name);
   }
}
