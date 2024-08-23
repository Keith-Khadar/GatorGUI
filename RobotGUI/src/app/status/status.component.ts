import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RoslibService } from '../roslib-service.service';

export interface SensorElement {
  name: string;
  rate: number;
}

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent {
  TopicInfo: {[id: string]: number} = {};
  dataSource: SensorElement[] = [];
  topics = [
    '/depth',
    '/dvl',
    '/imu/mag',
    '/imu/data_raw',
    '/camera/down/image_raw',
    '/camera/left/image_raw',
  ];

  constructor(private roslibService: RoslibService) {}

  ngOnInit(): void {
    this.topics.forEach(topic => {
      this.roslibService.subscribeToTopic(topic)
        .subscribe(() => {
          this.updateRates(topic);
          this.TopicInfo[topic] = Date.now();
        });
    });
  }

  updateRates(UpdatedTopic: string): void {
    // Calculate rates based on time intervals
    const now = Date.now();

    // Check if it is not in array already
    let foundElement = false;

    this.dataSource.forEach(sensorelement => {
      if(sensorelement.name == UpdatedTopic){
        const lastUpdate = (this.TopicInfo[UpdatedTopic]) ? this.TopicInfo[UpdatedTopic] : now;
        const rate = Math.max(0, 1 / ((now - lastUpdate) * 1000)); // Adjust calculation as needed
        sensorelement.rate = rate;
        foundElement = true
        console.log(this.dataSource)
      }
    });
    if(!foundElement){
      this.dataSource.push({name: UpdatedTopic, rate: 0})
    }
  }

  getRowClass(row: SensorElement): string {
    if (row.rate >= 10) {
      return 'high-rate-row';
    } else if (row.rate >= 5) {
      return 'medium-rate-row';
    } else {
      return 'low-rate-row';
    }
  }

  displayedColumns: string[] = ['name', 'rate'];
}
