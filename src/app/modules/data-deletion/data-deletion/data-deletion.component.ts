import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  standalone: true,
  selector: 'app-data-deletion',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './data-deletion.component.html',
  styleUrl: './data-deletion.component.css'
})
export class DataDeletionComponent {

}
