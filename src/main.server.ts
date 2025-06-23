import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRouting } from '@angular/ssr';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { serverRoutes } from './app/app.config.server';

export default () =>
    bootstrapApplication(AppComponent, {
        ...config,
        providers: [
            ...(config.providers ?? []),
            provideServerRouting(serverRoutes),
        ],
    });
