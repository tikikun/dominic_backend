#!/bin/zsh

tmux new -d -s dominic_backend "cd /Users/daotuanhome/Documents/codes/dominic_backend && npm run start"

tmux new -d -s aria-rpc "aria2c --conf-path=/Users/daotuanhome/Documents/codes/aria2c-home-services/aria2.conf"

tmux new -d -s aria-webui "cd /Users/daotuanhome/Documents/codes/webui-aria2 && node node-server.js"
