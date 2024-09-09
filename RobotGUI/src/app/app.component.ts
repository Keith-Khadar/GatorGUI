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
  robotIp: string = '10.245.80.200';
  username:string = 'mil';
  password:string = 'fuelsnob';
  connectionStatus:string = '';
  output: string[] = [];
  isConnected = false;



  constructor(private sshService: SshService) {}

  ngOnInit() {
    this.sshService.getRobotOutput().subscribe(data => {
      this.output.push(data);
    });
  }

  startROS(){
    this.sshService.startRobot(this.robotIp, this.username, this.password).subscribe(
      (response) => {
        this.isConnected = true;
      },
      (error) => {
        console.error('Error checking SSH connection:', error);
      }
    );
  }
}
