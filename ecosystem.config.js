//pm2 deploy ecosystem.config.js production setup
module.exports = {
  apps : [{
    name: "avnode.net",
    max_memory_restart: "600M",
    script: "index.js",
    log_file: "node_avnode-combined.log",
    out_file: "node_avnode-out.log",
    error_file: "node_avnode-err.log",
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
      NODE_ENV: "development"
    },
    env_production: {
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