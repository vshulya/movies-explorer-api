const { NODE_ENV, JWT_SECRET, HOST = 'localhost' } = process.env;

const constants = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
  MONGO: `mongodb://${HOST}:27017/moviesdb`,
};

module.exports = constants;
