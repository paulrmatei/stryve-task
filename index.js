import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import router from './routes/books.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to mongodb

// connect to testdb if in a test environment
const mongoDatabase =
  process.env.NODE_ENV === 'test' ? 'testdb' : 'stryve-task';

const url = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${mongoDatabase}`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('Connected to database');
});

app.use('/', router);

export default app;
