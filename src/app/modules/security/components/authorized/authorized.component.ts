import { Component, Input } from '@angular/core';
import { CoreModule } from '../../../../core/modules/core.module';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'app-authorized',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './authorized.component.html',
  styleUrl: './authorized.component.css'
})
export class AuthorizedComponent {
  @Input() rol: string = '';

  constructor(public securityService: SecurityService) { }

  isAuthorized(): boolean {
    return this.securityService.authenticated();
  }

}
