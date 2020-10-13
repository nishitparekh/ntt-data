import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import { GLOBAL } from './app.const';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  public makeServerCall(serviceURL: string, httpMethod: string, param?: any): Observable<any> {
    let params = param;
    let url = '';
    let headers = {};
    let requestOptions = {};

    headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    params = params && JSON.stringify(params);
    requestOptions = {
      headers,
      body: params,
    };
    url = `${GLOBAL.SERVICE_BASE_URL}${serviceURL}`;
    return this.http.request(
      httpMethod,
      url,
      requestOptions,
    ).map(this.extractData)
      .catch(this.handleError);
  }

  private handleError = (error: Response | any) => {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      // tslint:disable-next-line:no-string-literal
      const err = body['error'] || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return throwError(errMsg);
  }

  private extractData = (res: Response) => {
    return res;
  }

}
