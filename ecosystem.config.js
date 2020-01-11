//pm2 deploy ecosystem.config.js production setup
module.exports = {
  apps : [{
    name: 'AVnode',
    script: 'index.js',
    error_file: 'logs/avnode-err.log',
    out_file: 'logs/avnode-out.log',
    log_file: 'logs/avnode-combined.log',
    time: true,
  
    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    //args: 'one two',
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch: ["public","warehouse","glacier","locales","logs"],
    watch_options: {
        followSymlinks: false
    },
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'hyo',
      host : [{host : '176.9.142.221',port : '9922'}],
      ref  : 'origin/master',
      repo : 'git@github.com:gianlucadelgobbo/AVnode.net.git',
      path : '/sites/avnode.net/',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
