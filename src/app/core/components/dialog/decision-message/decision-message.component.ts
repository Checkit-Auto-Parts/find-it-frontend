import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DecisionMessageModel } from './../../../models/other/dialog-message.model';
import { CoreModule } from '../../../modules/core.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-decision-message',
	standalone: true,
	imports: [CoreModule, MatIconModule, MatButtonModule],
	templateUrl: './decision-message.component.html',
	styleUrl: './decision-message.component.css'
})
export class DecisionMessageComponent {

	constructor(
		public dialogRef: MatDialogRef<DecisionMessageComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DecisionMessageModel
	) {
	}

	public accept(): void {
		this.dialogRef.close(true);
	}
	public cancel(): void {
		this.dialogRef.close(false);
	}

	public closeModal() {
		this.dialogRef.close();
	}

}