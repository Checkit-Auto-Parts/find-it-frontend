import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{ path: '', renderMode: RenderMode.Server },
	{ path: 'es/**', renderMode: RenderMode.Server },
	{ path: '**', renderMode: RenderMode.Server },
];

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch())
  ],
  
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
