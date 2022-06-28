const express = require('express');
const mongoose = require('mongoose');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use('/', (_req, res) => {
  res.status(200).send('It works')
});

app.use(express.json());
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
