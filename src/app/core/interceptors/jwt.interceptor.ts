import { HttpInterceptorFn } from '@angular/common/http';
import { switchMap, take } from 'rxjs';
import { SecurityService } from '../../modules/security/services/security.service'
import { inject } from '@angular/core';
import { LocalStorageService } from '../../modules/security/services/local-storage.service';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
    const securityService = inject(SecurityService);
    const localStorageService = inject(LocalStorageService);
    return securityService.currentUser$.pipe(
        take(1),
        switchMap(user => {

            const lang = localStorageService.get('preferredLang') || 'en'; // fallback

            console.log('From jwt Interceptor, Preferred language:', lang);

            if (user) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${user.token}`,
                        'Accept-Language': String(lang)
                    },  
                });
            }
            return next(req);
        })
    );
};

