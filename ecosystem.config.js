module.exports = {
    apps: [{
      name: 'your.bot',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production'
      }
    }]
  }