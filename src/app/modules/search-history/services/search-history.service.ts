import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchHistoryMessageDto } from '../models/search-history.dto';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
    private readonly http = inject(HttpClient);

    // Adjust to your real endpoint
    private readonly baseUrl = 'whatsapp/search-history';
    private endPoint = environment.apiUrl + this.baseUrl;

    // ✅ new: retrieve messages filtered by orderIds
    getByOrderIds(orderIds: number[]): Observable<SearchHistoryMessageDto[]> {
        console.log('Fetching search history for orderIds:', `${this.endPoint}/by-orders`);
        return this.http.post<SearchHistoryMessageDto[]>(
            `${this.endPoint}/by-orders`,
            { orderIds }
        );
    }

    // keep if you still need it
    getAll(): Observable<SearchHistoryMessageDto[]> {
        return this.http.get<SearchHistoryMessageDto[]>(`${this.endPoint}`);
    }
}