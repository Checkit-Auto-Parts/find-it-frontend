import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CoreModule } from '../../../../core/modules/core.module';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from '../../services/security.service';
import { RedirectService } from '../../services/redirect.service';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [
    CoreModule,
  ],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.css'
})
export class RedirectComponent implements OnInit, OnDestroy, AfterViewInit {

  //*estoy poniendo esto para evitar el blink caotico al pasar del componente redirect al componente que le corresponde el link cuando el background siempre esta visible
  showBackground: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private redirectService: RedirectService,
  ) {
    this.showBackground = false;
  }
  ngOnInit(): void {
    this.setParamsValues();
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy(): void {
  }

  setParamsValues() {
    const urlParam = this.route.snapshot.paramMap.get('url');
    if (urlParam) {
      // const urlAux: string = `${environment.appUrl}${urlParam.replaceAll('&', '/')}`;
      const urlAux: string = `${urlParam.replaceAll('&', '/')}`;
      this.showBackground = this.redirectService.verifyUserLogged(urlAux);
    } else {
      this.securityService.logout();
    }
  }

}
