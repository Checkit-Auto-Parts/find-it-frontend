import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { PermissionDto } from '../models/permission.dto';
import { HttpClient } from '@angular/common/http';
import { StateExecution } from '../../../core/models/normalized/stateExecution.model';
import { PermissionParametersDto } from '../models/permission-parameters.dto';

@Injectable({
	providedIn: 'root'
})
export class PermissionService {
	apiUrl = `${environment.apiUrl}Permission`;
	private permissionsList: PermissionDto[] = [];
	constructor(
		private http: HttpClient
	) { }
	setPermissions(permissions: PermissionDto[]) {
		this.permissionsList = permissions;
	}
	hasPermission(permission: string): boolean {
		return this.permissionsList.some(x => x.name == permission);
	}
	getPermissionParameters() {
		return this.http.get<StateExecution<PermissionParametersDto>>(`${this.apiUrl}/GetPermissionParameters`);
	}
}
