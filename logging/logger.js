const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = () => {
  process.on('uncaughtException', err => {
    logger.error(err.message);
    console.log(err);
  })

  process.on('unhandledRejection', (err) => {
    logger.error(err.message);
    console.log(err);
  })
}
