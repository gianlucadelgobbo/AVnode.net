avnode
======

Setup
-----

We're using [nvm][nvm] to ensure that all people in the project use the same version of [node.js][nodejs], which is normally the latest LTS version.
We're using [docker][docker] for the database (and later probably the whole project).

[nvm]: https://github.com/creationix/nvm
[nodejs]: https://nodejs.org
[docker]: https://www.docker.com
[mongodb]: https://www.mongodb.com
[elasticsearch]: https://www.elastic.co/

### Quick Start

* Run `nvm use` in this directory to use a compatible version of nodejs.
* Run `docker-compose up -d` in this directory to start up mongodb in docker.
* Copy `example.env.local` to `.env.local`. 
* Run `npm run dev` to run in development mode.
* Create the `warehouse` folder for assets storage.

### Alternative setup for development without Docker

* Setup [node.js][nodejs].
* Setup [mongodb][mongodb].
* Setup [elasticsearch][elasticsearch].
* Run `npm i` to install dependencies.
* If `sharp` package does issues, run `npm i` in `node_modules/sharp` to compile it.
* Copy `example.env.local` to `.env.local`. 
* Run `npm run dev` to run in development mode.
* Create the `warehouse` folder for assets storage.

### Edit .env.local

ACCESSKEYID, SECRETACCESSKEY for AWS
GOOGLEMAPSAPIKEY for google maps.

And other environment variables if needed.
