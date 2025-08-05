import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class LangRouterService {

	constructor(private router: Router) { }

	navigate(commands: string[]) {
		const lang = this.router.url.split('/')[1];
		console.log('Current language:', lang);
		console.log('Navigating with commands:', commands);
		this.router.navigate([`/${lang}`, ...commands]);
	}
}
