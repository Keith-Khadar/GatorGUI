import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface SensorElement {
  name: string;
  rate: number;
}

const ELEMENT_DATA: SensorElement[] = [
  { name: 'DVL', rate: 10 },
  { name: 'Sonar', rate: 5 },
  { name: 'GPS', rate: 1 },
];

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
})
export class StatusComponent {
  displayedColumns: string[] = ['name', 'rate'];
  dataSource = ELEMENT_DATA;

  getRowClass(row: any, index: number): string {
    if (row.rate >= 10) {
      return 'high-rate-row';
    } else if (row.rate >= 5) {
      return 'medium-rate-row';
    } else {
      return 'low-rate-row';
    }
  }
}
