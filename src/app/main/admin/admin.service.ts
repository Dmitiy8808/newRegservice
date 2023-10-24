import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AgentData } from 'src/app/shared/models/agentData';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAgentsData() {

    const httpOptions = {
      withCredentials: true
    };

    const payload : AgentData= {
      _search: false,
      nd: 1698130769353, // Note: this value might need to change or be dynamic
      rows: 20,
      page: 1,
      sidx: 'AgentName',
      sord: 'asc',
      Page: 1,
      Rows: 20,
      Sidx: 'AgentName',
      Sord: 'asc',
      Login: null,
      PersonId: -1,
      PersonFio: null,
      Snils: null,
      AgentId: -1,
      AgentName: null,
      Inn: null,
      Kpp: null
    };

    return this.http.post(this.baseUrl + '/webregoffice/Admin/GetAgentsData', payload, httpOptions);
  }
}



