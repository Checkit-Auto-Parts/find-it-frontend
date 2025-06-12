
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join, resolve } from 'node:path';
import bootstrap from './main.server';
import { InjectionToken, LOCALE_ID } from '@angular/core';
import { REQUEST, RESPONSE } from './express.tokens'
import cookie from 'cookie';

export const IS_AUTHENTICATED = new InjectionToken<boolean>('IS_AUTHENTICATED');

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
		// 🔥 Parseamos las cookies del request
		const cookies = cookie.parse(req.headers.cookie || '');
		const token = cookies['token'];

		// 🔒 Validamos si el usuario tiene token válido
		let isAuthenticated = false;

		if (token) {
			try {
				// Opcionalmente podrías verificar el token con tu clave secreta (si la tienes)
				// const decoded = jwt.verify(token, 'your-secret-key');
				isAuthenticated = true;
			} catch (err) {
				console.warn('Invalid token detected during SSR', err);
				isAuthenticated = false;
			}
		}
		commonEngine
			.render({
				bootstrap,
				documentFilePath: indexHtml,
				url: `${protocol}://${headers.host}${originalUrl}`,
				publicPath: resolve(serverDistFolder, `../../browser/`), // publicPath does not need to concatenate the language.
				providers: [
					{ provide: APP_BASE_HREF, useValue: langPath },
					{ provide: LOCALE_ID, useValue: lang },
					{ provide: RESPONSE, useValue: res },
					{ provide: REQUEST, useValue: req },
					{ provide: IS_AUTHENTICATED, useValue: isAuthenticated } // 👈 ESTA ES LA CLAVE
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
