import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, shareReplay } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LookupItemDto } from '../../models/lookup-item.dto';

@Injectable({ providedIn: 'root' })
export class BodyStyleService {
	private readonly baseUrl = `${environment.apiUrl}BodyStyle`;

	// Optional cache so you don't refetch on every navigation
	private cache$?: Observable<LookupItemDto[]>;

	constructor(private http: HttpClient) { }

	/**
	 * GET /api/BodyStyle/Lookup
	 * Returns: [{ id, name }]
	 */
	getLookup(filter = ''): Observable<LookupItemDto[]> {
		const params = new HttpParams().set('filter', filter ?? '');

		// Cache only for default filter. If filter is used, bypass cache.
		if (!filter) {
			if (!this.cache$) {
				this.cache$ = this.http
					.get<LookupItemDto[]>(`${this.baseUrl}/Lookup`, { params })
					.pipe(
						catchError((err) => {
							console.error('BodyStyle lookup error', err);
							return of([] as LookupItemDto[]);
						}),
						shareReplay(1)
					);
			}
			return this.cache$;
		}

		return this.http.get<LookupItemDto[]>(`${this.baseUrl}/Lookup`, { params }).pipe(
			catchError((err) => {
				console.error('BodyStyle lookup error', err);
				return of([] as LookupItemDto[]);
			})
		);
	}

	// If you need to force reload (Admin changes)
	clearCache(): void {
		this.cache$ = undefined;
	}
}
