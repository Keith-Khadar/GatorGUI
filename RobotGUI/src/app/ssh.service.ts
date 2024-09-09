import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client'


@Injectable({
  providedIn: 'root'
})
export class SshService {
  private backendUrl = 'http://localhost:5000';
  private socket = io(this.backendUrl);

  constructor(private http: HttpClient) { }

  startRobot(ip: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/start-robot`, { ip, username, password });
  }

  getRobotOutput() {
    return new Observable<string>(observer => {
      this.socket.on('robot_output', (data: { data: string }) => {
        observer.next(data.data);
      });
    });
  }

}
