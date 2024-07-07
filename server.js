import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import colors from 'colors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { connectDb, sequelize } from './config/db.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import corsOptions from './config/corsOptions.js';

const app = express();

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(morgan('tiny'));
app.disable('x-powered-by');

// Use routes defined in the routes module
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
