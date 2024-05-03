FROM node:18-alpine

RUN apk add --no-cache tini
USER node
WORKDIR /usr/src/app/web
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .

EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--", "/bin/sh"]
