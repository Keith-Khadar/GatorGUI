import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RoslibService } from '../roslib-service.service';
import { BehaviorSubject } from 'rxjs';

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
  Timestamps: {[id: string]: number[]} = {};
  dataSource = new BehaviorSubject<SensorElement[]>([]);

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
    // Add the callbacks for when we subscribe to a topic
    this.topics.forEach(topic => {
      this.Timestamps[topic] = []; // Initialize an empty array
      this.roslibService.subscribeToTopic(topic)
        .subscribe(() => {
          // Push the current timestamp into the array
          this.Timestamps[topic].push(Date.now());
        });
    });

    // Create an interval so that we can update rates
    const intervalID = setInterval(() => this.updateRates(), 1000);

  }

  updateRates(): void {
    const now = Date.now();
    let updatedData : SensorElement[] = [];

    for (const id in this.Timestamps){
      // Make sure the list isnt longer than 10 timestamps
      if(this.Timestamps[id].length > 10){
        this.Timestamps[id].shift();
      }

      // Get the average rate
      let avg = 0

      for (let i = 1; i < this.Timestamps[id].length; i++){
        avg += this.Timestamps[id][i] - this.Timestamps[id][i-1]
      }
      if(this.Timestamps[id].length > 1){
        avg /= (this.Timestamps[id].length -1);
      }

      // Update the datasource
      updatedData.push({ name: id, rate: avg == 0 ? 0 : 1000 / avg });
      this.dataSource.next(updatedData);
    }
  }
  

  getRowClass(row: SensorElement): string {
    if (row.rate >= 5) {
      return 'high-rate-row';
    } else if (row.rate >= 1) {
      return 'medium-rate-row';
    } else {
      return 'low-rate-row';
    }
  }

  displayedColumns: string[] = ['name', 'rate'];
}
