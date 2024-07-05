import {format, createLogger, transports} from'winston';
const {timestamp, combine, errors, json} = format;

function buildProLogger () {
      
    return createLogger({
      level: 'debug',
        format: combine(
          timestamp(), 
          errors({stack: true}),
          json()
        ), 
        defaultMeta: { service: 'user-service' },
        transports: [
          new transports.File({
              level: 'warn',
              filename: 'logger/logsWarnings.log'
          }),
          new transports.File({
              level: 'error',
              filename: 'logger/logsErrors.log'
          })
      ],
    });
}



export default buildProLogger;


