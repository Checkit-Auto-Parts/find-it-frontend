// src/app/core/services/breadcrumbs.service.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
    label: string;
    url: string;
}

export type BreadcrumbI18n = { en: string; es: string };
export type BreadcrumbData = string | BreadcrumbI18n | null | undefined;

@Injectable({ providedIn: 'root' })
export class BreadcrumbsService {
    private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
    readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

    // ponlo en true solo para debug
    private readonly debug = false;

    constructor(private router: Router) {
        // ✅ Rebuild INMEDIATO (clave para tu caso)
        this.rebuild();

        // ✅ Rebuild en cada navegación
        this.router.events
            .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
            .subscribe(() => this.rebuild());
    }

    rebuild(): void {
        const root = this.router.routerState.snapshot.root;
        const lang = this.getCurrentLangFromSnapshot(root) ?? 'en';
        const crumbs = this.buildBreadcrumbsFromRoot(root, lang);

        if (this.debug) {
            // eslint-disable-next-line no-console
            console.log('[Breadcrumbs] url=', this.router.url);
            // eslint-disable-next-line no-console
            console.log('[Breadcrumbs] lang=', lang);
            // eslint-disable-next-line no-console
            console.log('[Breadcrumbs] crumbs=', crumbs);
        }

        this._breadcrumbs$.next(crumbs);
    }

    getCurrentLang(): 'en' | 'es' | null {
        const root = this.router.routerState.snapshot.root;
        return this.getCurrentLangFromSnapshot(root);
    }

    private getCurrentLangFromSnapshot(root: ActivatedRouteSnapshot): 'en' | 'es' | null {
        for (const snap of root.pathFromRoot) {
            if (snap.routeConfig?.path === ':lang') {
                const lang = String(snap.params?.['lang'] ?? '').toLowerCase();
                if (lang === 'en' || lang === 'es') return lang;
            }
        }
        return null;
    }

    private buildBreadcrumbsFromRoot(root: ActivatedRouteSnapshot, lang: 'en' | 'es'): Breadcrumb[] {
        const crumbs: Breadcrumb[] = [];
        let current: ActivatedRouteSnapshot | null = root;
        let url = '';

        while (current) {
            const child = this.getPrimaryChild(current);
            if (!child) break;

            const segment = child.url.map(s => s.path).join('/');
            if (segment) url += `/${segment}`;

            const routePath = child.routeConfig?.path;

            // ✅ Importante: usar snapshot.data y fallback a routeConfig.data
            const raw = (child.data?.['breadcrumb'] ??
                child.routeConfig?.data?.['breadcrumb']) as BreadcrumbData;

            const label = this.resolveLabel(raw, lang);

            if (this.debug) {
                // eslint-disable-next-line no-console
                console.log('[BC node]', { routePath, segment, url, raw, label });
            }

            if (!this.shouldIgnoreRoute(routePath) && label) {
                crumbs.push({ label, url: url || '/' });
            }

            current = child;
        }

        return crumbs;
    }

    private getPrimaryChild(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot | null {
        if (!route.children || route.children.length === 0) return null;
        const primary = route.children.find(c => c.outlet === 'primary');
        return primary ?? route.children[0] ?? null;
    }

    private shouldIgnoreRoute(routePath?: string): boolean {
        return (
            !routePath ||
            routePath === '' ||
            routePath === '**' ||
            routePath === ':lang' ||
            routePath === 'app'
        );
    }

    private resolveLabel(data: BreadcrumbData, lang: 'en' | 'es'): string | null {
        if (!data) return null;
        if (typeof data === 'string') return data;
        return data[lang] ?? data.en ?? data.es ?? null;
    }
}
