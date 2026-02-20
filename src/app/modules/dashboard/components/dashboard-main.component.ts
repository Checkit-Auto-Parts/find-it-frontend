import { DialogMessageService } from './../../../core/services/dialog-message.service';
import { AfterViewInit, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { MaterialTableModule } from '../../../core/modules/material-table.module';
import { AsyncPipe, CommonModule, DatePipe, NgClass, NgIf } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomPaginatorComponent } from "../../../core/components/table/custom-paginator/custom-paginator.component";
import { CustomPaginatorConfig } from '../../../core/models/other/custom-paginator-config.model';
import { DashboardServiceService } from '../services/dashboard.service.service';
import { MatTableDataSource } from '@angular/material/table';
import { OrderDTO } from '../models/order.dto';
import { MatDialog } from '@angular/material/dialog';
import { UpdateOrderComponent } from '../../order/update-order/update-order/update-order.component';
import { BehaviorSubject, Subscription, interval } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchHistoryMessageDto } from '../../search-history/models/search-history.dto';
import { SearchHistoryService } from '../../search-history/services/search-history.service';

// ✅ grouped response type expected from backend
type MessagesByOrderResponse = Record<number, SearchHistoryMessageDto[]>;

@Component({
    selector: 'app-dashboard-main',
    standalone: true,
    imports: [
        NgClass,
        LayoutModule,
        MatCardModule,
        MaterialTableModule,
        NgIf,
        MatPaginator,
        MatSort,
        CustomPaginatorComponent,
        AsyncPipe,
        DatePipe,
        CommonModule
    ],
    templateUrl: './dashboard-main.component.html',
    styleUrl: './dashboard-main.component.css'
})
export class DashboardMainComponent implements OnInit, AfterViewInit {
    private readonly destroyRef = inject(DestroyRef);

    isMobile = false;
    filter = '';

    // ✅ strongly typed
    dataSource = new MatTableDataSource<OrderDTO>([]);

    // ✅ running state
    private readonly _messagesRunning$ = new BehaviorSubject<boolean>(false);
    readonly messagesRunning$ = this._messagesRunning$.asObservable();

    // ✅ cache messages by order
    private messagesByOrder = new Map<number, SearchHistoryMessageDto[]>();

    // Optional: show loading state
    isLoadingMessages = false;

    // Local polling subscription (component-level)
    private messagesPollSub?: Subscription;

    displayedColumns_en: string[] = [
        'Customer Name',
        'Customer Lastname',
        'Make',
        'Model',
        'BodyStyle',
        'NumberOfCylinders',
        'Transmission',
        'Year',
        'Messages',
        'Actions'
    ];

    // Paginator
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    totalRecords = 0;
    currentPage = 0;
    rowsPerPageList: number[] = [5, 10, 25];
    rowsPerPage = 10;

    selectedRow: OrderDTO | null = null;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private dashboardService: DashboardServiceService,
        private dialog: MatDialog,
        private dialogMessageService: DialogMessageService,
        private searchHistoryApi: SearchHistoryService,
    ) {
        this.breakpointObserver
            .observe([Breakpoints.Handset])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(result => {
                this.isMobile = result.matches;
            });
    }

    ngOnInit(): void {
        this.fetchPaginatedList();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    fetchPaginatedList() {
        this.dashboardService
            .getPaginatedList(this.currentPage + 1, this.rowsPerPage, '')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (result) => {
                    this.totalRecords = result.data?.totalRecords ?? 0;

                    const orders = (result.data?.results ?? []) as OrderDTO[];

                    // reset UI fields so column doesn't show stale info
                    for (const o of orders) {
                        o.messagesCount = 0;
                        o.lastMessageText = '';
                        o.lastMessageAt = undefined;
                    }

                    this.dataSource.data = orders;

                    if (this.paginator) {
                        this.paginator.length = this.totalRecords;
                        this.paginator.pageIndex = this.currentPage;
                    }

                    // ✅ load messages for the current page
                    this.loadMessagesForCurrentPage();
                },
                error: (error) => console.error('Error fetching data:', error)
            });
    }

    onRowClick(row: OrderDTO) {
        this.selectedRow = row;
    }

    // Paginator methods
    triggerPaginatorPageChangedEvent(number: number) {
        this.paginator._changePageSize(number);
    }

    fetchList(paginatorConfig: CustomPaginatorConfig) {
        if (paginatorConfig.reload) {
            this.currentPage = paginatorConfig.currentPage!;
            this.rowsPerPage = paginatorConfig.rowsPerPage!;
            this.fetchPaginatedList();
        }
    }

    pageChanged(event: any) {
        this.currentPage = event.pageIndex;
        this.rowsPerPage = event.pageSize;
        this.fetchPaginatedList();
    }

    update(orderDto: OrderDTO) {
        this.openDialogSendComment(orderDto);
    }

    openDialogSendComment(orderDto: OrderDTO): void {
        this.dialog.open(UpdateOrderComponent, {
            maxWidth: '640px',
            height: 'auto',
            data: orderDto,
        }).afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result: boolean) => {
                if (result) {
                    // optional refresh
                    // this.fetchPaginatedList();
                }
            });
    }

    changeIsActiveState(entity: OrderDTO) {
        this.dialogMessageService
            .showDecisionDialog('¿Está seguro de que desea cambiar el estado a este equipamiento?')
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((response: boolean) => {
                if (!response) return;

                this.dashboardService.changeIsActiveState(entity.id!, !entity.isAllow)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: resp => {
                            if (resp.status) {
                                this.dialogMessageService.showSuccessDialog(resp.message.description);
                                this.fetchPaginatedList();
                            } else {
                                this.dialogMessageService.showErrorDialog(resp.message.description);
                            }
                        },
                        error: err => this.dialogMessageService.showErrorDialog(err.error.message.description)
                    });
            });
    }

    delete(entity: OrderDTO) {
        this.dialogMessageService
            .showDecisionDialog('¿Está seguro de que desea eliminar este equipamiento?')
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((response: boolean) => {
                if (!response) return;

                this.dashboardService.delete(entity.id!)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: resp => {
                            if (resp.status) {
                                this.dialogMessageService.showSuccessDialog(resp.message.description);
                                this.fetchPaginatedList();
                            } else {
                                this.dialogMessageService.showErrorDialog(resp.message.description);
                            }
                        },
                        error: err => this.dialogMessageService.showErrorDialog(err.error.message.description)
                    });
            });
    }

    // ✅ Used by ONE toggle button in template
    toggleMessagesAuto() {
        const running = this._messagesRunning$.value;
        if (running) this.stopMessagesAuto();
        else this.startMessagesAuto();
    }

    refreshMessagesOnce() {
        this.loadMessagesForCurrentPage();
    }

    startMessagesAuto() {
        if (this._messagesRunning$.value) return;

        this._messagesRunning$.next(true);

        // start polling every 5 seconds
        this.stopLocalMessagesPolling();
        this.messagesPollSub = interval(5000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.loadMessagesForCurrentPage());

        // also fetch immediately
        this.loadMessagesForCurrentPage();
    }

    stopMessagesAuto() {
        if (!this._messagesRunning$.value) return;

        this._messagesRunning$.next(false);
        this.stopLocalMessagesPolling();
    }

    private stopLocalMessagesPolling() {
        this.messagesPollSub?.unsubscribe();
        this.messagesPollSub = undefined;
    }

    private getCurrentPageOrderIds(): number[] {
        const orders = this.dataSource.data as OrderDTO[];
        return orders
            .map(o => o.id)
            .filter((id): id is number => typeof id === 'number' && id > 0);
    }

    private loadMessagesForCurrentPage() {
        const orders = this.dataSource.data as OrderDTO[];
        const orderIds = this.getCurrentPageOrderIds();

        if (orderIds.length === 0) {
            // clear any previous message enrichment
            for (const o of orders) {
                o.messagesCount = 0;
                o.lastMessageText = '';
                o.lastMessageAt = undefined;
            }
            this.dataSource.data = [...orders];
            return;
        }

        this.isLoadingMessages = true;

        this.searchHistoryApi.getByOrderIds(orderIds).pipe(
            finalize(() => this.isLoadingMessages = false),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(
            (grouped: any) => {

                this.messagesByOrder.clear();

                // store in map
                for (const id of orderIds) {
                    const msgs = grouped[id] ?? [];
                    this.messagesByOrder.set(id, msgs);
                }

                // enrich rows
                // ⭐ ENRICH ROWS (MULTI MESSAGE PREVIEW)
                for (const order of orders) {
                    const id = order.id!;
                    const msgs = this.messagesByOrder.get(id) ?? [];

                    order.messagesCount = msgs.length;

                    if (msgs.length > 0) {

                        const sorted = [...msgs].sort(
                            (a, b) =>
                                new Date(b.messageAt).getTime() -
                                new Date(a.messageAt).getTime()
                        );

                        // ⭐ keep last TWO messages
                        order.messagesPreview = sorted.slice(0, 2);

                        const last = sorted[0];
                        order.lastMessageAt = last.messageAt;

                        order.lastMessageText =
                            (last.searchCriteria ?? '').trim() ||
                            `${last.messageType}${last.fromWa ? ' • ' + last.fromWa : ''}`;

                    } else {
                        order.messagesPreview = [];
                        order.lastMessageAt = undefined;
                        order.lastMessageText = '';
                    }
                }

                // Force table update
                this.dataSource.data = [...orders];
            },
            (err) => console.error('Error loading messages:', err)
        );
    }

    openMessagesPanel(order: OrderDTO) {
        console.log('Open messages for order', order.id);
        // later you can open a side drawer or dialog
    }
}