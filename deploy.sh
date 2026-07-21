#!/bin/bash
git fetch origin
git checkout origin/master -- .
pm2 reload ecosystem.config.cjs --env production
