const http = require('http');
import * as app from './app';

const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port);