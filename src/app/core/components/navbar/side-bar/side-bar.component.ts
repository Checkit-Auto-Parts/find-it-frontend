import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CoreModule } from '../../../modules/core.module';
import { MaterialNavbarModule } from '../../../modules/material-navbar.module';
import { MatSidenav } from '@angular/material/sidenav';
import { SecurityService } from '../../../../modules/security/services/security.service';
import { DialogMessageService } from '../../../services/dialog-message.service';
import { LayoutModule, BreakpointObserver } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SubSink } from 'subsink';
import { LoginResponseDTO } from '../../../../modules/security/models/user-login-response.dto';
import { RoleDTO, RoleEnum } from '../../../../modules/user/models/role.dto';
import { PermissionParametersDto } from '../../../../modules/user/models/permission-parameters.dto';
import { PermissionDto } from '../../../../modules/user/models/permission.dto';
import { LocalStorageKeysService } from '../../../../modules/security/services/local-storage-keys.service';
import { PermissionService } from '../../../../modules/user/services/permission.service';
import { constrainedMemory } from 'process';
import { BreadcrumbsComponent } from "../../breadcrumbs/breadcrumbs.component";

@Component({
	selector: 'app-side-bar',
	standalone: true,
	imports: [
    CoreModule,
    MaterialNavbarModule,
    LayoutModule,
    MatListModule,
    RouterModule,
    MatButtonModule,
    BreadcrumbsComponent
],
	providers: [PermissionService],
	templateUrl: './side-bar.component.html',
	styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit, AfterViewInit, OnDestroy {
	title = '';
	@ViewChild(MatSidenav)
	sidenav!: MatSidenav;
	isMobile = true;
	isCollapsed = false;
	// isAuthenticated: boolean = false;

	isCliente!: boolean;
	roleTypeString: string = '';
	roleEnumString?: string = '';

	_user?: LoginResponseDTO;
	subs: SubSink = new SubSink();

	_showItemsUserInternal: boolean = false;
	_showItemsAdmin: boolean = false;
	_showItemsOperation: boolean = false;
	_showItemsUserExternal: boolean = false;


	permissionParameters!: PermissionParametersDto;
	permissionsList: PermissionDto[] = [];

	constructor(
		private observer: BreakpointObserver,
		private securityService: SecurityService,
		private dialogMessageService: DialogMessageService,
		private keysService: LocalStorageKeysService,
		private permissionService: PermissionService,
		private cdr: ChangeDetectorRef,
		private ngZone: NgZone
	) { }

	ngOnInit() {
		// this.isAuthenticated = this.securityService.authenticated();
		// this.getParameters();
		// this.getPermissions();
		this.observer.observe(['(max-width: 800px)'])
			.subscribe(result => {
				this.ngZone.run(() => {
				this.isMobile = result.matches;
				// Esto fuerza la detección en el siguiente ciclo
				this.cdr.detectChanges();
				});
			});
		

		// this.subs.add(
		// 	this.securityService.currentUser$.subscribe(user => {
		// 		this._user = { ...user! };
		// 		this.roleEnumString = user?.roles.reduce((init, r) => {
		// 			return init + r.name + ', '
		// 		}, '');
		// 		this.setItemsVisibility(user?.roles!);
		// 	})
		// );
	}
	ngAfterViewInit(): void {

	}
	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}

	setItemsVisibility(roles: RoleDTO[]) {

		this._showItemsUserInternal = false;
		this._showItemsAdmin = false;
		this._showItemsOperation = false;
		this._showItemsUserExternal = false;

		const internal = this._user?.roles.find(r =>
			r.enumId == RoleEnum.Administrator
		);

		if (internal) {
			this._showItemsUserInternal = true;

			if (this.roleEnumString?.includes(RoleEnum[RoleEnum.Administrator])) {
				this._showItemsAdmin = true;
			} else {
				//
			}
		} else {
			this._showItemsUserExternal = true;
		}

	}

	isAuthorized(): boolean {
		return true;
	}

	toggleMenu() {
		if (this.isMobile) {
			this.sidenav.toggle();
			this.isCollapsed = false;
		} else {
			this.sidenav.open();
			this.isCollapsed = !this.isCollapsed;
		}
	}

	simpleToggle() {
		if (this.isMobile) {
			this.sidenav.toggle();
			this.isCollapsed = false;
		}
	}

	logOut() {
		this.dialogMessageService
			.showDecisionDialog('Are you sure you want to log out?', false)
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					if (response == true) {
						this.securityService.logout();
					}
				}
			});
	}

	getPermissions() {
		var permissions = localStorage.getItem(this.keysService.USER_PERMISSIONS);
		if (typeof permissions === 'undefined' || permissions === null) {
			this.permissionsList = JSON.parse(permissions!);
			this.permissionService.setPermissions(this.permissionsList);
		}
	};

	getParameters() {
		this.permissionService.getPermissionParameters().subscribe({
			next: (response) => {
				if (response.status) {
					this.permissionParameters = response.data!;
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
}
