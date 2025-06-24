import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { USER_TOKEN } from '../../../tokens/user-token';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { MaterialTableModule } from '../../../core/modules/material-table.module';
import { NgIf } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgClass } from '@angular/common';
import { CustomPaginatorComponent } from "../../../core/components/table/custom-paginator/custom-paginator.component";
import { CustomPaginatorConfig } from '../../../core/models/other/custom-paginator-config.model';

@Component({
    selector: 'app-dashboard-main',
    standalone: true,
    imports: [NgClass, LayoutModule, MatCardModule, MaterialTableModule, NgIf, MatPaginator, MatSort, CustomPaginatorComponent],
    templateUrl: './dashboard-main.component.html',
    styleUrl: './dashboard-main.component.css'
})
export class DashboardMainComponent {
    isMobile = false;

    displayedColumns: string[] = [
        'nombre', 'apellido', 'marcaVehiculo', 'modelo', 'anio', 'motor',
        'repuesto', 'foto', 'marcaRepuesto', 'garantia', 'precio', 'descripcion'
    ];

    pedidos = [
        {
            nombre: 'Carlos',
            apellido: 'Pérez',
            marcaVehiculo: 'Toyota',
            modelo: 'Corolla',
            anio: 2017,
            motor: '1.8L',
            repuesto: 'Alternador',
            foto: 'https://via.placeholder.com/100',
            marcaRepuesto: 'Bosch',
            garantia: '6 meses',
            precio: '$120',
            descripcion: 'Alternador para Corolla 2017'
        },
        // otros pedidos...
    ];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    totalRecords = 0;
    currentPage = 0;
    rowsPerPageList: number[] = [5, 10, 25];
    rowsPerPage = 10;

    selectedRow: any;
    constructor(private breakpointObserver: BreakpointObserver) {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            this.isMobile = result.matches;
        });
    }
    fetchPaginatedList(){}
    onRowClick(row: any) {
        this.selectedRow = this.selectedRow ? null : this.pedidos[0]; //
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
}
