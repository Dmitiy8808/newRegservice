import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private static readonly URL = 'wss://127.0.0.1:9292/RegistrationOffice';
  private socket$?: WebSocketSubject<any>;
  private connectionStatusSubject$ = new BehaviorSubject<boolean>(false);
  public connectionStatus$: Observable<boolean> = this.connectionStatusSubject$.asObservable();

  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
    }
  }

  private getNewWebSocket(): WebSocketSubject<any> {
    return webSocket({
      url: WebSocketService.URL,
      openObserver: {
        next: () => {
          console.log('WebSocket connection opened');
          this.connectionStatusSubject$.next(true);
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket connection closed');
          this.socket$ = undefined;
          this.connectionStatusSubject$.next(false);
        }
      }
    });
  }

  public sendMessage(msg: any): void {
    if (this.socket$) {
      this.socket$.next(msg);
    } else {
      console.error('Must establish a connection first');
    }
  }

  public getMessages(): Observable<any> {
    if (this.socket$) {
      return this.socket$.asObservable();
    } else {
      console.error('Must establish a connection first');
      return new Subject<any>().asObservable();
    }
  }

  public close(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
