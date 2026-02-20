import { Component, inject } from '@angular/core';
import { SearchHistoryPollingService } from '../../services/search-history-polling.service';

@Component({
    standalone: true,
    selector: 'app-search-history',
    imports: [],
    templateUrl: './search-history.component.html',
    styleUrl: './search-history.component.css'
})
export class SearchHistoryComponent {
    private readonly polling = inject(SearchHistoryPollingService);

    data$ = this.polling.data$;
    running$ = this.polling.running$;

    fetchAll() { this.polling.refreshOnce(); }
    start() { this.polling.start(5000); }
    stop() { this.polling.stop(); }
}
