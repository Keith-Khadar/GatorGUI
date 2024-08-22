import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatSlideToggle,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-kills',
  standalone: true,
  imports: [MatSlideToggleModule, MatSlideToggle, FormsModule],
  templateUrl: './kills.component.html',
  styleUrl: './kills.component.scss',
})
export class KillsComponent {
  killStatus: string = 'HW Kill';
}
