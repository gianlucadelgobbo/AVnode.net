#!/bin/bash
git fetch origin
git checkout origin/v2025 -- .
pm2 delete admin.avnode.net
pm2 start ecosystem.config.cjs --env production
