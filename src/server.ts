import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join, resolve } from 'node:path';
import bootstrap from './main.server';
import { LOCALE_ID } from '@angular/core';
import { REQUEST, RESPONSE } from './express.tokens'
import * as cookie from 'cookie';
import { jwtDecode } from "jwt-decode";
import { USER_TOKEN } from './app/tokens/user-token';

// export const IS_AUTHENTICATED = new InjectionToken<boolean>('IS_AUTHENTICATED');

export function app(): express.Express {
	const server = express();
	const serverDistFolder = dirname(fileURLToPath(import.meta.url));
	/**
	 * Get the language from the corresponding folder
	 */
	const lang = basename(serverDistFolder);
	/**
	 * Set the route for static content and APP_BASE_HREF
	 */
	const langPath = `/${lang}/`;
	// console.log(`Setting up server for language: ${lang} with base path: ${langPath}`);
	/**
	 * Note that the 'browser' folder is located two directories above 'server/{lang}/'
	 */
	const browserDistFolder = resolve(serverDistFolder, `../../browser/${lang}`);
	const indexHtml = join(serverDistFolder, 'index.server.html');

	const commonEngine = new CommonEngine();

	server.set('view engine', 'html');
	server.set('views', browserDistFolder);

	// Example Express Rest API endpoints
	// server.get('/api/**', (req, res) => { });
	// Serve static files from /browser
	// Complete the route for static content by concatenating the language.
	server.use(
		express.static(browserDistFolder, {
			maxAge: '1y',
		})
	);

	// All regular routes use the Angular engine
	server.get('*', (req, res, next) => {
		
		const { protocol, originalUrl, headers } = req;
		try {
			const cookies = cookie.parse(req.headers.cookie || '');
			const token = cookies['token'];

			if (token && isProbablyJWT(token)) {
				try {
					const decoded = jwtDecode(token);
					(req as any).user = decoded;
				} catch (err) {
					// console.warn('Token presente pero inválido:', err);
					(req as any).user = null;
				}
			} else {
				// console.log('!token && isProbablyJWT(token)', req.headers.cookie);
				(req as any).user = null;
			}
		} catch (error) {
			console.error('Error al parsear cookies:', error);
			(req as any).user = null;
		}
		// console.log('User from request:', (req as any).user);
		commonEngine
			.render({
				bootstrap,
				documentFilePath: indexHtml,
				url: `${protocol}://${headers.host}${originalUrl}`,
				publicPath: resolve(serverDistFolder, `../../browser/${lang}`), // publicPath does not need to concatenate the language.
				providers: [
					{ provide: APP_BASE_HREF, useValue: langPath },
					{ provide: LOCALE_ID, useValue: lang },
					{ provide: RESPONSE, useValue: res },
					{ provide: REQUEST, useValue: req },
					{ provide: USER_TOKEN, useValue: (req as any).user ?? null },
				],
			})
			.then((html: string) => {
				html = html.replace(/ng-version="[^"]*"/g, ''); // Remueve el atributo ng-version
				res.send(html);
			})
			.catch((err: any) => next(err));
	});

	return server;
}

// Función auxiliar: verifica si la cadena parece un JWT (3 partes separadas por '.')
function isProbablyJWT(token: string): boolean {
	return typeof token === 'string' && token.split('.').length === 3;
}

/**
 * This function is no longer necessary, as the server will be run from the proxy
 */
// function run(): void {
//   const port = process.env['PORT'] || 4000;

//   // Start up the Node server
//   const server = app();
//   server.listen(port, () => {
//     console.log(`Node Express server listening on http://localhost:${port}`);
//   });
// }

// run();
