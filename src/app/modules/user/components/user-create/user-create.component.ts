import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserDTO } from '../../models/user.dtot';
import { DialogMessageService } from '../../../../core/services/dialog-message.service';
import { DefaultMessageService } from '../../../../core/services/default-message.service';
import { CoreModule } from '../../../../core/modules/core.module';
import { MaterialFormModule } from '../../../../core/modules/material-form.module';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialTableModule } from '../../../../core/modules/material-table.module';
import { RoleDialogListComponent } from '../role-dialog-list/role-dialog-list.component';
import { RoleDTO, RoleEnum } from '../../models/role.dto';
import { CreatedUserDto } from '../../models/create-user.dto';
import { UpdateUserDTO } from '../../models/update-user.dto';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SupplierDTO } from '../../../supplier/models/supplier.dto';
import { SupplierService } from '../../../supplier/services/supplier.service';

@Component({
	selector: 'app-user-create',
	standalone: true,
	imports: [
		CoreModule,
		MaterialFormModule,
		MaterialTableModule,
		MatDialogModule,
		DragDropModule,
	],
	templateUrl: './user-create.component.html',
	styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit {

	_user!: UserDTO;
	userForm!: FormGroup;

	supplierList: SupplierDTO[] = [];
	showSupplier: boolean = false;
	disableAddButton: boolean = false;

	displayedColumns: string[] = [
		'id',
		'name',
		'action'
	];

	dataSource = new MatTableDataSource<any>();

	constructor(
		private formBuilder: FormBuilder,
		private userService: UserService,
		private dialog: MatDialog,
		public dialogRef: MatDialogRef<UserCreateComponent>,
		@Inject(MAT_DIALOG_DATA) public data: UserDTO,
		private dialogMessageService: DialogMessageService,
		private defaulMessage: DefaultMessageService,
		private supplierService: SupplierService,
	) {
		this.fetchSupplierList();
	}

	ngOnInit(): void {
		this.createFormControls();
		this.setLocalValues();
	}


	createFormControls() {
		this.userForm = this.formBuilder.group({
			userName: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.email]),
			firstName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			lastName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			password: new FormControl('', []),
			supplierId: new FormControl(0, []),
		});
	}

	setLocalValues() {
		this._user = { ...this.data };
		this.userForm.patchValue(this.data);

		this.dataSource.data = this._user.roles!;
		this.applyIdMask(this._user.roles!);

		this.setFormValidators();
		// this.verifyRoleSupplierExists(this._user.roles!);
	}

	setFormValidators() {
		if (this._user.id != '') {
			this.password?.clearValidators();
			this.password?.setValidators([Validators.maxLength(100)])
			this.password?.updateValueAndValidity();
		} else {
			this.password?.clearValidators();
			this.password?.setValidators([Validators.required, Validators.maxLength(100)])
			this.password?.updateValueAndValidity();
		}
	}

	openDialogRole(): void {
		this.dialog.open(RoleDialogListComponent, {
			maxWidth: '420px',
			minWidth: '320px',
			maxHeight: '95vh',
			height: 'auto',
			data: this._user.roles!
		}).afterClosed().subscribe((role: RoleDTO) => {
			if (role) {
				this._user.roles = [...this._user?.roles!, role];
				this.applyIdMask(this._user.roles);
				// this.verifyRoleSupplierExists(this._user.roles);
			}
		});
	}

	applyIdMask(list: RoleDTO[]) {
		this.dataSource.data = list
			? list.map((roles: any) => ({
				...roles,
				idFormatted: `R-${roles.id.slice(-4).toUpperCase()}`,
				idUser: roles.idFormatted,
			}))
			: [];
	}

	deleteRol(id: string) {
		this._user.roles = this._user.roles!.filter(r => r.id != id);
		this.applyIdMask(this._user.roles!);
		// this.verifyRoleSupplierExists(this._user.roles);
	}
	/*
	verifyRoleSupplierExists(roles: RoleDTO[]) {
		const roleSupplier = roles.find(r => r.enumId == RoleEnum.Suplidor);

		if (roleSupplier) {

			this._user.roles = roles.filter(r => r.enumId == RoleEnum.Suplidor);
			this.applyIdMask(this._user.roles);

			this.supplierId?.clearValidators();
			this.supplierId?.setValidators([Validators.required])
			this.supplierId?.updateValueAndValidity();

			this.showSupplier = true;
			this.disableAddButton = true;
		} else {

			this._user.roles = roles.filter(r => r.enumId != RoleEnum.Suplidor);
			this.applyIdMask(this._user.roles);

			this.supplierId?.clearValidators();
			this.supplierId?.setValue(0);
			this.supplierId?.updateValueAndValidity();

			this.showSupplier = false;
			this.disableAddButton = false;
		}
	}
	*/
	save() {
		if (!this.userForm.valid) {
			this.dialogMessageService.showErrorDialog('Complete los campos requeridos.');
			return;
		}

		if (this._user.roles?.length == 0) {
			this.dialogMessageService.showErrorDialog('Seleccione al menos un rol para el usuario.');
			return;
		}

		this.data.id == ''
			? this.executeSave()
			: this.executeUpdate();
	}

	executeSave() {
		const userAux: CreatedUserDto = {
			firstName: this.firstName?.value.trim(),
			lastName: this.lastName?.value.trim(),
			userName: this.userName?.value.trim(),
			password: this.password?.value,
			roleIds: this._user?.roles!.map(r => {
				return r.id;
			}),
			supplierId: this.supplierId?.value
		};

		this.userService.save(userAux).subscribe({
			next: response => {
				if (response.status) {
					this.dialogMessageService.showSuccessDialog(response.message.description);
					this.dialogRef.close(true);
				} else {
					this.dialogMessageService.showErrorDialog(response.message.description);
				}
			},
			error: error => {
				this.dialogMessageService.showErrorDialog(error.error.message.description);
			}
		});
	}

	executeUpdate() {
		const userAux: UpdateUserDTO = {
			id: this._user.id,
			firstName: this.firstName?.value.trim(),
			lastName: this.lastName?.value.trim(),
			roleIds: this._user?.roles!.map(r => {
				return r.id;
			}),
			supplierId: this.supplierId?.value
		};

		this.userService.update(userAux).subscribe({
			next: response => {
				if (response.status) {
					this.dialogMessageService.showSuccessDialog(response.message.description);
					this.dialogRef.close(true);
				} else {
					this.dialogMessageService.showErrorDialog(response.message.description);
				}
			},
			error: error => {
				this.dialogMessageService.showErrorDialog(error.error.message.description);
			}
		});
	}



	fetchSupplierList() {
		this.supplierService
			.getAll()
			.subscribe({
				next: (result) => {
					this.supplierList = result.data!;
				},
				error: (error) => {
					this.supplierList = [];
				},
			});
	}

	//#region GETTERS

	get userName() {
		return this.userForm.get('userName');
	}
	get firstName() {
		return this.userForm.get('firstName');
	}
	get lastName() {
		return this.userForm.get('lastName');
	}
	get password() {
		return this.userForm.get('password');
	}
	get supplierId() {
		return this.userForm.get('supplierId');
	}

	//#endregion
}
