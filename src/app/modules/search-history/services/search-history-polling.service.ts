import { inject, Injectable, OnDestroy } from '@angular/core';
import { SearchHistoryMessageDto } from '../models/search-history.dto';
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    distinctUntilChanged,
    EMPTY,
    exhaustMap,
    interval,
    map,
    Observable,
    startWith,
    Subject,
    takeUntil,
    tap
} from 'rxjs';
import { SearchHistoryService } from './search-history.service';

@Injectable({ providedIn: 'root' })
export class SearchHistoryPollingService implements OnDestroy {
    private readonly api = inject(SearchHistoryService);

    private readonly destroy$ = new Subject<void>();
    private readonly stop$ = new Subject<void>();

    private readonly _data$ = new BehaviorSubject<SearchHistoryMessageDto[]>([]);
    readonly data$ = this._data$.asObservable();

    private readonly _running$ = new BehaviorSubject<boolean>(false);
    readonly running$ = this._running$.asObservable();

    // ✅ holds current orderIds to poll
    private readonly _orderIds$ = new BehaviorSubject<number[]>([]);
    readonly orderIds$ = this._orderIds$.asObservable();

    /**
     * Set/replace the list of orderIds to poll.
     * Can be called while polling is running (e.g., when page changes).
     */
    setOrderIds(orderIds: number[]): void {
        // normalize: unique + sorted to avoid pointless re-fetch
        const normalized = Array.from(new Set(orderIds)).sort((a, b) => a - b);

        // avoid emitting the same list again
        const current = this._orderIds$.value;
        if (arraysEqual(current, normalized)) return;

        this._orderIds$.next(normalized);
    }

    /**
     * Start polling. You can pass orderIds here, or call setOrderIds(...) anytime.
     */
    start(periodMs = 5000, orderIds?: number[]): void {
        if (orderIds) this.setOrderIds(orderIds);

        if (this._running$.value) return;
        this._running$.next(true);

        // Combine the timer ticks + current orderIds
        combineLatest([
            interval(periodMs).pipe(startWith(0)),
            this._orderIds$.pipe(
                distinctUntilChanged((a, b) => arraysEqual(a, b))
            )
        ])
            .pipe(
                takeUntil(this.stop$),
                takeUntil(this.destroy$),
                exhaustMap(([_, ids]) => {
                    if (!ids.length) {
                        this._data$.next([]);
                        return EMPTY;
                    }

                    return this.api.getByOrderIds(ids).pipe(
                        tap((rows) => this._data$.next(rows)),
                        catchError((err) => {
                            console.error('Polling error:', err);
                            // keep polling even if one request fails
                            return EMPTY;
                        })
                    );
                })
            )
            .subscribe();
    }

    stop(): void {
        if (!this._running$.value) return;
        this._running$.next(false);
        this.stop$.next();
    }

    /**
     * One-time fetch (optionally with provided orderIds).
     */
    refreshOnce(orderIds?: number[]): void {
        if (orderIds) this.setOrderIds(orderIds);

        const ids = this._orderIds$.value;

        if (!ids.length) {
            this._data$.next([]);
            return;
        }

        this.api.getByOrderIds(ids).pipe(
            tap((rows) => this._data$.next(rows)),
            catchError((err) => {
                console.error('Refresh error:', err);
                return EMPTY;
            })
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.stop();
        this.destroy$.next();
        this.destroy$.complete();
    }
}

// ---- helpers ----
function arraysEqual(a: number[], b: number[]): boolean {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}