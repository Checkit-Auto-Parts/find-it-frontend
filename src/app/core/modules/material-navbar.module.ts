import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

const MODULES = [
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
];
@NgModule({
    declarations: [],
    imports: [MODULES],
    exports: [MODULES],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class MaterialNavbarModule { }
