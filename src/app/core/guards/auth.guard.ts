import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../../modules/security/services/security.service';
import { LocalStorageService } from '../../modules/security/services/local-storage.service';
import { LocalStorageKeysService } from '../../modules/security/services/local-storage-keys.service';

export const authGuard: CanActivateFn = (route, state) => {
    const accountService = inject(SecurityService);
    const router = inject(Router);
    const localStorageService = inject(LocalStorageService);
    const keyService = inject(LocalStorageKeysService);
    const token = localStorageService.get(keyService.TOKEN_KEY);
    
    if (token != null) {
        return true;
    } else {
        router.navigateByUrl('login');
        return false;
    }
};
