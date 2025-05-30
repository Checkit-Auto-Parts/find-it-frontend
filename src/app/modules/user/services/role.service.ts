import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { StateExecution } from '../../../core/models/normalized/stateExecution.model';
import { RoleDTO, RoleEnum } from '../models/role.dto';

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    private idRoles: any[] = [
        { roleId: '0f10586b-a8d0-4993-50e4-08dd3498bdee', roleEnum: RoleEnum.Administrator },
    ];



    apiUrl = `${environment.apiUrl}Role`;

    constructor(
        private http: HttpClient
    ) { }

    getRoleIdByEnum(roleEnum: RoleEnum): string {
        const aux = this.idRoles.find(r => r.roleEnum == roleEnum);
        return aux ? aux.roleId : '';
    }

    getList() {
        return this.http.get<StateExecution<RoleDTO[]>>(`${this.apiUrl}/GetAll`);
    }

}
