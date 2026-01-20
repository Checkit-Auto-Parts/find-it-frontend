import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StateExecution } from '../../../../../core/models/normalized/stateExecution.model';
import { OrderDTO } from '../../../../dashboard/models/order.dto';
import { SendTemplateDTO } from '../models/send-template.dto';
import { SendTextDTO } from '../models/send-text.dto';

@Injectable({
    providedIn: 'root'
})
export class UpdateOrderService {

    apiUrl = `${environment.apiUrl}whatsapp/cloud/`;
    constructor(
        private http: HttpClient
    ) { }
    
    sendMessageByTemplate(sendMessageByTemplateDto: SendTemplateDTO) {
        return this.http.post<StateExecution<SendTemplateDTO>>(`${this.apiUrl}template`, sendMessageByTemplateDto );
    }

    sendMessageByText(sendMessageByTextDto: SendTextDTO) {
        return this.http.post<StateExecution<SendTextDTO>>(`${this.apiUrl}text`, sendMessageByTextDto );
    }
}
