import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SshService {
  private backendUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  startRobot(ip: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/start-robot`, { ip, username, password });
  }

  checkSshConnection(ip: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/check-ssh`, { ip, username, password });
  }

}
