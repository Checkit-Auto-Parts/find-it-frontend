// Development server for SSR with Express and Angular Universal
// import { app as serverEn } from './server/en/server.mjs';
// import { app as serverEs } from './server/es/server.mjs';

// Production server for SSR with Express and Angular Universal
import { app as serverEn } from './dist/angular-ssr/server/en/server.mjs';
import { app as serverEs } from './dist/angular-ssr/server/es/server.mjs';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Utilidades para ruta absoluta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Directorios de archivos estáticos para cada idioma
// Development directories
// const browserEs = path.join(__dirname, '../browser/es');
// const browserEn = path.join(__dirname, '../browser/en');

// Production directories

const browserEn = path.join(__dirname, 'dist/angular-ssr/browser/en');
const browserEs = path.join(__dirname, 'dist/angular-ssr/browser/es');

function run() {
	const port = process.env.PORT || 4000;
	const server = express();

	// ✅ Sirve los archivos estáticos primero
	server.use('/es', express.static(browserEs, { maxAge: '1y' }));
	server.use('/en', express.static(browserEn, { maxAge: '1y' }));

	// ✅ Redirección desde / a /en o /es según el navegador
	server.get('/', (req, res) => {
		const acceptLang = req.headers['accept-language'] || '';
		const lang = acceptLang.toLowerCase().startsWith('es') ? 'es' : 'en';
		res.redirect(302, `/${lang}`);
	});

	// ✅ SSR apps por idioma (se monta después de servir estáticos)
	server.use('/es', serverEs());
	server.use('/en', serverEn());

	server.listen(port, () => {
		console.log(`✅ SSR server listening on http://localhost:${port}`);
	});
}

run();
