import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import db from './api/config/db.js';
import { notFound, errorHandler } from './api/middleware/errorMiddleware.js';
import cors from 'cors';
import colors from 'colors';

import authUserRoutes from './api/routes/authUserRoutes.js';
import organisationRoutes from './api/routes/organisationRoutes.js';

dotenv.config();

db.connectDb();

const app = express();

var corsOptions = {
  origin: ['*'],
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  httpOnly: true,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Kadosh API is running');
});

app.use('/api/auth', authUserRoutes);
app.use('/api/org', organisationRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 6000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`.yellow);
});
