import { HttpInterceptorFn } from '@angular/common/http';
import { switchMap, take } from 'rxjs';
import { SecurityService } from '../../modules/security/services/security.service'
import { inject } from '@angular/core';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
    const securityService = inject(SecurityService);

    return securityService.currentUser$.pipe(
        take(1),
        switchMap(user => {
            if (!req.url.includes('dzenplusblob.blob') && user) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
            }
            return next(req);
        })
    );
};

