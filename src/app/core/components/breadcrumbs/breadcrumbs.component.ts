// src/app/core/components/breadcrumbs/breadcrumbs.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs/operators';
import { Breadcrumb, BreadcrumbsService } from '../../services/breadcrumb.service';

type BreadcrumbVm = {
    crumbs: Breadcrumb[];
    homeUrl: any[];
    homeTitle: string;
};

@Component({
    selector: 'app-breadcrumbs',
    standalone: true,
    imports: [CommonModule, RouterLink, MatIconModule],
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
    vm$ = this.breadcrumbsService.breadcrumbs$.pipe(

        map((crumbs) => {
            console.log('Breadcrumbs updated:', crumbs);
            const lang = this.breadcrumbsService.getCurrentLang() ?? 'en';
            return {
                crumbs,
                homeUrl: ['/', lang, 'app', 'dashboard'],
                homeTitle: lang === 'es' ? 'Inicio' : 'Home',
            } as BreadcrumbVm;
        })
    );

    constructor(private breadcrumbsService: BreadcrumbsService) { }
}
