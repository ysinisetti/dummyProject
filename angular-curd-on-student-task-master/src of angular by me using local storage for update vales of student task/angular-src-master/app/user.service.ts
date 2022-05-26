
import { HttpClient, HttpHeaders } from '@angular/common/http';

  import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl: string;
  constructor(private http: HttpClient) {

  }

  public doRegistration(user) {
    return this.http.post("http://localhost:3306/add", user, { responseType: 'text' as 'json' });
  }

  public getUsers(data) {
    return this.http.get("http://172.17.12.155:3306/get");
  }

  public getUserByEmail(email) {
    return this.http.get("http://localhost:3306//findUser/" + email);
  }

  public deleteUser(id) {
    return this.http.delete("http://localhost:3306/delete/{id}" + id);
  }
}