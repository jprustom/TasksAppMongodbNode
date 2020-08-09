const http = require('http');
import {app} from './app'
require('./dbs/mongoose')

const port = process.env.PORT || process.env.PORT;

export const server = http.createServer(app);
server.listen(port);

