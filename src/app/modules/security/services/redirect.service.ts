import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageKeysService } from './local-storage-keys.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from './security.service';
import { DialogMessageService } from '../../../core/services/dialog-message.service';

@Injectable({
  providedIn: 'root'
})
/**Estoy creando este servicio especificamente para cuando intenten acceder a la asignacion de operador y equipo desde un correo de suplidor */
export class RedirectService {

  constructor(
    private localStorageService: LocalStorageService,
    private keysService: LocalStorageKeysService,
    private route: ActivatedRoute,
    private router: Router,
    private securityService: SecurityService,
    private dialogMessageService: DialogMessageService,
  ) { }

  /**el resultado me indicara si mostrare el fondo en el componente redirect o no */
  public verifyUserLogged(url: string): boolean {

    let token = this.getDecodedToken(this.localStorageService.get(this.keysService.TOKEN_KEY));
    if (token) {
      let expirationDate = new Date(token.exp * 1000);

      let currentDate = new Date();

      if (currentDate < expirationDate) {
        this.router.navigateByUrl(url);
        return false;
      } else {
        this.redirectToLogin(url, 'El tiempo de sesión expiro, inicie nuevamente.');
        return true;
      }
    } else {
      this.redirectToLogin(url, 'Inicie sesion para continuar.');
      return true;
    }
  }

  private redirectToLogin(urlToRedirect: string, message: string) {
    this.dialogMessageService.showErrorDialog(message, 'Inicie sesión')
      .afterClosed().subscribe(result => {
        this.saveUrlToLS(urlToRedirect);
        this.securityService.logout();
      });
  }

  private getDecodedToken(token: string) {
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  }


  private saveUrlToLS(url: string) {
    this.localStorageService.set(this.keysService.URL_REDIRECT, url);
  }
  public removeRedirectUrlFromLS() {
    this.localStorageService.remove(this.keysService.URL_REDIRECT);
  }

}
