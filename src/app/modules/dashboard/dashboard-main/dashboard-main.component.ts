import { Component, Inject, Optional } from '@angular/core';
import { USER_TOKEN } from '../../../tokens/user-token';

@Component({
    selector: 'app-dashboard-main',
    standalone: true,
    imports: [],
    templateUrl: './dashboard-main.component.html',
    styleUrl: './dashboard-main.component.css'
})
export class DashboardMainComponent {
    constructor(@Inject(USER_TOKEN) @Optional() private user: any) {
        console.log('[SSR USER_TOKEN]', this.user);
    }

}
