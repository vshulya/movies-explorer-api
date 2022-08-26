class ServerError extends Error {
  constructor(message = 'Server Error') {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = ServerError;
