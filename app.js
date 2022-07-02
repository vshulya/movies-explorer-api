require('dotenv').config();

const express = require('express');
const { errors } = require('celebrate');

const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
// const { PORT = 3000, MONGOBASE = '..' } = process.env;

const app = express();
app.use(express.json());
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
});
