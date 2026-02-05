import { Component, Inject, inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialFormModule } from '../../../../core/modules/material-form.module';
import { CoreModule } from '../../../../core/modules/core.module';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { SecurityService } from '../../services/security.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageKeysService } from '../../services/local-storage-keys.service';
import { DialogMessageService } from '../../../../core/services/dialog-message.service';
import { LoginResponseDTO } from '../../models/user-login-response.dto';
import { Meta, Title } from '@angular/platform-browser';
import { StateExecution } from '../../../../core/models/normalized/stateExecution.model';
import { LangRouterService } from '../../../../core/services/lang-router.service';
import { FooterComponent } from '../../../../core/components/footer/footer.component';
@Component({
	selector: 'app-login',
	imports: [
		CoreModule,
		ReactiveFormsModule,
		MaterialFormModule,
		MatCardModule,
		FooterComponent
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
	standalone: true
})
export class LoginComponent {
	formLogin: FormGroup;
	public loginValid = false;
	public username = '';
	public password = '';
	tokenExpiration: string = '';
	private titleService = inject(Title);
	private metaService = inject(Meta);


	private readonly _destroying$ = new Subject<void>();

	private router = inject(Router);

	public currentLang = this.detectLangFromUrl();

	detectLangFromUrl(): 'en' | 'es' {
		const url = this.router.url; // ✅ esto sí funciona tanto en SSR como CSR
		if (url.startsWith('/es')) return 'es';
		if (url.startsWith('/en')) return 'en';
		return 'es'; // fallback por defecto
	}

	constructor(

		private authService: SecurityService,
		private formBuilder: FormBuilder,
		private dialogMessageService: DialogMessageService,
		private localStorageService: LocalStorageService,
		private keysService: LocalStorageKeysService,
		@Inject(LOCALE_ID) private locale: string,
		private langRouter: LangRouterService
		// private msalBroadcastService: MsalBroadcastService,
		// private authMService: MsalService,
	) {
		this.formLogin = this.formBuilder.group({
			userName: ['admin@findit-store.com', [Validators.required]],
			password: ['', [Validators.required]],
		});
	}
	async ngOnInit() {
		// debugger;
		const isSpanish = this.locale === 'es';
		this.currentLang = isSpanish ? 'es' : 'en';
		this.titleService.setTitle(
			isSpanish ? 'Iniciar sesión | Find It' : 'Login | Find It'
		);

		// let localstorage : string = "";
		// localstorage = this.localStorageService.get(this.keysService.PREFERRED_LANG);
		if ((this.currentLang  === 'es' || this.currentLang  === 'en')) {
			// localStorage.setItem('preferredLang', this.currentLang );
			this.localStorageService.set(this.keysService.PREFERRED_LANG, this.currentLang );
		}

		this.metaService.updateTag({
			name: 'description',
			content: isSpanish
				? 'Página de inicio de sesión segura de Find It.'
				: 'Secure login page for Find It.',
		});

		var tokeActive = this.localStorageService.get(this.keysService.TOKEN_KEY);
		if (tokeActive) {
			this.router.navigate(['/app/dashboard']);
		} else {
			// this.handleMS()
		}
	}
	public onSubmit(): void {
		if (this.formLogin.valid) {
			this.authService.login(this.formLogin.value).subscribe({
				next: (n) => this.verification(n),
				error: (e) => this.loginFailed(e),
			});
		} else {
			this.dialogMessageService.showErrorDialog("Complete los campos requeridos.");
		}
	}

	verification(response: StateExecution<LoginResponseDTO>) {
		console.log('response => ', response.data?.result.succeeded);
		if (response != null) {
			if (!response.data?.result.succeeded) {
				this.dialogMessageService.showErrorDialog('Autenticación fallida, revise sus credenciales.');
			} else {
				this.loginValid = true;
				this.authService.saveToken(response.data);
				// this.setCurrentUser();
				this.authService.setCurrentUser(response.data);
				this.redirectByType();
			}
		} else {
			this.dialogMessageService.showErrorDialog('No se encontró el usuario especificado.');
		}
	}

	redirectByType() {
		const redirectUrl = this.localStorageService.get(this.keysService.URL_REDIRECT);
		if (redirectUrl) {
			this.router.navigateByUrl(redirectUrl.toString());
		} else {
			// this.router.navigate(['/app/dashboard']);
			this.langRouter.navigate(['app', 'dashboard']);
		}
	}

	loginFailed(e: any) {
		this.dialogMessageService.showErrorDialog(
			`Por favor reintente mas tarde ${e.error.message.description}`
		);
	}
	setCurrentUser() {
		const userString = this.localStorageService.get<any>(this.keysService.USER_KEY);
		if (!userString) return;
		this.authService.setCurrentUser(userString);
	}
	coppiarDatos(value: any) {
		this.formLogin.controls['userName'].setValue(value.mail);
		this.formLogin.controls['password'].setValue(value.pass);
	}
	
	setLoginDisplay() {
		// let accounts = this.authMService.instance.getAllAccounts();
		// let loginDisplay = accounts.length > 0;
		// if (loginDisplay) {
		// 	let user = accounts[0];
		// 	let userDtoMS = new UserLoginDto();
		// 	userDtoMS.userName = user.username;
		// 	userDtoMS.fullName = user.name!;
		// 	userDtoMS.password = 'microsoft';
		// 	this.authService.loginAD(userDtoMS).subscribe({
		// 		error: (e) => console.error('error => ', e),
		// 		complete: () => this.onComplete(),
		// 	});
		// }
	}

	onComplete() {
		this.loginValid = false;
		this.router.navigate(['/app/dashboard']);
	}

	onLangChange(event: any) {
		// debugger;
		// Cambia el idioma de la aplicación según la selección del usuario
		
		// const lang = (event.value as HTMLSelectElement).value as 'en' | 'es';
		const lang = event.value;
		const currentUrl = this.router.url;
		const newPath = currentUrl.replace(/^\/(en|es)/, '');
		const newLangUrl = `/${lang}${newPath || '/'}`; 
		console.log('newLangUrl', newLangUrl);
		// this.router.resul; // Recarga la aplicación para aplicar el nuevo idioma
		this.router.navigateByUrl(newLangUrl).then((s) => {
			
			// Actualiza el idioma preferido en el localStorage
			// debugger;
			this.localStorageService.set(this.keysService.PREFERRED_LANG, lang);
			window.location.href = newLangUrl;
		});
	}
}
