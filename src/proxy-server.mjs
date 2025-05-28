
import {app as serverEn} from './server/en/server.mjs';
import {app as serverEs} from './server/es/server.mjs';

const express = require('express');

function run() {
  const port = process.env.PORT || 4000;
  const server = express();
  server.use('/es', serverEs());
  server.use('/en', serverEn());
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}/es`);
  });
}

run();
