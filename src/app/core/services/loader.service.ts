import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    private delay: number = 0;
    busyRequestCount = 0;

    constructor(
        private http: HttpClient,
        private spinnerService: NgxSpinnerService
    ) { }

    public setDelay(delay: number = 0) {
        return (this.delay = delay);
    }

    public getDelay(): number {
        return this.delay;
    }

    busy() {
        this.busyRequestCount++;
        this.spinnerService.show();
    }

    idle() {
        this.busyRequestCount--;
        if (this.busyRequestCount <= 0) {
            this.busyRequestCount = 0;
            this.spinnerService.hide();
        }
    }
}
