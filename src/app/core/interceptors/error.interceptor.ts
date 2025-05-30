import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ErrorDto } from  './../models/error/error.model'


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    errors: ErrorDto = {} as ErrorDto;

    constructor(private router: Router) { }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error) => {
                if (error) {
                    let errorMessages: string = '';
                    switch (error.status) {
                        case 400:
                            this.errors!.errorCode = error.status;
                            if (error.error.errors) {
                                if (error.error?.errors) {
                                    const keys = Object.keys(error.error.errors);
                                    let key: string = keys[0];
                                    errorMessages = `Hubo un problema con : ${key} -- ${error.error.errors[key][0]}`;
                                }
                            } else if (error.error.errorList) {
                                for (let i = 0; i < error.error.errorList.item1.length; i++) {
                                    errorMessages = `${errorMessages} ${error.error.errorList.item1[i].description}`;
                                }
                            } else if (error.error) {
                                errorMessages = error.error;
                            } else if (
                                !error.error.userProfileSuccessed &&
                                error.error.userProfileErrors != null
                            ) {
                                errorMessages = error.error.userProfileErrors;
                            } else {
                                // this.toastr.error(error.error, error.status);
                            }
                            this.errors.errorMessage = errorMessages;
                            this.errors.errorCode = 400;
                            this.errors.requestedURI = window.location.href;
                            break;
                        case 401:
                            this.errors.errorCode = error.status;
                            this.errors.errorMessage = error.error;
                            this.errors.requestedURI = window.location.href;
                            errorMessages = error.error;
                            break;
                        case 404:
                            this.errors.errorCode = error.status;
                            this.errors.errorMessage = error.message;
                            this.errors.requestedURI = window.location.href;
                            errorMessages = 'Ocurrió un error al obtener información';
                            this.router.navigateByUrl('/not-found');
                            break;
                        case 500:
                            this.errors.errorCode = error.status;
                            this.errors.errorMessage = error.error;
                            this.errors.requestedURI = window.location.href;
                            errorMessages = error.error;
                            const navigationExtras: NavigationExtras = {
                                state: { error: error.error },
                            };
                            this.router.navigateByUrl('/server-error', navigationExtras);
                            break;
                        default:
                            this.errors.errorCode = error.status;
                            this.errors.errorMessage = error.message;
                            this.errors.requestedURI = window.location.href;
                            errorMessages = error.message;
                            break;
                    }
                }
                throw error;
            })
        );
    }
}