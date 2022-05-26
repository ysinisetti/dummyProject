import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class ApisService {
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private url = 'http://localhost:5000';

  // public postRequested = new BehaviorSubject<any>({});
  public role = new Subject<any>();
  public role1 = new Subject<any>();
  // public role2 = new Subject<any>();
  // public roleUser = new Subject<any>();
  public editPost = new BehaviorSubject<any>({});
 

  constructor(private http: HttpClient) {


  }
  postRegistration(data) {
    return this.http.post(this.url + '/registrationdata', data, { 'headers': this.headers });
  }

  LoginPost(data) {
    return this.http.post(this.url + '/login', data, { 'headers': this.headers });
  }


  UpdateProfile(data) {
    return this.http.put(this.url + '/update', data, { 'headers': this.headers });
  }
  getPost() {
    return this.http.get(this.url + '/adminhome', { 'headers': this.headers });
  }
  createPost(data) {
    return this.http.post(this.url + '/createpost', data, { 'headers': this.headers });
  }
  getMyPosts(data) {
    return this.http.get(this.url + '/mypost'+'/'+ data);
  }
  requestMyposts() {
    return this.http.get(this.url + '/request', { 'headers': this.headers });
  }
  getRequestedPosts() {
    return this.http.get(this.url + '/rejected', { 'headers': this.headers });
  }

  approvePosts(data) {
    return this.http.put(this.url + '/approve', data, { 'headers': this.headers });
  }

  rejectPosts(data){
    return this.http.put(this.url + '/reject', data, { 'headers': this.headers });
  }
  deletePost(data){
    return this.http.delete(this.url + '/deletepost'+'/'+ data, { 'headers': this.headers });
  }
  updatePost(data){
    return this.http.put(this.url + '/editpost', data, { 'headers': this.headers });
  }
  getAlerts() {
    return this.http.get(this.url + '/alerthome', { 'headers': this.headers });
  }
  createAlerts(data) {
    return this.http.post(this.url + '/createalert', data, { 'headers': this.headers });
  }
  deleteAlerts(data){
    return this.http.delete(this.url + '/deletealert'+'/'+ data, { 'headers': this.headers });
  }
  updateAlerts(data){
    return this.http.put(this.url + '/updatealert', data, { 'headers': this.headers });
  }
  getAlertsStatus(){
    return this.http.get(this.url + '/alertstatus', { 'headers': this.headers });
  }


}




// getPost(data)
//   {
//     console.log(data);
//     return this.http.post(this.url,data, { 'headers': this.headers })
//     .pipe(catchError(this.handleError));
//   }

//   getUpdate(updateInput)
//   {
//     return this.http.patch(this.url+'/'+updateInput.id,updateInput.info, { 'headers': this.headers }).pipe(catchError(this.handleError))
//   }

//   getSearch(data)
//   {

//     return this.http.get(this.url+'/search/findByEmailLike?email='+data.value, { 'headers': this.headers }).pipe(catchError(this.handleError));
//     // http://localhost:8080/mSS_Models/search/findByEmailLike?email=adharmadhikari@d 
//   }
//   getDetails(data2)
//   {
//     let num:number=data2;
//     return this.http.get(this.url+'/'+num,{ 'headers': this.headers }).pipe(catchError(this.handleError));
//   }

//   getOtherSearch(data)
//   {
//     return this.http.get(this.url+'/search/findByAnythingLike?input_text='+data.value).pipe(catchError(this.handleError));
//     // http://localhost:8080/mSS_Models/search/findByAnythingLike?input_text=k
//   }

//   getDepartmentWise(data)
//   {
//     return this.http.get(this.url+'/search/findByDepartment?department='+data.value).pipe(catchError(this.handleError));
//     // http://localhost:8080/mSS_Models/search/findByDepartment?department=Operations
//   }



// }
