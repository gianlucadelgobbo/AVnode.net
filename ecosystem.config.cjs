module.exports = {
  apps: [
    {
      name: "admin.avnode.net",
      //interpreter: "/home/hyo/.nvm/versions/node/v23.8.0/bin/node",
      script: "/sites/avnode.admin/index.js",
      max_memory_restart: "4G",
      log_file: "/sites/logs/node_admin_avnode_net-2025-combined.log",
      out_file: "/sites/logs/node_admin_avnode_net-2025-out.log",
      error_file: "/sites/logs/node_admin_avnode_net-2025-err.log",
      ignore_watch: ["public", "warehouse", "files", "glacier", "node_modules", "locales"],
      watch: ["/sites/avnode.admin"],
      watch_options: {
        followSymlinks: false,
        usePolling: true,
        interval: 1000,
        binaryInterval: 3000,
        persistent: true,
        ignoreInitial: true
      },
      time: true,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      env: { NODE_ENV: "production", DEBUG: "false" },
    },
  ],
};
