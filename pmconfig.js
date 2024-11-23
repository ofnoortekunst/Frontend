module.exports = {
  apps: [
    {
      name: 'noortekunst-dev', // App name
      script: 'node_modules/.bin/next', // Path to the Next.js binary
      args: 'start', // Run in "start" mode for production
      cwd: './', // Current working directory
      exec_mode: 'cluster', // Run multiple instances
      instances: 'max', // Max number of instances based on CPU cores
      env: {
        NODE_ENV: 'development', // Set environment to development
      },
    },
  ],
};