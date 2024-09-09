import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { LocalizationComponent } from './localization/localization.component';
import { KillsComponent } from './kills/kills.component';
import { StatusComponent } from './status/status.component';
import { KillStatusComponent } from "./kill-status/kill-status.component";
import { CameraFeedComponent } from "./camera-feed/camera-feed.component";
import { ThrustersComponent } from "./thrusters/thrusters.component";
import { MissionsComponent } from "./missions/missions.component";
import { SshService } from './ssh.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatGridListModule,
    LocalizationComponent,
    KillsComponent,
    StatusComponent,
    KillStatusComponent,
    CameraFeedComponent,
    ThrustersComponent,
    MissionsComponent,
    CommonModule,
    FormsModule
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  robotIp: string = '';
  username:string = '';
  password:string = '';
  connectionStatus:string = '';



  constructor(private sshService: SshService) {}

  checkSshConnection(){
    this.sshService.checkSshConnection(this.robotIp, this.username, this.password).subscribe(
      (response) => {
        this.connectionStatus = response.status === 'success' ? 'Connected' : 'Failed to connect';
        console.log('SSH Connection Status: ', response);
      },
      (error) => {
        this.connectionStatus = 'Failed to connect';
        console.error('Error checking SSH connection:', error);
      }
    );
  }
  startROS(){
    this.sshService.startRobot(this.robotIp, this.username, this.password).subscribe(
      (response) => {
        this.connectionStatus = response.status === 'success' ? 'Connected' : 'Failed to connect';
        console.log('SSH Connection Status: ', response);
      },
      (error) => {
        this.connectionStatus = 'Failed to connect';
        console.error('Error checking SSH connection:', error);
      }
    );
  }
}
