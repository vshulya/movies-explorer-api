const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const allowedCors = [
  'https://moviesexplorer.nomoredomains.sbs',
  'https://api.my-movies-explorer.nomoredomains.xyz',
  'http://moviesexplorer.nomoredomains.sbs',
  'http://api.my-movies-explorer.nomoredomains.xyz',
  'http://localhost:3000',
  'http://140.82.42.116/',
  'http://140.82.42.116/movies-explorer',
];

module.exports = (req, res, next) => {
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};
