import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserRegistationService2 {

  constructor(private http:HttpClient) { }


  public doRegistration(user){
    return this.http.post("http://localhost:8026/add",user,{responseType:'text' as 'json'});
  }
  
  public deleteUser(id){
    return this.http.delete("http://localhost:8026/cancel/"+id);
  }

  public getUsers(){
    return this.http.get("http://localhost:8026/getAllUsers");
  }

  public getUserByEmail(email){
    return this.http.get("http://localhost:8026/getUserByEmail/"+email);
  }
  public getUserById(id){
    return this.http.get("http://localhost:8026/getUserById/" +id);
  }

  public update(id,data) {
    return this.http.put("http://localhost:8026/update/" +id,data , {responseType : 'text'});
    }

 
}