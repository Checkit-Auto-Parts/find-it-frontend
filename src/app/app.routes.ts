import { BrandComponent } from './modules/brand/brand.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './modules/security/components/login/login.component';
import { SideBarComponent } from './core/components/navbar/side-bar/side-bar.component';
import { authGuard } from './core/guards/auth.guard';
import { internalRoleGuard } from './core/guards/internal-role.guard';
import { PagesNavBarComponent } from './core/components/navbar/pages-nav-bar/pages-nav-bar.component';
import { RedirectComponent } from './modules/security/components/redirect/redirect.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/es/login',
        pathMatch: 'full',
    },
    {
        path: ':lang',
        children: [
            {
                path: '',
                component: LoginComponent,
            },
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: 'app',
                component: SideBarComponent,
                canActivate: [authGuard],
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./modules/dashboard/components/dashboard-main.component').then((m) => m.DashboardMainComponent),
                    },
                ]
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    }
];
