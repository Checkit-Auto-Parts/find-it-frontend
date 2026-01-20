import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoreModule } from '../../../../core/modules/core.module';
import { MaterialFormModule } from '../../../../core/modules/material-form.module';
import { MaterialTableModule } from '../../../../core/modules/material-table.module';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OrderDTO } from '../../../dashboard/models/order.dto';
import { MatTableDataSource } from '@angular/material/table';
import { SendTemplateDTO } from './models/send-template.dto';
import { UpdateOrderService } from './services/update-order.service';
import { DialogMessageService } from '../../../../core/services/dialog-message.service';
import { OnlyDigitsDirective } from "../../../../core/directives/only-digits-directive";
import { SendTextDTO } from './models/send-text.dto';

@Component({
    selector: 'app-update-order',
    standalone: true,
    imports: [
    CoreModule,
    MaterialFormModule,
    MaterialTableModule,
    MatDialogModule,
    DragDropModule,
    OnlyDigitsDirective
],
    templateUrl: './update-order.component.html',
    styleUrl: './update-order.component.css'
})
export class UpdateOrderComponent implements OnInit {
    orderForm!: FormGroup;
    isReadonly: boolean = true;
    dataSource = new MatTableDataSource<any>();
    displayedColumns: string[] = [
        'comment',
        'action'
    ];
    sendMessageByTemplatedto!: SendTemplateDTO;
    sendMessageByTextdto!: SendTextDTO;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: OrderDTO,
        private formBuilder: FormBuilder,
        private updateOrderService: UpdateOrderService,
        private dialogMessageService: DialogMessageService,
    ) { 
        // console.log('injection?',this.data);
        this.createFormControls();
    }
    ngOnInit(): void {
    }

    createFormControls() {
        this.orderForm = this.formBuilder.group({
            comment: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required, Validators.maxLength(500)]),    
            phoneNumber: new FormControl(0, [Validators.required, Validators.maxLength(15)]),
            isCustomizedMessage: new FormControl(false),
        });
    }

    enable(event: any) {
        this.isReadonly = !this.isReadonly;
        const isCustomizedMessage = this.orderForm.get('isCustomizedMessage')?.value;
        if (isCustomizedMessage) {
            this.orderForm.get('comment')?.enable();
        } else {
            this.orderForm.get('comment')?.setValue("");
            this.orderForm.get('comment')?.disable();
        }
    }
    sendMessage() { 
        if (this.orderForm.valid) {
            
            const number = this.orderForm.get('phoneNumber')?.value;
            const isCustomizedMessage = this.orderForm.get('isCustomizedMessage')?.value;
            const message = this.orderForm.get('comment')?.value;
            
            if (isCustomizedMessage) {
                this.sendMessageByTextdto = {
                    toPhoneE164: number,
                    text: message
                };
                this.updateOrderService.sendMessageByText(this.sendMessageByTextdto).subscribe({
                    next: (response) => {
                        console.log(response.message.detailDev);
                        if (response.status) {   
                            this.dialogMessageService.showSuccessDialog("Mensaje enviado correctamente.");
                        } else {
                            this.dialogMessageService.showErrorDialog(response.message.description?.toString() || `Mensaje no enviado.`);
                        }
                    }
                });
                
            } else {
                this.sendMessageByTemplatedto = {
                    toPhoneE164: number,
                    templateName: 'hello_world',
                    languageCode: 'en_US'
                };

                this.updateOrderService.sendMessageByTemplate(this.sendMessageByTemplatedto).subscribe({
                    next: (response) => {
                        if (response.status) {   
                            this.dialogMessageService.showSuccessDialog("Mensaje enviado correctamente.");
                        } else {
                            this.dialogMessageService.showErrorDialog(`${response.message} Mensaje no enviado.`);                    
                        }
                    }
                });
            }
        }
    }
}
