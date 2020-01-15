module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'db'
    },
    binary: {
      version: '4.0.3',
      skipMD5: true
    },
    autoStart: false
  }
};