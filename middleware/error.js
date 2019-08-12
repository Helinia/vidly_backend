// const { createLogger, transports} = require('winston');

// const logger = createLogger({
//     transports: [
//         new transports.File({ filename: './vidly_info.log', level: 'info'}),
//         new transports.Console()
//     ]
// });

const winston = require('winston');
module.exports = function(err,req,res,next){
    winston.error(err.message, err);
    res.status(500).send('something goes wrong in server..');
}