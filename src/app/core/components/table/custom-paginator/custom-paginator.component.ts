import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomPaginatorConfig } from '../../../models/other/custom-paginator-config.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../../modules/core.module';
import { MaterialFormModule } from '../../../modules/material-form.module';
import { RoundNumberPipe } from '../../../pipes/round-number.pipe';

@Component({
	selector: 'app-custom-paginator',
	standalone: true,
	imports: [
		CoreModule,
		MaterialFormModule,
		ReactiveFormsModule,
		RoundNumberPipe
	],
	templateUrl: './custom-paginator.component.html',
	styleUrl: './custom-paginator.component.css'
})
export class CustomPaginatorComponent implements OnInit {
	@Input() totalRecords: number = 0;
	@Input() currentPage: number = 0;
	@Input() rowsPerPageList: number[] = [];
	@Input() rowsPerPage: number = 0;

	@Output() fetchList: EventEmitter<CustomPaginatorConfig> = new EventEmitter<CustomPaginatorConfig>();
	@Output() changeRowsNumber: EventEmitter<number> = new EventEmitter<number>();

	formGroupPaginator!: FormGroup;

	constructor(private _formBuilder: FormBuilder) { }

	ngOnInit(): void {
		this.formGroupPaginator = this._formBuilder.group({
			rowsPerPageCtrl: [this.rowsPerPage],
		});
	}

	get rowsPerPageCtrl() {
		return this.formGroupPaginator.get('rowsPerPageCtrl');
	}

	selectRowsNumber(numero: number) {
		this.changeRowsNumber.emit(numero);
	}
	goToPreviousPage() {
		if (this.currentPage > 0) {
			this.currentPage--;

			this.fetchList.emit({
				recargar: true,
				currentPage: this.currentPage,
				rowsPerPage: this.rowsPerPage,
			});
		}
	}
	goToNextPage() {
		if ((this.currentPage + 1) * this.rowsPerPage < this.totalRecords) {
			this.currentPage++;
			this.fetchList.emit({
				recargar: true,
				currentPage: this.currentPage,
				rowsPerPage: this.rowsPerPage,
			});
		}
	}
}
