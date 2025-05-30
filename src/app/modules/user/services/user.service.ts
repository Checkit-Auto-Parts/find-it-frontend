import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StateExecution } from '../../../core/models/normalized/stateExecution.model';
import { UserDTO } from '../models/user.dtot';
import { PaginatedListDTO } from '../../../core/models/other/paginated-list.dto';
import { CreatedUserDto } from '../models/create-user.dto';
import { UpdateUserDTO } from '../models/update-user.dto';
import { UserParametersDto } from '../models/user-parameters.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = `${environment.apiUrl}user`;

  constructor(
    private http: HttpClient
  ) { }


  getPaginatedList(page: number, rows: number, filter: string) {
    const httpParams = new HttpParams()
      .set('page', page)
      .set('rows', rows)
      .set('filter', filter);

    return this.http.get<StateExecution<PaginatedListDTO<UserDTO>>>(`${this.apiUrl}/Get`, { params: httpParams });
  }
  getPaginatedListByRole(roleId: string, page: number, rows: number, filter: string) {
    const httpParams = new HttpParams()
      .set('page', page)
      .set('rows', rows)
      .set('filter', filter);

    return this.http.get<StateExecution<PaginatedListDTO<UserDTO>>>(`${this.apiUrl}/GetByRoleId/${roleId}`, { params: httpParams });
  }

  save(user: CreatedUserDto) {
    return this.http.post<StateExecution<null>>(`${this.apiUrl}/add`, user);
  }

  update(user: UpdateUserDTO) {
    return this.http.put<StateExecution<null>>(`${this.apiUrl}/update/${user.id}`, user);
  }

  changeIsActiveState(userId: string, stateIsActive: boolean) {
    return this.http.put<StateExecution<null>>(`${this.apiUrl}/UpdateStatus/${userId}`, { id: userId, isActive: stateIsActive });
  }

  delete(userId: string) {
    return this.http.delete<StateExecution<null>>(`${this.apiUrl}/${userId}`);
  }
  getUserParameters() {
    return this.http.get<StateExecution<UserParametersDto>>(`${this.apiUrl}/GetUserParameters`);
  }
}
