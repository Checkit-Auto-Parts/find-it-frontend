import { Routes } from '@angular/router';
import { LoginComponent } from './modules/security/components/login/login.component';

export const routes: Routes = [
    {
        path: 'login',
        title: 'Login - Find it all',
        component: LoginComponent,
    },
    {
        path: '',
        title: 'Login - Find it all',
        component: LoginComponent,
    }    
];
