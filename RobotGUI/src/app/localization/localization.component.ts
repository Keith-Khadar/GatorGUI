import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-localization',
  standalone: true,
  imports: [],
  templateUrl: './localization.component.html',
  styleUrl: './localization.component.scss'
})
export class LocalizationComponent implements AfterViewInit {
  private map: L.Map | undefined;

  private initMap(): void{
    this.map = L.map('map', {
      center: [ 29.6465, -82.3533],
      zoom: 20
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 25,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }
  
  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
