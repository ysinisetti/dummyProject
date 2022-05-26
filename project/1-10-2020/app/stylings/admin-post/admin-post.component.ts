import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-post',
  templateUrl: './admin-post.component.html',
  styleUrls: ['./admin-post.component.scss']
})
export class AdminPostComponent implements OnInit {
  data: any;

  constructor(private httpClient:HttpClient ) { }

  ngOnInit(){
this.httpClient.get("assets/links.json").subscribe((data1: any)=>{
  console.log(data1);
  this.data=data1;
})
  }

}
