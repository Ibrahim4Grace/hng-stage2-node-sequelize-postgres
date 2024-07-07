import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { connectDb, sequelize } from './config/db.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import https from 'https';
import cron from 'node-cron';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(morgan('tiny'));
app.disable('x-powered-by');

function keepAlive() {
  https
    .get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
    })
    .on('error', (error) => {
      console.error(`Error: ${error.message}`);
    });
}

cron.schedule('*/5 * * * *', () => {
  keepAlive('https://hng-stage2-xof6.onrender.com');
  console.log('pinging the server every minute');
});

// Use routes defined in the routes module
app.get('/', (req, res) => {
  res.send('Hello HNG internship');
});
app.use(routes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.POSTGRES_PORT || 6000;

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`.yellow);
  });
});
connectDb();
export default app;
