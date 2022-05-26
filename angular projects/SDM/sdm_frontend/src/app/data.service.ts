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
    return this.http.get(url).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }
  getUserProjects(url: string,loginId:any):Observable<any>{
    console.log(url + '?loginId=' + loginId);
    return this.http.get<any>(url + '?loginId=' + loginId);
    }
  post(url: string, body: any) {
    console.log('Entered Postrequest')

    return this.http.post(url, body).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }

  /////////////////////Defects//////////////////////////
  put(url: string, dataToAPI: any) {
    return this.http.put(url, dataToAPI).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }
  delete(url: string, dataToAPI: any) {
    return this.http.delete(url, dataToAPI).pipe(
      map(res => res),

      // catchError((err) => of(this.handleError(err))),
    )
  }
  putTextResponse(url: string, body: any) {
    return this.http.put(url, body, { responseType: 'text' }).pipe(map(res => res))
  }

  //////////////////////////Common//////////////////////////
  postTextResponse(url: string, body: any) {
    return this.http.post(url, body, { responseType: 'text' }).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }
  getTextResponse(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }

  updateReleases(url: string, body: any): Observable<any> {
    console.log('update url', url)
    return this.http.put(url, body, { responseType: 'json' }).pipe(map(res => res))
  }

  //  deleteRelease(url: string,id){
  //   return this.http.delete(url,id);
  //  }

  // getTodo(url: string,body): Observable<any> {
  //   return this.http.get(url,body).pipe(
  //     map(res => res),
  //     // catchError((err) => of(this.handleError(err))),
  //   )
  // }

  /////todo
  getTodo(url: string, body: any): Observable<any> {
    console.log('body', body)
    console.log('url', url)
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const httpOptions = {
      headers: reqHeader,
      body: body,
    }
    return this.http.get(url, httpOptions).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }
  /////////Releases////
  deleteRelease(url: string, body: any): Observable<any> {
    console.log('body', body)
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const httpOptions = {
      headers: reqHeader,
      body: body,
    }
    return this.http.delete(url, httpOptions).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }

  getById(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'json' }).pipe(map(res => res))
  }

  // delById(url:string,body:any){
  //   return this.http.delete(url, body, { responseType: 'text' }).pipe(
  //     map((res) => res),
  // catchError((err) => of(this.handleError(err))),
  //   )
  // }

  ////////////////////SubProjects///////////////////////

  getSubprojects(url: string, id): Observable<any> {
    console.log('id', id)

    return this.http.get(url + '/' + id).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }
  //////////////////////Documents/////////////////////////
  delDocData(url: string, body: any): Observable<any> {
    console.log('body', body)
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const httpOptions = {
      headers: reqHeader,
      body: body,
    }
    return this.http.post(url, httpOptions).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }
  updateDocData(url: string, body: any): Observable<any> {
    return this.http.post(url, body, { responseType: 'json' }).pipe(map(res => res))
  }
  ///////////////////////Resources//////////////////////////
  updateResource(url: string, dataToAPI: any) {
    console.log('Entered Postrequest')

    return this.http.post(url, dataToAPI).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }

  deleteResource(url: string, body: any): Observable<any> {
    console.log('body', body)
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const httpOptions = {
      headers: reqHeader,
      body: body,
    }
    return this.http.post(url, httpOptions).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }
  postResource(url: string, dataToAPI: any) {
    console.log('Entered Postrequest')

    return this.http.post(url, dataToAPI).pipe(
      map(res => res),
      // catchError((err) => of(this.handleError(err))),
    )
  }
  
///MIlestones
 postDev(url: string, dataToAPI2: any) {
  console.log('Add deliverables')
  return this.http.post(url, dataToAPI2).pipe(map(res => res))
}
delById(url: string, body: any) {
  console.log('body', body)
  var reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
  })
  const httpOptions = {
    headers: reqHeader,
    body: body,
  }
  return this.http.delete(url, httpOptions).pipe(
    map(res => res),
    // catchError((err) => of(this.handleError(err))),
  )
}
getDeliverables(url: string): Observable<any> {
  return this.http.get(url, { responseType: 'json' }).pipe(map(res => res))
}
updateDeliverables(url: string, dataToAPI2: any) {
  console.log('Enetr put request')

  return this.http.post(url, dataToAPI2).pipe(map(res => res))
}
 

  /////////////MYTASKS///////
  getMyTasks(url: any, assginedTo: any, projectId: any): Observable<any> {
    return this.http.get<any>(url + '?projectId=' + projectId + '&assignedTo=' + assginedTo)
  }

  ///////// Scope
  getHierarchy(url: any, projectId: any): Observable<any> {
    return this.http.get<any>(url + projectId)
  }
}
