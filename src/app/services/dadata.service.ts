import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DadataService {

  private url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
  private token = '527fb2e3f0d51051eb2819e252efbea8dfd93c9a'; 

  constructor(private http: HttpClient) {}

  getSuggestions(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Token ${this.token}`
    });

    return this.http.post(this.url, { query }, { headers });
  }

}
