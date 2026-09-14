#!/bin/bash
export PATH="/home/rdpubana16/.nvm/versions/node/v20.19.4/bin:$PATH"
node server.js &
npm run dev -- --host 0.0.0.0 --port 5173
