FROM node:12.9.1-alpine@sha256:278fc36a00931926d68435aead5b879d47eafaab97951dd881012f7e3051361e

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


RUN apk add --no-cache git

COPY ./package.json /usr/src/app/package.json
COPY ./package-lock.json /usr/src/app/package-lock.json

RUN npm install

COPY . /usr/src/app