#!/bin/bash

apt-get update
apt-get install -y curl wget

# Añadir repositorios para última versión de node
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -

# Añadir repositorios para última versión de mongodb
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# Instalar herramientas necesarias
apt-get update
apt-get install -y nodejs mongodb-org
apt-get install -y gcc g++ make ufw

# Establecer firewall y abrir puertos
ufw allow ssh, http, 3000
ufw --force enable

# Instalar node_modules para backend y frontend
cd backend
npm install 
if [ ! -d "media" ]
then
	mkdir -p media/players media/teams
fi
cd ..
cd frontend 
npm install
cd ..

# Correr, configurar e inicializar bbdd mongodb con backup
systemctl enable mongod.service
systemctl start mongod.service
mongo < create_db_admin.js
mongo -u administrator -p trabajoFinGrado < init_mongo.js
mongorestore -u administrator -p trabajoFinGrado --db Actapp ActappDBBackup/Actapp --drop


# Configurar servicio para backend y correrlo
echo "[Unit]
Description=Servidor node Actapp
After=network.target

[Service]
Environment=NODE_PORT=3000
Type=simple
User=root
ExecStart=/usr/local/bin/node /root/proyecto/backend/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
" > /etc/systemd/system/node-server.service
systemctl daemon-reload
systemctl enable node-server.service
systemctl start node-server.service

#Configurar servicio para frontend y correrlo
echo "[Unit]
Description=Cliente angular Actapp
After=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/proyecto/frontend
ExecStart=/root/proyecto/frontend/node_modules/@angular/cli/bin/ng serve --host 0.0.0.0 --port 80 --disableHostCheck
Restart=on-failure

[Install]
WantedBy=multi-user.target
" > /etc/systemd/system/angular-app.service
systemctl daemon-reload
systemctl enable angular-app.service
systemctl start angular-app.service


