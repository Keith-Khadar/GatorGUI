import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RoslibService } from '../roslib-service.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface CameraMSG {
  header: object;
  height: number;
  width: number;
  encoding: string;
  is_bigendian: number;
  step: number;
  data: string;
}

@Component({
  selector: 'app-camera-feed',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, CommonModule],
  templateUrl: './camera-feed.component.html',
  styleUrls: ['./camera-feed.component.scss']
})
export class CameraFeedComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas')
  private canvasRef: ElementRef = {} as ElementRef;

  cameraTopics: string[] = [
    '/wamv/sensors/camera/front_left_cam/image_raw',
    '/yolov7/detections_model1/visualization'
  ];

  selected = this.cameraTopics[0];
  image: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private roslibService: RoslibService) {}

  ngAfterViewInit(): void {
    this.cameraTopics.forEach(topic => {
      const sub = this.roslibService.subscribeToTopic(topic)
        .pipe(
          debounceTime(100), // Adjust the debounce time as necessary
          distinctUntilChanged()
        )
        .subscribe((message: CameraMSG) => {
          if (topic === this.selected) {
            this.renderImage(message);
          }
        });
      this.subscription.add(sub);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  renderImage(imgMes: CameraMSG) {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = imgMes.width;
    canvas.height = imgMes.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const imgData = ctx.createImageData(imgMes.width, imgMes.height);
      const data = imgData.data;
      const inData = atob(imgMes.data);

      let j = 0;
      let i = 0; // j data in , i data out
      while (j < inData.length) {
        const w1 = inData.charCodeAt(j++);  // read 3 16 bit words represent 1 pixel
        const w2 = inData.charCodeAt(j++);
        const w3 = inData.charCodeAt(j++);
        if (!imgMes.is_bigendian) {
          data[i++] = w1; // red
          data[i++] = w2; // green
          data[i++] = w3; // blue
        } else {
          data[i++] = (w1 >> 8) + ((w1 & 0xFF) << 8);
          data[i++] = (w2 >> 8) + ((w2 & 0xFF) << 8);
          data[i++] = (w3 >> 8) + ((w3 & 0xFF) << 8);
        }
        data[i++] = 255;  // alpha
      }

      ctx.putImageData(imgData, 0, 0);
    }
  }
}
