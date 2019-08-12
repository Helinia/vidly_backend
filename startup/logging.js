const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
module.exports = function(){
    //event is raised when we have an exception that is not caught in the node express
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrinte: true})
        new winston.transports.File({filename: 'uncaughtExceptions.log'})
    );
    // process.on('uncaughtException', ex =>{
    //     console.log('WE GOT AN UNCAUGHT EXCEPTION');
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });
    process.on('unhandledRejection', ex =>{
        // console.log('WE GOT AN UNHANDLED PROMISE REJECTION');
        // winston.error(ex.message, ex);
        // process.exit(1);
        throw ex;
    });



    //adding error logging transport to file
    winston.add(winston.transports.File,{ filename: 'logfile.log'});
    winston.add(winston.transports.MongoDB, {
        db: 'mongodb://localhost/vidly', 
        level: 'info'
    });


    
}