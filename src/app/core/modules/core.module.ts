import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';

const MODULES = [
	CommonModule,
	NgxSpinnerModule.forRoot({
		type: 'line-scale-party',
	}),
	// TranslateModule.forRoot({
	// 	defaultLanguage: 'es',
	// 	loader: {
	// 		provide: TranslateLoader,
	// 		useFactory: HttpLoaderFactory,
	// 		deps: [HttpClient],
	// 	}
	// }),
];


@NgModule({
	imports: [MODULES],
	exports: [MODULES],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	],
})
export class CoreModule { }
