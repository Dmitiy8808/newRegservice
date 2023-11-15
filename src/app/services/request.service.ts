import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Partner } from '../shared/models/partner';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Person } from '../shared/models/person';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAgentInformation(inn: string, kpp: string): Observable<Partner> {
    const payload = {
      inn: inn,
      kpp: kpp
    };
    const httpOptions = {
      withCredentials: true
    };

    return this.http.post<Partner>(this.baseUrl + '/WebRegOffice/Admin/GetAgentInformation', payload, httpOptions);
  }

  getPersonInformation(snils: string): Observable<Person> {
    const payload = {
      snils: snils,
    };
    const httpOptions = {
      withCredentials: true
    };

    return this.http.post<Person>(this.baseUrl + '/WebRegOffice/Admin/GetPersonInformation', payload, httpOptions);
  }

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
