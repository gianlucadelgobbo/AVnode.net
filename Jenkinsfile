#!groovy
node {
	def livePath = '/sites/avnode.net.bruce'
	def node = 'node:boron'
	stage('ls') {
		sh "cd ${livePath} && ls && pwd"
	}	
	stage('Locales') {
		sh "cd ${livePath} && git checkout -- locales/ && git pull"
	}	
	stage('Update source') {
		sh "cd ${livePath} && git pull"
	}
	stage('Update npm dependencies') {
		sh "cd ${livePath} && docker run --rm -v ${livePath}:/data -w /data ${node} npm install"
	}
	stage('Restart all services') {
		def files = '-f docker-compose.yaml -f docker-compose.production.yaml'
		sh "cd ${livePath} && docker-compose ${files} stop && docker-compose ${files} up -d"
	}
}
/*
Jenkins commands in avnode.bruce-staging-deploy
cd /sites/avnode.net.bruce
sudo git fetch --all
sudo git reset --hard origin/master
sudo git pull
sudo npm install
sudo NODE_ENV=production ./node_modules/.bin/webpack
forever stop avnode.bruce
NODE_ENV=production forever --uid "avnode.bruce" start --append index.js
*/