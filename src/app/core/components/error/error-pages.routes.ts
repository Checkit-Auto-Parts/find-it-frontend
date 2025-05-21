import { Routes } from '@angular/router';

export const errorPagesRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'not-found'
    },
    {
        path: 'not-found',
        title: 'Page not found',
        loadComponent: () => import('./not-found/not-found.component').then((c) => c.NotFoundComponent)
    },
    {
        path: 'internal-error',
        title: 'internal error',
        loadComponent: () => import('./internal-error/internal-error.component').then((c) => c.InternalErrorComponent)
    },
];
