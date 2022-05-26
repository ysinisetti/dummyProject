import { Injectable } from '@angular/core'
import { HttpHeaders, HttpClient } from '@angular/common/http'
import { Observable, of, BehaviorSubject } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { DomSanitizer } from '@angular/platform-browser'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  isLoading = new BehaviorSubject(false)
  constructor(private http: HttpClient, private domSanitizer: DomSanitizer) {}
  get(url: string): Observable<any> {
    return this.http.get(url).pipe(map(res => res))
  }
  post(url: string, body: any) {
    return this.http.post(url, body).pipe(map(res => res))
  }

  /////////////////////Defects//////////////////////////
  put(url: string, dataToAPI: any) {
    return this.http.put(url, dataToAPI).pipe(map(res => res))
  }
  delete(url: string, dataToAPI: any) {
    return this.http.delete(url, dataToAPI).pipe(map(res => res))
  }
  putTextResponse(url: string, body: any) {
    return this.http.put(url, body, { responseType: 'text' }).pipe(map(res => res))
  }

  //////////////////////////Common//////////////////////////
  postTextResponse(url: string, body: any) {
    return this.http.post(url, body, { responseType: 'text' }).pipe(map(res => res))
  }
  getTextResponse(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' }).pipe(map(res => res))
  }

  //////////////////////getMyProjects
  getUserProjects(url: string, loginId: any): Observable<any> {
    return this.http.get<any>(url + '?loginId=' + loginId)
  }

  /////////////////////////////Get Tasks
  getMyTasks(url: any, assginedTo: any, projectId: any): Observable<any> {
    return this.http.get<any>(url + '?projectId=' + projectId + '&assignedTo=' + assginedTo)
  }

  ///////////////////////Issues
  getIssuesById(url: any, id: any): Observable<any> {
    return this.http.get<any>(url + id)
  }
  /////////Releases////
  deleteRelease(url: string, body: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const httpOptions = {
      headers: reqHeader,
      body: body,
    }
    return this.http.delete(url, httpOptions).pipe(map(res => res))
  }
  getById(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'json' }).pipe(map(res => res))
  }
  getHierarchy(url: any, projectId: any): Observable<any> {
    return this.http.get<any>(url + projectId)
  }

  //////////SubProjects
  getSubprojects(url: string, body): Observable<any> {
    return this.http.post(url + '/', body).pipe(map(res => res))
  }

  //////////////////////Documents
  delDocData(url: string, body: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const httpOptions = {
      headers: reqHeader,
      body: body,
    }
    return this.http.post(url, httpOptions).pipe(map(res => res))
  }
  updateDocData(url: string, body: any): Observable<any> {
    return this.http.post(url, body, { responseType: 'json' }).pipe(map(res => res))
  }
  postblob(url: string, body: any) {
    // let blob:any = new Blob([body], { type: 'text/json; charset=utf-8' });
    return this.http.post(url, body, { responseType: 'blob' }).pipe(map(res => res))
  }

  ///////////////////////Resources
  updateResource(url: string, dataToAPI: any) {
    return this.http.post(url, dataToAPI).pipe(map(res => res))
  }
  deleteResource(url: string, body: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const httpOptions = {
      headers: reqHeader,
      body: body,
    }
    return this.http.post(url, httpOptions).pipe(map(res => res))
  }
  postResource(url: string, dataToAPI: any) {
    return this.http.post(url, dataToAPI).pipe(map(res => res))
  }
  delById(url: string, body: any) {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const httpOptions = {
      headers: reqHeader,
      body: body,
    }
    return this.http.delete(url, httpOptions).pipe(map(res => res))
  }

  ////////////// slaget//////////////
  getSla(url: string, id): Observable<any> {
    return this.http.get(url + '/' + id).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }

  //////////////// Status Tracker Data Service

  updateStatus(url: string, updated: any) {
    return this.http.post(url, updated).pipe(map(res => res))
  }

  deleteStatus(url: string, body: any): Observable<any> {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const httpOptions = {
      headers: reqHeader,
      body: body,
    }
    return this.http.post(url, httpOptions).pipe(map(res => res))
  }
  postStatus(url: string, dataToAPI: any) {
    console.log('Entered Postrequest')
    return this.http.post(url, dataToAPI).pipe(map(res => res))
  }

  ////////////////////////Milestones

  updateDeliverables(url: string, dataToAPI2: any) {
    return this.http.post(url, dataToAPI2).pipe(map(res => res))
  }
  postDev(url: string, dataToAPI2: any) {
    console.log('Add deliverables')
    return this.http.post(url, dataToAPI2).pipe(map(res => res))
  }
}
