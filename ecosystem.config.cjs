module.exports = {
  apps: [
    {
      name: "avnode.net",
      //interpreter: "/home/hyo/.nvm/versions/node/v23.8.0/bin/node",
      script: "/sites/avnode.admin/index.js",
      max_memory_restart: "4G",
      log_file: "/sites/logs/node_admin_avnode_net-2025-combined.log",
      out_file: "/sites/logs/node_admin_avnode_net-2025-out.log",
      error_file: "/sites/logs/node_admin_avnode_net-2025-err.log",
      ignore_watch: ["public", "warehouse", "files", "glacier", "node_modules", "locales"],
      args: "",
      time: true,
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: true,
      watch_options: { followSymlinks: false },
      env: { NODE_ENV: "production", DEBUG: "false" },
    },
  ],
};
