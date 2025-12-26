import { DialogMessageService } from './../../../core/services/dialog-message.service';
import { AfterViewInit, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';

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
    ],
    templateUrl: './dashboard-main.component.html',
    styleUrl: './dashboard-main.component.css'
})
export class DashboardMainComponent implements OnInit, AfterViewInit {
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

        
        'Activo',
        'Acciones'
    ];

    // Paginator
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    totalRecords = 0;
    currentPage = 0;
    rowsPerPageList: number[] = [5, 10, 25];
    rowsPerPage = 10;
    //End Paginator

    selectedRow: any;
    constructor(
      private breakpointObserver: BreakpointObserver
    , private dashboardService: DashboardServiceService
    , private dialog: MatDialog
    , private dialogMessageService: DialogMessageService
    ) {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            this.isMobile = result.matches;
        });
    }

    ngOnInit(): void {
        this.fetchPaginatedList();
    }

    ngAfterViewInit():void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    fetchPaginatedList() {
        this.dashboardService.getPaginatedList(this.currentPage + 1, this.rowsPerPage, '').subscribe({
            next: (result) => {
                this.totalRecords = result.data?.totalRecords!;
                this.dataSource.data = result.data?.results!;

                this.paginator.length = this.totalRecords;
                this.paginator.pageIndex = this.currentPage;
            },
            error: (error) => {
                console.error('Error fetching data:', error);
            }
        });
    }
    onRowClick(row: any) {
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
    // End Paginator methods

    update(entity: OrderDTO) {
        this.openDialogEquipment(entity);
    }

    openDialogEquipment(entity: OrderDTO): void {
        
        /*this.dialog.open(EquipmentSupplierCreateComponent, {
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
        console.log('changeIsActiveState', entity);
        this.dialogMessageService
            .showDecisionDialog('¿Está seguro de que desea cambiar el estado a este equipamiento?')
            .afterClosed()
            .subscribe((response: boolean) => {
                console.log('response', response);
                if (response) {
                    if (response == true) {
                        this.dashboardService.changeIsActiveState(entity.id!, !entity.isAllow).subscribe({
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
            
    }

    delete(entity: OrderDTO) {
        console.log('delete', entity);
        this.dialogMessageService
            .showDecisionDialog('¿Está seguro de que desea eliminar este equipamiento?')
            .afterClosed()
            .subscribe((response: boolean) => {
                if (response) {
                    if (response == true) {
                        this.dashboardService.delete(entity.id!).subscribe({
                            next: response => {
                                console.log('response', response);  
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
    }
}
