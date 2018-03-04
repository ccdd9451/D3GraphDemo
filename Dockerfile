FROM node:latest

VOLUME /data
WORKDIR /data

RUN npm install http-server -g
RUN npm install d3 -g
