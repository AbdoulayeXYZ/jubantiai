import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private connectionStatus = new BehaviorSubject<boolean>(navigator.onLine);
  public connection$ = this.connectionStatus.asObservable();

  constructor() {
    this.initializeConnectionMonitoring();
  }

  private initializeConnectionMonitoring() {
    window.addEventListener('online', () => this.connectionStatus.next(true));
    window.addEventListener('offline', () => this.connectionStatus.next(false));
  }

  isConnected(): boolean {
    return this.connectionStatus.value;
  }
}
