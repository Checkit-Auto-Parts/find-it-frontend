import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SecurityService } from './modules/security/services/security.service';
import { LocalStorageKeysService } from './modules/security/services/local-storage-keys.service';
import { LocalStorageService } from './modules/security/services/local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { LoginResponseDTO } from './modules/security/models/user-login-response.dto';
import { CoreModule } from './core/modules/core.module';
import { MaterialNavbarModule } from './core/modules/material-navbar.module';
import { MatInputModule } from "@angular/material/input";
import { MaterialFormModule } from "./core/modules/material-form.module";
import { BreadcrumbsComponent } from "./core/components/breadcrumbs/breadcrumbs.component";

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, CoreModule, MaterialNavbarModule, MatInputModule, MaterialFormModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'Find it all';

	constructor(
		private securityService: SecurityService,
		private keysService: LocalStorageKeysService,
		private localStorageService: LocalStorageService,
		@Inject(PLATFORM_ID) private platformId: Object
	) { }

	async ngOnInit() {

		this.setCurrentUser();

		if (isPlatformBrowser(this.platformId)) {
			// Now it's safe to access `window`, `document`, etc.
		}
	}

	setCurrentUser() {
		const user = this.localStorageService.get<LoginResponseDTO>(this.keysService.USER_KEY);
		if (!user) return;
		this.securityService.setCurrentUser(user);
	}
}
