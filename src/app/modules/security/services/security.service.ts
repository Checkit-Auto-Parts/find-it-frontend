import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { LocalStorageService } from './local-storage.service';
import { LocalStorageKeysService } from './local-storage-keys.service';
import { CryptoService } from './crypto.service';
import { environment } from '../../../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginResponseDTO } from './../models/user-login-response.dto';
import { UserLoginDto } from './../models/user-login.dto';
import { PhoneTypeDto, UserRegisterDTO } from '../models/user-register.dto';
import { RegisterResponseDto } from '../models/user-register-response.dto';
import { ChangePasswordDTO, ResetPasswordDTO } from '../models/user.reset-password.dto';
import { StateExecution } from '../../../core/models/normalized/stateExecution.model';
// import { MsalService } from '@azure/msal-angular';

@Injectable({
	providedIn: 'root',
})
export class SecurityService {
	private token: string | null = null;
	private endPoint = environment.apiUrl + 'Auth';
	private currentUserSource = new BehaviorSubject<LoginResponseDTO | null>(null);
	jwtHelper = new JwtHelperService();
	currentUser$ = this.currentUserSource.asObservable();

	private _authSub$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

	get isAuthenticated$(): Observable<boolean> {
		return this._authSub$.asObservable();
	}

	constructor(
		private http: HttpClient,
		private router: Router,
		private localStorageService: LocalStorageService,
		private keysService: LocalStorageKeysService,
		private cryptoService: CryptoService
		// private msalService:MsalService

	) {
		//?luis comente esto por que me botaba error 'window not exists'
		// window.addEventListener('storage', this.handleStorageEvent.bind(this));
	}

	login(data: UserLoginDto) {
		return this.http.post<StateExecution<LoginResponseDTO>>(this.endPoint + '/login', data);
	}

	registerUser(data: UserRegisterDTO): Observable<RegisterResponseDto> {
		return this.http.post<RegisterResponseDto>(
			`${this.endPoint}/register`,
			data
		);
	}

	authenticated(): boolean {
		if (!this.token) {
			return false;
		}

		if (this.jwtHelper.isTokenExpired(this.token)) {
			this.logout();
			return false;
		}
		return true;
	}

	logout() {
		this.router.navigate(['/login']).then(() => {
			//!IMPORTANTE: revisitar y replantear esta forma de setear si esta logeado o no
			this._authSub$.next(false);
			this.token = null;
			localStorage.removeItem('user');
			localStorage.removeItem('token');
			localStorage.removeItem('operatorId');
			localStorage.removeItem(this.keysService.USER_PERMISSIONS);
			this.localStorageService.set('logout', Date.now().toString());
			// this.msalService.instance.initialize();
			// let accExist = this.msalService.instance.getAllAccounts().length > 0;
			// if (accExist) {
			//   this.logoutMsal();
			// }
			window.location.reload();
		});
	}

	setCurrentUser(user: any) {
		// user.roles = [];
		this.token = user.token;
		// const roleEnum = Number.parseInt(this.getDecodedToken(user.token).RoleEnum);
		// const roleType = Number.parseInt(this.getDecodedToken(user.token).RoleType);
		// const roles = this.getDecodedToken(user.token).role;
		// Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);

		this.localStorageService.set(this.keysService.USER_KEY, { ...user });
		this.localStorageService.set(this.keysService.USER_PERMISSIONS, user.permissions);
		// localStorage.setItem(
		//   'user',
		//   JSON.stringify({ ...user, roleEnum: roleEnum, roleType: roleType })
		// );
		//!IMPORTANTE: revisitar y replantear esta forma de setear si esta logeado o no
		this._authSub$.next(true);
		this.currentUserSource.next({
			...user
		});
	}

	setLogged(isLogged: boolean) {
		this._authSub$.next(isLogged);
	}

	getCurrentUser() {
		return this.currentUserSource.getValue();
	}

	getDecodedToken(token: string) {
		return JSON.parse(atob(token.split('.')[1]));
	}

	saveToken(loginResponse: LoginResponseDTO) {
		this.localStorageService.set(this.keysService.TOKEN_KEY, loginResponse.token);
		this.localStorageService.set(this.keysService.USER_KEY, loginResponse);
	}
	setTemporalToken(token: string) {
		this.localStorageService.set(this.keysService.TOKEN_KEY, token);
	}

	// getRoles(): Observable<RolesDTO> {
	//   return this.http.get<RolesDTO>(`${this.endPoint}/getRoles`);
	// }

	getPhoneType(): Observable<PhoneTypeDto> {
		return this.http.get<PhoneTypeDto>(`${this.endPoint}/getPhoneType`);
	}


	requestResetPassword(requestDTO: ResetPasswordDTO): Observable<StateExecution<null>> {
		return this.http.post<any>(`${this.endPoint}/ResetPassword`, requestDTO);
	}

	verifyRequestRestartPassword(tokenTemporal: string): Observable<StateExecution<null>> {

		const token = this.localStorageService.get(this.keysService.TOKEN_KEY);

		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token}`
		});

		const requestDTO: ResetPasswordDTO = {
			id: this.getDecodedToken(tokenTemporal).UserId,
			code: this.getDecodedToken(tokenTemporal).RestartCode
		}
		return this.http.post<any>(`${this.endPoint}/VerifyRequestRestartPassword`, requestDTO, { headers });
	}
	updateUserPassword(tokenTemporal: string, changePasswordDto: ChangePasswordDTO): Observable<StateExecution<null>> {

		const token = this.localStorageService.get(this.keysService.TOKEN_KEY);

		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token}`
		});

		const requestDTO: ChangePasswordDTO = {
			userId: this.getDecodedToken(tokenTemporal).UserId,
			password: this.cryptoService.encryptUsingAES256(changePasswordDto.password),
			confirmPassword: this.cryptoService.encryptUsingAES256(changePasswordDto.confirmPassword)
		}
		return this.http.put<any>(`${this.endPoint}/UpdateUserPassword`, requestDTO, { headers });
	}

	private handleStorageEvent(event: StorageEvent) {
		if (event.key === 'logout') {
			this.logout();
		}
	}

	//MSAL
	loginMsal() {
		// this.msalService.loginRedirect();
	}

	logoutMsal() {
		// this.msalService.logout();
	}

	loginAD(data: UserLoginDto) {
		return this.http.post<LoginResponseDTO>(this.endPoint + '/loginAD', data).pipe(
			map((response: LoginResponseDTO) => {
				const user = response;
				if (user) {
					this.saveToken(response);
					this.setCurrentUser(user);
				}
			})
		);
	}
}
