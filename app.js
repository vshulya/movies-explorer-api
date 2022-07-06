require('dotenv').config();
const mongoose = require('mongoose');

const express = require('express');
const { errors } = require('celebrate');

const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();
app.use(express.json());

mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});

app.use(cors);

// request logger must be connected before all route handlers
app.use(requestLogger);

app.use('/', require('./routes'));

// error logger connect after the route handlers and before the error handlers
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(process.env.MONGO_URL);
});
