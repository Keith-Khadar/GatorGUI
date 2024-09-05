import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { RoslibService } from '../roslib-service.service';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatButtonModule],
  templateUrl: './missions.component.html',
  styleUrl: './missions.component.scss'
})
export class MissionsComponent {
  constructor(private roslibService: RoslibService, private cdr: ChangeDetectorRef) {}
  options: Array<string> = []


  ngOnInit(): void {
    this.roslibService.getMissions().then(missions => {
      this.options = missions;
      console.log(this.options)
    }).catch(error => {
      console.error('Error fetching missions:', error);
    });
  }
  
  onPlayClick(){

  }
}
