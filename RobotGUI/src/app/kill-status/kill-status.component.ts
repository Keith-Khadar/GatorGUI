import { Component } from '@angular/core';
import { RoslibService } from '../roslib-service.service';
import { CommonModule } from '@angular/common';


export interface AlarmMSG{
  alarm_name: string,
  raised: boolean,
  node_name: string,
  problem_description: string,
  parameters: string,
  severity: number
}


@Component({
  selector: 'app-kill-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kill-status.component.html',
  styleUrl: './kill-status.component.scss'
})
export class KillStatusComponent {
  constructor(private roslibService: RoslibService){}

  topics = [
    '/alarm/updates'
  ]

  isKilled: boolean = true;
  
  ngOnInit(): void {
    // Add the callbacks for when we subscribe to a topic
    this.topics.forEach(topic => {
      this.roslibService.subscribeToTopic(topic)
        .subscribe((message: AlarmMSG) => {
          this.isKilled = message.raised;
          // this.cdr.detectChanges();
        });
    });
  }

  getBackgroundClass(): string {
    if(this.isKilled){
      return "killed"
    }
    return "unkilled"
  }

}
