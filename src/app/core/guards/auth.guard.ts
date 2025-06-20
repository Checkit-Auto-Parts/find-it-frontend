import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../../modules/security/services/security.service';
import { LocalStorageService } from '../../modules/security/services/local-storage.service';
import { LocalStorageKeysService } from '../../modules/security/services/local-storage-keys.service';
import { isPlatformServer } from '@angular/common';
// import { IS_AUTHENTICATED } from '../../../server';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
    
    // Si estamos en SSR:
    if (isPlatformServer(platformId)) {
        // const isAuthenticated = inject(IS_AUTHENTICATED);
        // if (isAuthenticated) {
        //     return true;
        // } else {
        //     router.navigateByUrl('login');
        //     return false;
        // }
    }

    // Si estamos en CSR:
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
