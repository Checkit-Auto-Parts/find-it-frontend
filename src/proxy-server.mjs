
import { app as serverEn } from './server/en/server.mjs';
import { app as serverEs } from './server/es/server.mjs';

const express = require('express');

function run() {
	const port = process.env.PORT || 4000;
	const server = express();

	// ✅ Redirección desde / a /en o /es según Accept-Language
	server.get('/', (req, res) => {
		const acceptLang = req.headers['accept-language'] || '';
		const lang = acceptLang.toLowerCase().startsWith('es') ? 'es' : 'en';
		res.redirect(302, `/${lang}`);
	});

	server.use('/es', serverEs());
	server.use('/en', serverEn());
	server.listen(port, () => {
		console.log(`Node Express server listening on http://localhost:${port}`);
	});
}

run();
