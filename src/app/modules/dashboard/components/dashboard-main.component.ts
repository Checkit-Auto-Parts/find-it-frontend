import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { USER_TOKEN } from '../../../tokens/user-token';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { MaterialTableModule } from '../../../core/modules/material-table.module';
import { NgClass, NgIf } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// import { NgClass } from '@angular/common';
import { CustomPaginatorComponent } from "../../../core/components/table/custom-paginator/custom-paginator.component";
import { CustomPaginatorConfig } from '../../../core/models/other/custom-paginator-config.model';
import { DashboardServiceService } from '../services/dashboard.service.service';
import { MatTableDataSource } from '@angular/material/table';
import { OrderDTO } from '../models/order.dto';
import { ExcludeDefaultDatePipe } from "../../../core/pipes/exclude-default-date.pipe";

@Component({
    selector: 'app-dashboard-main',
    standalone: true,
    imports: [NgClass, LayoutModule, MatCardModule, MaterialTableModule, NgIf, MatPaginator, MatSort, CustomPaginatorComponent, ExcludeDefaultDatePipe],
    templateUrl: './dashboard-main.component.html',
    styleUrl: './dashboard-main.component.css'
})
export class DashboardMainComponent implements OnInit {
    isMobile = false;
    filter = '';
    dataSource = new MatTableDataSource<any>();
    displayedColumns_en: string[] = [
        'Customer Name',
        'Customer Lastname',
        'Make',
        'Model',
        'BodyStyle',
        'NumberOfCylinders',
        'Transmission',
        'DriveType',
        'FuelType',
        'Year',
        'Picture',

        'Created At',
        'Created By',
        'Modified At',
        'Modified By',
        'Is Active',
        'Actions'
    ];

    displayedColumns: string[] = [
        'Nombre',
        'Apellido',
        'Marca',
        'Modelo',
        'Carrocería',
        '#Cilindros',
        'Transmisión',
        'Tracción',
        'Tipo de Combustible',
        'Año',
        'Foto',

        'Creado',
        'Creado Por',
        'Modificado',
        'Modificado Por',
        'Activo',
        'Acciones'
    ];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    totalRecords = 0;
    currentPage = 0;
    rowsPerPageList: number[] = [5, 10, 25];
    rowsPerPage = 10;

    selectedRow: any;
    constructor(
        private breakpointObserver: BreakpointObserver
        , private dashboardService: DashboardServiceService
    ) {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            this.isMobile = result.matches;
        });
    }

    ngOnInit(): void {
        /*
        this.dataSource.data = this.pedidos;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // Initialize paginator
        this.paginator.pageSize = this.rowsPerPage;
        this.paginator.pageSizeOptions = this.rowsPerPageList;
        */
        this.fetchPaginatedList();
    }

    fetchPaginatedList(
    ) {
        this.dashboardService.getPaginatedList(this.currentPage + 1, this.rowsPerPage, '').subscribe({
            next: (result) => {
                this.totalRecords = result.data?.totalRecords!;
                this.dataSource.data = result.data?.results!;

                this.paginator.length = this.totalRecords;
                this.paginator.pageIndex = this.currentPage;
                console.log('Fetched data:', this.dataSource.data);
            },
            error: (error) => {
                console.error('Error fetching data:', error);
            }
        });
    }
    onRowClick(row: any) {
        this.selectedRow = row;
    }
    triggerPaginatorPageChangedEvent(numero: number) {
        this.paginator._changePageSize(numero);
    }
    fetchList(paginatorConfig: CustomPaginatorConfig) {
        if (paginatorConfig.recargar) {
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

    update(entity: OrderDTO) {
        this.openDialogEquipment(entity);
    }

    openDialogEquipment(entity: OrderDTO): void {
        /*
        this.dialog.open(EquipmentSupplierCreateComponent, {
            maxWidth: '640px',
            height: 'auto',
            data: entity,
        }).afterClosed()
            .subscribe((result: boolean) => {
                if (result) {
                    this.fetchPaginatedList();
                }
            });
            */
    }

    changeIsActiveState(entity: OrderDTO) {
        /*
        this.dialogMessageService
            .showDecisionDialog('¿Está seguro de que desea cambiar el estado a este equipamiento?')
            .afterClosed()
            .subscribe((response: boolean) => {
                if (response) {
                    if (response == true) {
                        this.equipmentService.changeIsActiveState(entity.id!, !entity.isActive).subscribe({
                            next: response => {
                                if (response.status) {
                                    this.dialogMessageService.showSuccessDialog(response.message.description);
                                    this.fetchPaginatedList();
                                } else {
                                    this.dialogMessageService.showErrorDialog(response.message.description);
                                }
                            },
                            error: error => {
                                this.dialogMessageService.showErrorDialog(error.error.message.description);
                            }
                        });
                    }
                }
            });
            */
    }

    delete(entity: OrderDTO) {
        /*
        this.dialogMessageService
            .showDecisionDialog('¿Está seguro de que desea eliminar este equipamiento?')
            .afterClosed()
            .subscribe((response: boolean) => {
                if (response) {
                    if (response == true) {
                        this.equipmentService.delete(entity.id!).subscribe({
                            next: response => {
                                if (response.status) {
                                    this.dialogMessageService.showSuccessDialog(response.message.description);
                                    this.fetchPaginatedList();
                                } else {
                                    this.dialogMessageService.showErrorDialog(response.message.description);
                                }
                            },
                            error: error => {
                                this.dialogMessageService.showErrorDialog(error.error.message.description);
                            }
                        });
                    }
                }
            });
            */
    }
}
