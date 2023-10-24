import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRegRequestStateData(postData: any) {
    const httpOptions = {
      withCredentials: true
    };
    return this.http.post<any>(this.baseUrl + '/webregoffice/RegRequests/GetRegRequestStateData', postData, httpOptions);
  }

  getUserAccessRights() {
    const postData = {};
    const httpOptions = {
      withCredentials: true
    };
    console.log('адрес пост запроса ' + this.baseUrl);
    return this.http.post<any>(this.baseUrl + '/webregoffice/RegRequests/GetUserAccessRights', postData, httpOptions);
  }
}
