import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StateExecution } from '../../../core/models/normalized/stateExecution.model';
import { PaginatedListDTO } from '../../../core/models/other/paginated-list.dto';
import { OrderDTO } from '../models/order.dto';

@Injectable({
    providedIn: 'root'
})
export class DashboardServiceService {

    apiUrl = `${environment.apiUrl}order`;
    constructor(
        private http: HttpClient
    ) { }

    getPaginatedList(page: number, rows: number, filter: string) {
        const httpParams = new HttpParams()
            // .set('suplierId', supplierId)
            .set('page', page)
            .set('rows', rows)
            .set('filter', filter);

        return this.http.get<StateExecution<PaginatedListDTO<OrderDTO>>>(`${this.apiUrl}/GetAllPaginated`, { params: httpParams });
    }

    changeIsActiveState(id: number, isAllow: boolean) {
        console.log('changeIsActiveState', id, isAllow);
        return this.http.put<StateExecution<null>>(`${this.apiUrl}/IsAllow/${id}`, { id: id, isAllow: isAllow });
    }

    delete(id: number) {
        id = -1;
        return this.http.delete<StateExecution<null>>(`${this.apiUrl}/DeleteOrder/${id}`);
    }              
}
