import { Component } from '@angular/core';
import { CoreModule } from '../../../modules/core.module';
import { MaterialNavbarModule } from '../../../modules/material-navbar.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pages-nav-bar',
  standalone: true,
  imports: [
    CoreModule,
    MaterialNavbarModule,
    LayoutModule,
    MatListModule,
    RouterModule,
    MatButtonModule
  ],
  templateUrl: './pages-nav-bar.component.html',
  styleUrl: './pages-nav-bar.component.css'
})
export class PagesNavBarComponent {

}
