//pm2 deploy ecosystem.config.js production setup
module.exports = {
  apps : [{
    name: 'AVnode',
    script: 'index.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
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
      repo : 'git@github.com:repo.git',
      path : '/sites/avnode.net',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
