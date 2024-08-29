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
    MissionsComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'RobotGUI';
}
