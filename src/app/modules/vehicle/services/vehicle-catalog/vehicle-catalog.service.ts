import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BodyStyleService } from '../bodyStyle/body-style.service';
import { LookupItemDto } from '../../models/lookup-item.dto';

@Injectable({ providedIn: 'root' })
export class VehicleCatalogService {
    constructor(private bodyStyleService: BodyStyleService) { }

    // ✅ Ready now
    getBodyStyles(): Observable<LookupItemDto[]> {
        return this.bodyStyleService.getLookup();
    }

    // 🚧 TODO - implement when you share controllers
    getMakes(): Observable<LookupItemDto[]> {
        return of([]);
    }

    getModelsByMake(makeId: string | number): Observable<LookupItemDto[]> {
        return of([]);
    }

    getColors(): Observable<LookupItemDto[]> {
        return of([]);
    }

    getEngines(): Observable<LookupItemDto[]> {
        return of([]);
    }

    getTransmissions(): Observable<LookupItemDto[]> {
        return of([]);
    }

    getDriveTypes(): Observable<LookupItemDto[]> {
        return of([]);
    }

    getFuelTypes(): Observable<LookupItemDto[]> {
        return of([]);
    }
}
