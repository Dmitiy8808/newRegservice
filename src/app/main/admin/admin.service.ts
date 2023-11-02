import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AgentsResponse } from 'src/app/shared/models/agent';
import { AgentDataParams } from 'src/app/shared/models/agentDataParams';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  agentDataParams = new AgentDataParams();
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAgentsData(): Observable<AgentsResponse> {

    const httpOptions = {
      withCredentials: true
    };

    return this.http.post<AgentsResponse>(this.baseUrl + '/webregoffice/Admin/GetAgentsData', this.agentDataParams, httpOptions);
  }

  setAgentDataParams(params: AgentDataParams) {
    this.agentDataParams = params;
  }

  getAgentDataParams() {
    return this.agentDataParams;
  }
}



