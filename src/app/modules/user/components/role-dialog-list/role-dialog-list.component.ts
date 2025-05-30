import { Component, Inject } from '@angular/core';
import { CoreModule } from '../../../../core/modules/core.module';
import { MaterialTableModule } from '../../../../core/modules/material-table.module';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RoleService } from '../../services/role.service';
import { RoleDTO } from '../../models/role.dto';
import { DialogMessageService } from '../../../../core/services/dialog-message.service';
import { DefaultMessageService } from '../../../../core/services/default-message.service';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-role-dialog-list',
  standalone: true,
  imports: [
    CoreModule,
    MaterialTableModule,
    MatDialogModule,
    DragDropModule,
  ],
  templateUrl: './role-dialog-list.component.html',
  styleUrl: './role-dialog-list.component.css'
})
export class RoleDialogListComponent {

  displayedColumns: string[] = [
    'id',
    'name',
    'action'
  ];

  dataSource = new MatTableDataSource<any>();

  constructor(
    public roleService: RoleService,
    public dialogRef: MatDialogRef<RoleDialogListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoleDTO[],
    private dialogMessageService: DialogMessageService,
    private defaulMessage: DefaultMessageService
  ) {
    this.fetchList();
  }

  fetchList() {
    this.roleService
      .getList()
      .subscribe({
        next: result => {
          this.dataSource.data = result.data!
            .map((role: any) => ({
              ...role,
              idFormatted: `R-${role.id.slice(-4).toUpperCase()}`,
            }));
        },
        error: error => {
          this.dataSource.data = [];
        }
      });
  }

  addRole(role: RoleDTO) {
    this.dialogRef.close(role);
  }

  exist(roleTable: RoleDTO): boolean {
    let exist = this.data.find(r => r.id == roleTable.id);
    return exist ? true : false;
  }

}
