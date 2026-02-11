@echo off
set MONGODB_URI=mongodb://habibabdulfetah230_db_user:%%24(Gang)22661434@ac-rqntepk-shard-00-00.qhmuuje.mongodb.net:27017/vanguard_db?tls=true&authSource=admin
set DEFAULT_ADMIN_EMAIL=vanguardmarketing123@gmail.com
set DEFAULT_ADMIN_PASSWORD=admin123456
set DEFAULT_ADMIN_NAME=Habib abdulfetah
set JWT_SECRET=super-secure-secret
node server/src/server.js

