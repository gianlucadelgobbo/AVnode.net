//pm2 deploy ecosystem.config.js production setup
module.exports = {
  apps : [{
    name: "avnode.net",
    max_memory_restart: "2G",
    script: "index.js",
    log_file: "/sites/logs/node_avnode_net-combined.log",
    out_file: "/sites/logs/node_avnode_net-out.log",
    error_file: "/sites/logs/node_avnode_net-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "locales"
    ],
    time: true,
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    watch: true,
    watch_options: {
      followSymlinks: false
    },
    env: {
      NODE_ENV: "production"
    }
  }],

  deploy : {
    production : {
      user : "hyo",
      host : [{host : "176.9.142.221",port : "9922"}],
      ref  : "origin/master",
      repo : "git@github.com:gianlucadelgobbo/AVnode.net.git",
      path : "",
      "post-deploy" : "npm install && pm2 reload ecosystem.config.js --env production"
    }
  }
};