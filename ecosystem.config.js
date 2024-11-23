module.exports = {
  apps: [
    {
      name: 'noortekunst-dev', // App name
      script: 'node_modules/next/dist/bin/next', // Path to the Next.js binary
      args: 'run dev', // Run in "start" mode for production
      cwd: '/data02/virt133817/website', // Current working directory
      watch: true,
      env: {
        NODE_ENV: 'development', // Set environment to development
      },
    },
  ],
};