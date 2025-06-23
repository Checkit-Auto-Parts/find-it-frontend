import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformServer } from '@angular/common';
import { LocalStorageService } from '../../modules/security/services/local-storage.service';
import { LocalStorageKeysService } from '../../modules/security/services/local-storage-keys.service';
import { USER_TOKEN } from '../../tokens/user-token';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (isPlatformServer(platformId)) {
        // console.log('Estamos en el servidor (SSR)');
        // Estamos en SSR
        const user = inject(USER_TOKEN, { optional: true });
        // console.log('Usuario inyectado en SSR:', user);
        if (user) {
            // console.log('Usuario autenticado en SSR:', user);
            return true;
        } else {
            // console.log('Usuario no autenticado en SSR, redirigiendo a /login', user);
            router.navigateByUrl('/login');
            return false;
        }
    } else {
        // Estamos en CSR
        // console.log('Estamos en el cliente (CSR)');
        const localStorageService = inject(LocalStorageService);
        const keyService = inject(LocalStorageKeysService);
        const token = localStorageService.get(keyService.TOKEN_KEY);

        if (token != null) {
            // console.log('Usuario autenticado en CSR, token encontrado:', token);
            return true;
        } else {
            
            router.navigateByUrl('/login');
            return false;
        }
    }
};
