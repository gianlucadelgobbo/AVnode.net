//pm2 deploy ecosystem.config.js production setup
export default {
  apps : [{
    name: "avnode.net",
    interpreter: "/home/hyo/.nvm/versions/node/v23.8.0/bin/",
    max_memory_restart: "4G",
    script: "index.js",
    log_file: "/sites/logs/node_admin_avnode_net-2025-combined.log",
    out_file: "/sites/logs/node_admin_avnode_net-2025-out.log",
    error_file: "/sites/logs/node_admin_avnode_net-2025-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "node_modules",
      "locales"
    ],
    "args": "",
    time: true,
    instances: 1,
    exec_mode: "cluster",
    autorestart: true,
    watch: true,
    watch_options: {
      followSymlinks: false
    },
    env: {
      NODE_ENV: "production",
      DEBUG: "false",
    }
  }]
}