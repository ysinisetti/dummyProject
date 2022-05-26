
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private usersUrl: string;
    router: any;
  path: string;
    constructor(private http: HttpClient) {

    }

    // public doRegistration(user) {
    //     console.log("hit the api");
    // return this.http.post("http://172.17.12.155:8088/add", user, { responseType: 'text' as 'json' });

    // }

    public getUsers() {
        console.log("hit the api");
        return this.http.get("http://172.17.12.110:8088/get");
    }
    public getUsersById(id)
    {
        return this.http.get('http://172.17.12.110:8088/get/'+id);
    }

    // public getUserByEmail(email) {
    // return this.http.get("http://172.17.12.155:8088//findUser/" + email);
    // }

    // public updateUser(id) {
    //     console.log("hit the update api")
        // return this.http.put("http://172.17.12.110:8088/update/" +id,this.httpOptions);
    // }
    httpOptions = {
        headers: new HttpHeaders({
        //   'Content-Type': 'application/json',
        //   'token': 'checking',
          'Access-Control-Allow-Origin': '*'
        })
      };
    

    public deleteUser(id) {
        console.log("hit the delete api");
        return this.http.delete("http://172.17.12.110:8088/delete/" + id,this.httpOptions);
        
    }
}