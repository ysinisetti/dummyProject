import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class ApisService {
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private url= 'http://localhost:5000';

  public postRequested = new BehaviorSubject<any>({});
  public role = new Subject<any>();
  public role1 = new Subject<any>();
  public roleUser = new Subject<any>();
  public approvedArray = new BehaviorSubject<any>([]);
  public rejectedArray = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) {
    
  
  }
  postRegistration(data) {
    return this.http.post(this.url+'/registrationdata', data, { 'headers': this.headers });
  }
  
  LoginPost(data) {
    return this.http.post(this.url+'/login', data,{ 'headers': this.headers });
  }
  getPost()
  {
    return this.http.get(this.url+'/adminhome', { 'headers': this.headers }) ;
  }
  createPost(data){
    return this.http.post(this.url+'/createpost', data,{ 'headers': this.headers });
  }
  getMyPosts(data){
    return this.http.get(this.url + '/mypost',data);
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
