import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [
    MatToolbar
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
