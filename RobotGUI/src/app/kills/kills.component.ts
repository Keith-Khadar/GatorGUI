import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoslibService } from '../roslib-service.service';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AlarmMSG{
  alarm_name: string,
  raised: boolean,
  node_name: string,
  problem_description: string,
  parameters: string,
  severity: number
}




@Component({
  selector: 'app-kills',
  standalone: true,
  imports: [MatButtonModule, MatButton, MatIconModule, FormsModule, CommonModule],
  templateUrl: './kills.component.html',
  styleUrl: './kills.component.scss',
})
export class KillsComponent {

  constructor(private roslibService: RoslibService, private cdr: ChangeDetectorRef){}

  topics = [
    '/alarm/updates',
  ];

  killStatus: string = 'HW Kill';
  isKilled: boolean = true;

  ngOnInit(): void {
    // Add the callbacks for when we subscribe to a topic
    this.topics.forEach(topic => {
      this.roslibService.subscribeToTopic(topic)
        .subscribe((message: AlarmMSG) => {
          this.killStatus = message.alarm_name + ": " + message.problem_description;
          this.isKilled = message.raised;
          this.cdr.detectChanges();
        });
    });
  }

  getBackgroundClass(): string {
    if(this.isKilled){
      return "killed"
    }
    return "unkilled"
  }

  public sendKillMsg(){

    // Create the Kill MSG
    let killmsg: AlarmMSG = {
      alarm_name: "kill",
      node_name: "/unnamed",
      parameters: "{}",
      problem_description: '"mil" raised from gui',
      raised: true,
      severity: 0
    };

    // If we are unkilling create that message instead
    if(this.isKilled){
      killmsg.problem_description = "";
      killmsg.raised = false;
    }
    this.roslibService.callService('/alarm/set', {alarm: killmsg}).subscribe(response => {
      console.log('Service response:', response);
    }, error => {
      console.error('Service call failed:', error);
    });
  }
}
