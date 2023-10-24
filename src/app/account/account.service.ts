import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LogonResponse } from '../shared/models/logonResponse';
import { UserForLogOn } from '../shared/models/userForLogOn';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserLogonSource = new BehaviorSubject<LogonResponse | null>(null);
  currentUserLogOnResponse$ = this.currentUserLogonSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  // Function to get a cookie by its name
  getCookie(name: string): string | null {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length == 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  // Function to check if the auth token exists in the cookies
  isLoggedIn(): boolean {
    return this.getCookie('Login') !== null;
  }


  login(userForLogOn: UserForLogOn) {
    const headers = new HttpHeaders({
      'Target-Endpoint': 'https://regservice.1c.ru/webregoffice/Authorisation/LogOn'
    });

    const httpOptions = {
      withCredentials: true
    };

    return this.http.post<LogonResponse>(this.baseUrl + '/WebRegOffice/Authorisation/LogOn', userForLogOn, httpOptions).pipe(
      tap(response => {
        if (response.isLoggedIn) {
          console.log('Пользователь авторизован');
        }
      }),
      map(response => {
        this.currentUserLogonSource.next(response);
        return response;
      })
    );
  }

}
