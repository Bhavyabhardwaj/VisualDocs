// PM2 Ecosystem Configuration for VisualDocs
// Run with: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'visualdocs-api',
      cwd: './server',
      script: 'dist/server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3004
      },
      // Auto-restart on crash
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    }
  ]
};
