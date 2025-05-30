import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { SecurityService } from '../../modules/security/services/security.service';

@Injectable({
    providedIn: 'root',
})
export class IsLoginGuard implements CanActivate {
    constructor(
        private router: Router,
        private securityService: SecurityService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        let isLogin = this.securityService.authenticated();
        if (!isLogin) {
            this.router.navigateByUrl('');
            return false;
        }
        return true;
    }
}
