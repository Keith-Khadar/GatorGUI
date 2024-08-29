import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { RoslibService } from '../roslib-service.service';

interface gpsMSG {
  altitude: number;
  header: Object;
  latitude: number;
  longitude: number;
  position_covariance: Array<number>;
  position_covariance_type: number;
  status: Object;
}

@Component({
  selector: 'app-localization',
  standalone: true,
  imports: [],
  templateUrl: './localization.component.html',
  styleUrl: './localization.component.scss'
})
export class LocalizationComponent implements AfterViewInit {
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private mapInitialized = false;

  latitude = 29.6465;
  longitude = -82.3533;

  topics = [
    '/wamv/sensors/gps/gps/fix',
  ];

  private initMap(latitude: number, longitude: number): void {
    this.map = L.map('map', {
      center: [latitude, longitude],
      zoom: 19
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 25,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    // Initialize the marker at the initial latitude and longitude
    this.marker = L.marker([latitude, longitude]).addTo(this.map);
  }

  constructor(private roslibService: RoslibService) { }

  ngAfterViewInit(): void {
    // Subscribe to the GPS topic
    this.topics.forEach(topic => {
      this.roslibService.subscribeToTopic(topic)
        .subscribe((message: gpsMSG) => {
          this.latitude = message.latitude;
          this.longitude = message.longitude;

          // Initialize the map and marker if not already done
          if (!this.mapInitialized) {
            this.initMap(this.latitude, this.longitude);
            this.mapInitialized = true;
          } else {
            // Update the marker position on the map
            if (this.marker) {
              this.marker.setLatLng([this.latitude, this.longitude]);
            }
          }
        });
    });
  }
}
