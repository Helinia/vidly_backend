const express = require('express');
const app = express();
const winston = require('winston');
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);
//throw new Error('Something failed during startup.');

const port = process.env.port || 3000;

const server = app.listen(port, () =>{
    winston.info(`listening on port ${port}...`);
});

module.exports = server;