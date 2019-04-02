git fetch --all
git reset --hard origin/master
git reset --hard HEAD
git pull
forever stop avnode.net
npm run forever
// OR
// NODE_ENV=production forever --uid 'avnode.net' -l /sites/avnode.net/avnode-forever.log -o /sites/avnode.net/avnode-out.log -e /sites/avnode.net/avnode-err.log start --append index.js


cd /sites/avnode.net/
git checkout -f
git pull