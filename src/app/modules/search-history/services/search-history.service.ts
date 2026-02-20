import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchHistoryMessageDto } from '../models/search-history.dto';

@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
    private readonly http = inject(HttpClient);

    // Adjust to your real endpoint
    private readonly baseUrl = '/api/search-history';

    // ✅ new: retrieve messages filtered by orderIds
    getByOrderIds(orderIds: number[]): Observable<SearchHistoryMessageDto[]> {
        return this.http.post<SearchHistoryMessageDto[]>(
            `${this.baseUrl}/by-orders`,
            { orderIds }
        );
    }

    // keep if you still need it
    getAll(): Observable<SearchHistoryMessageDto[]> {
        return this.http.get<SearchHistoryMessageDto[]>(`${this.baseUrl}`);
    }
}