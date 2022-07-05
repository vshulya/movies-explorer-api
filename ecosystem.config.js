module.exports = {
  apps: [
    {
      name: 'app',
      exec_mode: 'cluster',
      instances: '1',
      script: './app.js', // your script
      args: 'start',
      env: {
        PORT: 3000,
        MONGO_URL: 'mongodb://localhost:27017',
      },
    },
  ],
};
