import { HttpInterceptorFn } from '@angular/common/http';
import { Observable, delay, finalize, identity } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoaderService } from '../services/loader.service';
import { inject } from '@angular/core';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loaderService = inject(LoaderService);

    loaderService.busy();

    return next(req).pipe(
        environment.production ? identity : delay(loaderService.getDelay()),
        finalize(() => {
            loaderService.idle();
        })
    );
};
