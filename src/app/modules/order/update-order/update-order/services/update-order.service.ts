import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StateExecution } from '../../../../../core/models/normalized/stateExecution.model';
import { OrderDTO } from '../../../../dashboard/models/order.dto';
import { SendTemplateDTO } from '../models/sendTemplate.dto';

@Injectable({
    providedIn: 'root'
})
export class UpdateOrderService {

    apiUrl = `${environment.apiUrl}whatsapp/cloud/`;
    constructor(
        private http: HttpClient
    ) { }
    
    save(dto: OrderDTO[]) {
        return this.http.post<StateExecution<null>>(`${this.apiUrl}/sendComment`, dto);
    }

    sendMessage(sendMessageToDto: SendTemplateDTO) {
        return this.http.post<StateExecution<null>>(`${this.apiUrl}template`, sendMessageToDto );
    }
}
