import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoreModule } from '../../../../core/modules/core.module';
import { MaterialFormModule } from '../../../../core/modules/material-form.module';
import { MaterialTableModule } from '../../../../core/modules/material-table.module';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OrderDTO } from '../../../dashboard/models/order.dto';
import { MatTableDataSource } from '@angular/material/table';
import { SendTemplateDTO } from './models/sendTemplate.dto';
import { UpdateOrderService } from './services/update-order.service';

@Component({
    selector: 'app-update-order',
    standalone: true,
    imports: [
        CoreModule,
        MaterialFormModule,
        MaterialTableModule,
        MatDialogModule,
        DragDropModule,
    ],
    templateUrl: './update-order.component.html',
    styleUrl: './update-order.component.css'
})
export class UpdateOrderComponent {
    orderForm!: FormGroup;
    dataSource = new MatTableDataSource<any>();
    displayedColumns: string[] = [
        'comment',
        'action'
    ];
    sendMessagedto!: SendTemplateDTO;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: OrderDTO,
        private formBuilder: FormBuilder,
        private updateOrderService: UpdateOrderService
    ) { 
        // console.log('injection?',this.data);
        this.createFormControls();
    }

    createFormControls() {
        this.orderForm = this.formBuilder.group({
            comment: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            phoneNumber: new FormControl('', [Validators.required, Validators.maxLength(15)]),
        });
    }
    sendComment() { 
        if (this.orderForm.valid) {
            const comment = this.orderForm.get('comment')?.value;
            const number = this.orderForm.get('phoneNumber')?.value;
            console.log('number to send:', number);
            this.sendMessagedto = {
                ToPhoneE164: number,
                TemplateName: 'hello_world',
                LanguageCode: 'en_US'
            }
            
            this.updateOrderService.sendMessage(this.sendMessagedto).subscribe({
                next: (response) => {
                    console.log('Message sent successfully', response);
                }
            });
        }
    }
}
