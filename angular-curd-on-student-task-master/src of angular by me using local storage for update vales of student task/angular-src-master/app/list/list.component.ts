import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  GridData: any;
  del: any;
  studentid: void;
  // option: any;
  // UserService: any;
  // deleteRes: ArrayBuffer;
  constructor(private router: Router, private http: HttpClient, private user: UserService) { }

  ngOnInit() {
    this.griddata();
  }
  
  httpOptions = {
    headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
    })
    };
    
  griddata() {
    this.http.get('http://localhost:8083/student/get').subscribe(data => {
      this.GridData = data;
      console.log("after the method", this.GridData);
    });
  };
  // public deleteUsers(id) {
  //   // let resp = this.UserService.deleteUser();
  //   let resp = this.http.delete('http://172.17.12.155:8083/student/delete' + id);
  //   console.log("method hit")
  //   resp.subscribe((data) => { this.option = data });
  //   console.log("after the method");
  // };
  delete(id) {
    console.log("id", id);
    
    this.http.delete('http://172.17.12.155:8083/student/delete/' + id, this.httpOptions).subscribe(res => {
    this.del = res;
    // alert('starts1');
    this.griddata();
    
    // console.log(this.del);
    });
    }
    edit(id)
    {
      localStorage.setItem('id',id);
      this.router.navigate(['update form'])
    }
  
  // deleteUsers(id){
  //   console.log('abvabvavav'+ id);
  //   this.http.delete('http://localhost:8083/student/delete'+id).subscribe(res =>{
  //     // http://localhost:8083/student/delete'+id
  //     this.del = res;
  //     console.log('delllllll',this.del);
  //     });
  // }
  // remove(){
  // public deleteUser(id: number) {
  //   let resp = this.UserService.deleteUser();
  //   console.log("method hit")
  //   resp.subscribe((data) => { this.option = data });
  //   console.log("after the method");
}