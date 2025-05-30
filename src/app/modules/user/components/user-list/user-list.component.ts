import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CoreModule } from '../../../../core/modules/core.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageService } from '../../../../core/services/dialog-message.service';
import { DefaultMessageService } from '../../../../core/services/default-message.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ExcludeDefaultDatePipe } from '../../../../core/pipes/exclude-default-date.pipe';
import { UserDTO } from '../../models/user.dtot';
import { CustomPaginatorConfig } from '../../../../core/models/other/custom-paginator-config.model';
import { MaterialTableModule } from '../../../../core/modules/material-table.module';
import { MatInputModule } from '@angular/material/input';
import { CustomPaginatorComponent } from '../../../../core/components/table/custom-paginator/custom-paginator.component';
import { UserCreateComponent } from '../user-create/user-create.component';
import { UserParametersDto } from '../../models/user-parameters.dto';
import { PermissionDto } from '../../models/permission.dto';
import { LocalStorageKeysService } from '../../../security/services/local-storage-keys.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CoreModule,
    MaterialTableModule,
    CustomPaginatorComponent,
    MatFormFieldModule,
    MatInputModule,
    ExcludeDefaultDatePipe,
  ],
  providers: [
    // UserService
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'userName',
    'roles',
    'createdAt',
    'createdByFullName',
    'modifiedAt',
    'modifiedByFullName',
    'isActive',
    'action'
  ];

  filter = '';

  dataSource = new MatTableDataSource<any>();
  //#region PAGINATOR
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalRecords = 0;
  currentPage = 0;
  rowsPerPageList: number[] = [5, 10, 25];
  rowsPerPage = 10;
  //#endregion

  // #region UX
  @ViewChild('filter', { static: false }) filterInput!: ElementRef;
  selectedRow: any;
  // #region UX
  userParameters!: UserParametersDto;
  permissionsList:PermissionDto[]=[];
  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private dialogMessageService: DialogMessageService,
    private defaulMessage: DefaultMessageService,
    private keysService: LocalStorageKeysService,
    private permissionService:PermissionService,
  ) { }

  ngOnInit(): void {
    this.fetchPaginatedList();
    this.getParameters();
    this.getPermissions();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (paginatorData, property) => {
      switch (property) {
        case 'id':
          return paginatorData.idFormatted;
        default:
          return paginatorData[property];
      }
    };
  }
  setVisibilityItems(){
    if (!(this.hasPermission(this.userParameters.deleteUser) || this.hasPermission(this.userParameters.changeUser) ||
    this.hasPermission(this.userParameters.editUser))) {
      this.displayedColumns = this.displayedColumns.filter(dc => dc != 'action');
    }
  }
  fetchPaginatedList() {
    this.userService
      .getPaginatedList(this.currentPage + 1, this.rowsPerPage, this.filter)
      .subscribe({
        next: (result) => {
          this.totalRecords = result.data?.totalRecords!;
          this.dataSource.data = result.data?.results
            ? result.data.results.map((user: any) => ({
              ...user,
              idFormatted: `U-${user.id.slice(-4).toUpperCase()}`,
            }))
            : [];

          this.paginator.length = this.totalRecords;
          this.paginator.pageIndex = this.currentPage;
          this.setVisibilityItems();
        },
        error: (error) => {
          this.dataSource.data = [];
          this.totalRecords = 0;
          this.paginator.length = this.totalRecords;
        },
      });
  }

  create() {
    this.openDialogUser({
      id: '',
      firstName: '',
      lastName: '',
      userName: '',
      roles: []
    });
  }

  update(user: UserDTO) {
    this.openDialogUser({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      roles: user.roles,
    });
  }

  changeIsActiveState(user: UserDTO) {
    this.dialogMessageService
      .showDecisionDialog('¿Está seguro de que desea cambiar el estado a este usuario?')
      .afterClosed()
      .subscribe((response: boolean) => {
        if (response) {
          if (response == true) {
            this.userService.changeIsActiveState(user.id!, !user.isActive).subscribe({
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

  delete(user: UserDTO) {
    this.dialogMessageService
      .showDecisionDialog('¿Está seguro de que desea eliminar este usuario?')
      .afterClosed()
      .subscribe((response: boolean) => {
        if (response) {
          if (response == true) {
            this.userService.delete(user.id!).subscribe({
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

  openDialogUser(user: UserDTO): void {
    this.dialog.open(UserCreateComponent, {
      maxWidth: '640px',
      // minWidth: '620px',
      // maxHeight: '95vh',
      height: 'auto',
      data: user,
    }).afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.fetchPaginatedList();
        }
      });
  }

  getPermissions(){
    var permissions = localStorage.getItem(this.keysService.USER_PERMISSIONS);
     this.permissionsList = JSON.parse(permissions!);
     this.permissionService.setPermissions(this.permissionsList);
  };

  getParameters(){
    this.userService.getUserParameters().subscribe({
      next: (response) => {
        if (response.status) {
          this.userParameters = response.data!;
        } else {
          this.dialogMessageService.showErrorDialog(
            response.message.description
          );
        }
      },
      error: (error) => {
        this.dialogMessageService.showErrorDialog(
          error.error.message.description
        );
      },
    })
  }
  hasPermission(permission: string): boolean {
    return this.permissionService.hasPermission(permission);
  }
  //#region PAGINATOR
  fetchList(paginatorConfig: CustomPaginatorConfig) {
    if (paginatorConfig.recargar) {
      this.currentPage = paginatorConfig.currentPage!;
      this.rowsPerPage = paginatorConfig.rowsPerPage!;
      this.fetchPaginatedList();
    }
  }
  triggerPaginatorPageChangedEvent(numero: number) {
    this.paginator._changePageSize(numero);
  }
  pageChanged(event: any) {
    this.currentPage = event.pageIndex;
    this.rowsPerPage = event.pageSize;
    this.fetchPaginatedList();
  }
  //#endregion

  // #region USER EXPERIENCE (UX)
  applyFilter(filtro: any) {
    this.filter = filtro;
    this.currentPage = 0;
    this.fetchPaginatedList();
  }
  onRowClick(row: any): void {
    this.selectedRow = row;
  }
  // #endregion
}
