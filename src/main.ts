/// <reference types="@angular/localize" />
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
	.then(() => {
		// 🔥 Elimina el atributo ng-version después del arranque
		const appRoot = document.querySelector('[ng-version]');
		if (appRoot) {
			appRoot.removeAttribute('ng-version');
		}
	})
	.catch((err) => console.error(err));
