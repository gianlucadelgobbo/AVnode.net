avnode
======

Setup
-----

We're using [nvm][nvm] to ensure that all people in the project use the same version of [node.js][nodejs], which is normally the latest LTS version.
We're using [docker][docker] for the database (and later probably the whole project).

[nvm]: https://github.com/creationix/nvm
[nodejs]: https://nodejs.org
[docker]: https://www.docker.com

### Quick Start

* Run `nvm use` in this directory to use a compatible version of nodejs.
* Run `docker-compose up -d` in this directory to start up mongodb in docker.
* Copy `example.env.local` to `.env.local`.
* Run `npm run dev` to run in development mode.
