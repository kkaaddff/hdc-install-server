module.exports = {
  apps: [
    {
      name: 'hdc-install-server',
      script: './bootstrap.js',
      env: {
        NODE_ENV: 'production',
        PORT: 7001,
      },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '200M',
      watch: false,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/pm2/error.log',
      out_file: 'logs/pm2/out.log',
      autorestart: true,
      restart_delay: 3000,
    },
  ],
}
