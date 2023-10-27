//pm2 deploy ecosystem.config.js production setup
module.exports = {
  apps : [{
    name: "avnode.net en",
    max_memory_restart: "4G",
    script: "index.js",
    log_file: "/sites/logs/node_en_avnode_net-combined.log",
    out_file: "/sites/logs/node_en_avnode_net-out.log",
    error_file: "/sites/logs/node_en_avnode_net-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "node_modules",
      "locales"
    ],
    "args": "-lang en",
    time: true,
    instances: 1,
    exec_mode: "cluster_mode",
    autorestart: true,
    watch: true,
    watch_options: {
      followSymlinks: false
    },
    env: {
      NODE_ENV: "production"
    }
  },{
    name: "avnode.net be",
    max_memory_restart: "4G",
    script: "index.js",
    log_file: "/sites/logs/node_be_avnode_net-combined.log",
    out_file: "/sites/logs/node_be_avnode_net-out.log",
    error_file: "/sites/logs/node_be_avnode_net-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "locales"
    ],
    "args": "-lang be",
    time: true,
    instances: 1,
    exec_mode: "cluster_mode",
    autorestart: true,
    watch: true,
    watch_options: {
      followSymlinks: false
    },
    env: {
      NODE_ENV: "production"
    }
  },{
    name: "avnode.net de",
    max_memory_restart: "4G",
    script: "index.js",
    log_file: "/sites/logs/node_de_avnode_net-combined.log",
    out_file: "/sites/logs/node_de_avnode_net-out.log",
    error_file: "/sites/logs/node_de_avnode_net-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "locales"
    ],
    "args": "-lang de",
    time: true,
    instances: 1,
    exec_mode: "cluster_mode" or cluster_mode,
    autorestart: true,
    watch: true,
    watch_options: {
      followSymlinks: false
    },
    env: {
      NODE_ENV: "production"
    }
  },{
    name: "avnode.net es",
    max_memory_restart: "4G",
    script: "index.js",
    log_file: "/sites/logs/node_es_avnode_net-combined.log",
    out_file: "/sites/logs/node_es_avnode_net-out.log",
    error_file: "/sites/logs/node_es_avnode_net-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "locales"
    ],
    "args": "-lang es",
    time: true,
    instances: 1,
    exec_mode: "cluster_mode",
    autorestart: true,
    watch: true,
    watch_options: {
      followSymlinks: false
    },
    env: {
      NODE_ENV: "production"
    }
  },{
    name: "avnode.net fr",
    max_memory_restart: "4G",
    script: "index.js",
    log_file: "/sites/logs/node_fr_avnode_net-combined.log",
    out_file: "/sites/logs/node_fr_avnode_net-out.log",
    error_file: "/sites/logs/node_fr_avnode_net-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "locales"
    ],
    "args": "-lang fr",
    time: true,
    instances: 1,
    exec_mode: "cluster_mode",
    autorestart: true,
    watch: true,
    watch_options: {
      followSymlinks: false
    },
    env: {
      NODE_ENV: "production"
    }
  },{
    name: "avnode.net el",
    max_memory_restart: "4G",
    script: "index.js",
    log_file: "/sites/logs/node_el_avnode_net-combined.log",
    out_file: "/sites/logs/node_el_avnode_net-out.log",
    error_file: "/sites/logs/node_el_avnode_net-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "locales"
    ],
    "args": "-lang el",
    time: true,
    instances: 1,
    exec_mode: "cluster_mode",
    autorestart: true,
    watch: true,
    watch_options: {
      followSymlinks: false
    },
    env: {
      NODE_ENV: "production"
    }
  },{
    name: "avnode.net hu",
    max_memory_restart: "4G",
    script: "index.js",
    log_file: "/sites/logs/node_hu_avnode_net-combined.log",
    out_file: "/sites/logs/node_hu_avnode_net-out.log",
    error_file: "/sites/logs/node_hu_avnode_net-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "locales"
    ],
    "args": "-lang hu",
    time: true,
    instances: 1,
    exec_mode: "cluster_mode",
    autorestart: true,
    watch: true,
    watch_options: {
      followSymlinks: false
    },
    env: {
      NODE_ENV: "production"
    }
  },{
    name: "avnode.net it",
    max_memory_restart: "4G",
    script: "index.js",
    log_file: "/sites/logs/node_it_avnode_net-combined.log",
    out_file: "/sites/logs/node_it_avnode_net-out.log",
    error_file: "/sites/logs/node_it_avnode_net-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "locales"
    ],
    "args": "-lang it",
    time: true,
    instances: 1,
    exec_mode: "cluster_mode",
    autorestart: true,
    watch: true,
    watch_options: {
      followSymlinks: false
    },
    env: {
      NODE_ENV: "production"
    }
  },{
    name: "avnode.net pl",
    max_memory_restart: "4G",
    script: "index.js",
    log_file: "/sites/logs/node_pl_avnode_net-combined.log",
    out_file: "/sites/logs/node_pl_avnode_net-out.log",
    error_file: "/sites/logs/node_pl_avnode_net-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "locales"
    ],
    "args": "-lang pl",
    time: true,
    instances: 1,
    exec_mode: "cluster_mode",
    autorestart: true,
    watch: true,
    watch_options: {
      followSymlinks: false
    },
    env: {
      NODE_ENV: "production"
    }
  },{
    name: "avnode.net pt",
    max_memory_restart: "4G",
    script: "index.js",
    log_file: "/sites/logs/node_pt_avnode_net-combined.log",
    out_file: "/sites/logs/node_pt_avnode_net-out.log",
    error_file: "/sites/logs/node_pt_avnode_net-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "locales"
    ],
    "args": "-lang pt",
    time: true,
    instances: 1,
    exec_mode: "cluster_mode",
    autorestart: true,
    watch: true,
    watch_options: {
      followSymlinks: false
    },
    env: {
      NODE_ENV: "production"
    }
  },{
    name: "avnode.net ru",
    max_memory_restart: "4G",
    script: "index.js",
    log_file: "/sites/logs/node_ru_avnode_net-combined.log",
    out_file: "/sites/logs/node_ru_avnode_net-out.log",
    error_file: "/sites/logs/node_ru_avnode_net-err.log",
    ignore_watch: [
      "public",
      "warehouse",
      "glacier",
      "locales"
    ],
    "args": "-lang ru",
    time: true,
    instances: 1,
    exec_mode: "cluster_mode",
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