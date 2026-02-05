import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InfoMessageModel } from '../../../models/other/dialog-message.model';
import { CoreModule } from '../../../modules/core.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop'

@Component({
	selector: 'app-info-message',
	standalone: true,
	imports: [
		CoreModule,
		MatIconModule,
		MatButtonModule,
		DragDropModule,
		MatDialogModule,
	],
	templateUrl: './info-message.component.html',
	styleUrl: './info-message.component.css'
})
export class InfoMessageComponent {

	_title: string = "";

	constructor(
		public dialogRef: MatDialogRef<InfoMessageComponent>,
		@Inject(MAT_DIALOG_DATA) public data: InfoMessageModel
	) {
		this.setData();
	}

	setData() {
		if (this.data.title == undefined) {
			if (this.data.status == true) {
				this._title = "Success";
			} else {
				this._title = "Error";
			}
		} else {
			this._title = this.data.title;
		}
	}

	public aceptar(): void {
		this.dialogRef.close(true);
	}

	public closeDialog() {
		this.dialogRef.close();
	}
}
