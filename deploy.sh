#!/bin/bash
apt-get update

curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -

wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

apt-get update
apt-get install -y nodejs mongodb-org
apt-get install -y gcc g++ make
npm install -g @angular/cli

#unzip package

cd backend
npm install 
cd ..
cd frontend 
npm install
cd ..

mongo < create_db_admin.js
mongo -u administrator -p trabajoFinGrado < init_mongo.js

node --inspect "backend/server.js"
cd frontend
npm run start
cd ..

