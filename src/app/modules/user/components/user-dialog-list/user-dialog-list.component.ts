import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { CoreModule } from '../../../../core/modules/core.module';
import { MaterialTableModule } from '../../../../core/modules/material-table.module';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CustomPaginatorComponent } from '../../../../core/components/table/custom-paginator/custom-paginator.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { UserRoleDialogConfig } from '../../models/user-role-dialog-config.model';
import { DialogMessageService } from '../../../../core/services/dialog-message.service';
import { DefaultMessageService } from '../../../../core/services/default-message.service';
import { UserDTO } from '../../models/user.dtot';
import { CustomPaginatorConfig } from '../../../../core/models/other/custom-paginator-config.model';
import { OperationAreaUserDto } from '../../../operation-area/models/operation-area.dto';

@Component({
  selector: 'app-user-dialog-list',
  standalone: true,
  imports: [
    CoreModule,
    MaterialTableModule,
    MatDialogModule,
    DragDropModule,
    CustomPaginatorComponent,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './user-dialog-list.component.html',
  styleUrl: './user-dialog-list.component.css'
})
export class UserDialogListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'id',
    'userName',
    'firstName',
    'lastName',
    // 'email',
    // 'roles',
    // 'createdAt',
    // 'createdByFullName',
    // 'modifiedAt',
    // 'modifiedByFullName',
    // 'isActive',
    'action'
  ];

  _userSetList?: Set<string | undefined>;
  _operationAreaUserList?: OperationAreaUserDto[];

  filter = '';
  dataSource = new MatTableDataSource<any>();
  //#region PAGINATOR
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalRecords = 0;
  currentPage = 0;
  rowsPerPageList: number[] = [5, 10, 25];
  rowsPerPage = 5;
  //#endregion

  // #region UX
  @ViewChild('filter', { static: false }) filterInput!: ElementRef;
  selectedRow: any;
  // #region UX

  constructor(
    public userService: UserService,
    public dialogRef: MatDialogRef<UserDialogListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRoleDialogConfig,
    private dialogMessageService: DialogMessageService,
    private defaulMessage: DefaultMessageService
  ) {
    //*estoy dejando preparado este dialog con el 'UserRoleDialogConfig' para que pueda buscar todos los usuarios o un rol especifico por si necesito luego    
    this._userSetList = new Set(this.data.userIdsInList);
    this._operationAreaUserList = [...this.data.operationAreaUserList!];
  }
  ngOnInit(): void {
    this.fetchPaginatedList();
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

  fetchPaginatedList() {
    this.userService
      .getPaginatedListByRole(this.data.roleId!, this.currentPage + 1, this.rowsPerPage, this.filter)
      .subscribe({
        next: (result) => {
          this.totalRecords = result.data?.totalRecords!;
          this.dataSource.data = result.data?.results.map(u => {
            u.idFormatted = `U-${u.id.slice(0, 4).toUpperCase()}`;
            u.isAlreadyOnList = this._userSetList!.has(u.id);
            return u;
          })!;

          this.paginator.length = this.totalRecords;
          this.paginator.pageIndex = this.currentPage;
        },
        error: (error) => {
          this.dataSource.data = [];
          this.totalRecords = 0;
          this.paginator.length = this.totalRecords;
        },
      });
  }

  addToUserIdList(event: any, user: UserDTO) {
    if (event.checked) {
      this._userSetList?.add(user.id);
      this._operationAreaUserList = [
        ...this._operationAreaUserList!,
        {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName
        }
      ]
    } else {
      this._userSetList?.delete(user.id);
      this._operationAreaUserList = this._operationAreaUserList?.filter(oau => oau.id != user.id);
    }
  }

  returnOperationAreaUserList() {
    this.dialogRef.close(this._operationAreaUserList);
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
