import { Component } from '@angular/core';
import { RoslibService } from '../roslib-service.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';

export interface ThrusterMSG{
  data: number
}

@Component({
  selector: 'app-thrusters',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatProgressSpinnerModule, MatIcon],
  templateUrl: './thrusters.component.html',
  styleUrl: './thrusters.component.scss'
})
export class ThrustersComponent {

  manualControl = false

  thrusters = [
    { name: "BL", value: 0},
    { name: "BR", value: 0},
    { name: "FL", value: 0},
    { name: "FR", value: 0},
  ];

  decreaseThrust(element: any) {
    if (element.value >= 1) {
      element.value -= 1;
    }
  }

  increaseThrust(element: any) {
    element.value += 1;
  }

  switchControl(){
    this.manualControl = !this.manualControl;

    if(!this.manualControl){
      this.thrusters = [
        { name: "BL", value: 0},
        { name: "BR", value: 0},
        { name: "FL", value: 0},
        { name: "FR", value: 0},
      ]
    }
  }

  constructor(private roslibService: RoslibService){}

  ngOnInit(): void{
    this.thrusters.forEach(topic => {
      this.roslibService.subscribeToTopic("/wamv/thrusters/" + topic.name +"_thrust_cmd").subscribe((message: ThrusterMSG) =>
      {
        if(!this.manualControl){
          topic.value = message.data;
        }        
      })
    })

      // Create an interval so that we can constantly publish
      const intervalID = setInterval(() => this.updateRates(), 20);
  }

  updateRates(): void {
    if(this.manualControl){
      this.thrusters.forEach(topic => {
        this.roslibService.publishToTopic("/wamv/thrusters/" + topic.name +"_thrust_cmd", {data: topic.value})
      })
    }
 }

}
