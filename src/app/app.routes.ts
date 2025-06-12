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
        path: 'login',
        title: 'Login - Find it all',
        component: LoginComponent,
    },
    {
        path: '',
        title: 'Login - Find it all',
        component: LoginComponent,
    },
    {
        path: 'redirect/:url',
        title: 'redirect',
        component: RedirectComponent,
    },
    {
        path: 'app',
        title: 'Find it all',
        // pathMatch: 'full',
        component: SideBarComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                // canActivate: [internalRoleGuard],
                loadComponent: () => import('./modules/dashboard/dashboard-main/dashboard-main.component').then((c) => c.DashboardMainComponent)
            },
            {
                path: 'Brand',
                // canActivate: [internalRoleGuard],
                loadComponent: () => import('./modules/brand/brand.component').then((c) => c.BrandComponent)
            },
        ]
    },  
    {
        path: 'error',
        component: PagesNavBarComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./core/components/error/error-pages.routes').then((r) => r.errorPagesRoutes),
            },
        ]
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'error'
    }, 
];
